const Interview = require('../models/interviewModel');
const logger = require('../config/logger');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to call Gemini API with retry on rate limit
const callGeminiAPI = async (systemInstruction, history) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: { text: systemInstruction }
    },
    contents: history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts.map(p => ({ text: p.text }))
    }))
  };

  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.post(GEMINI_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        return response.data.candidates[0].content.parts[0].text;
      }
      throw new Error('Unexpected API response structure');
    } catch (error) {
      const status = error.response?.status;
      const isRateLimit = status === 429;
      const isServerError = status >= 500;

      if (attempt < maxAttempts && (isRateLimit || isServerError)) {
        const backoffMs = isRateLimit ? 30000 : 1000 * Math.pow(2, attempt); // 30s for rate limit, exp backoff for 5xx
        logger.warn(`Gemini API attempt ${attempt} failed (status ${status}). Retrying in ${backoffMs}ms...`);
        await wait(backoffMs);
        continue;
      }

      logger.error(`Gemini API Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
      throw new Error('Failed to generate response from Gemini AI');
    }
  }
};

// 1. Start Interview
exports.startInterview = async (req, res) => {
  try {
    const studentId = req.user.id;
    let { topic, company } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    
    // Default company if not provided by frontend
    if (!company) {
      company = 'a top tech company';
    }

    // Create a new interview instance
    const interview = new Interview({
      studentId,
      topic,
      company,
      history: []
    });

    const systemInstruction = `You are an expert technical interviewer hiring a ${topic} for ${company}. Be professional but slightly strict. First, greet the candidate (they have logged in and are ready), briefly state the role and company, and ask your very first technical question. Keep it under 3 sentences.`;
    
    // We send an initial triggering "user" message to kick off Gemini, even though it's technically a prompt
    const initialDialog = [{
      role: 'user',
      parts: [{ text: "Hello, I am ready to start my interview." }]
    }];

    const aiResponseText = await callGeminiAPI(systemInstruction, initialDialog);

    // Save history. Both the trigger phrase and the AI's first question.
    interview.history.push({
      role: 'user',
      parts: [{ text: "Hello, I am ready to start my interview." }]
    });
    interview.history.push({
      role: 'model',
      parts: [{ text: aiResponseText }]
    });

    await interview.save();

    res.status(201).json({
      message: 'Interview started successfully',
      interviewId: interview._id,
      question: aiResponseText
    });
  } catch (error) {
    logger.error(`Error in startInterview: ${error.message}`);
    res.status(500).json({ message: 'Server error during interview initialization' });
  }
};

// 2. Handle Student Answer
exports.handleStudentAnswer = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;
    const studentId = req.user.id;

    if (!interviewId || !answer) {
      return res.status(400).json({ message: 'interviewId and answer are required' });
    }

    const interview = await Interview.findOne({ _id: interviewId, studentId });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    if (interview.status !== 'ongoing') {
      return res.status(400).json({ message: `Interview is already ${interview.status}` });
    }

    // Append user answer to history
    interview.history.push({
      role: 'user',
      parts: [{ text: answer }]
    });

    // Generate the next question
    const systemInstruction = `You are an expert technical interviewer hiring a ${interview.topic} for ${interview.company}. Respond naturally to the candidate's last answer, point out any major flaws nicely if there are any, and ask the next technical question. If they have answered at least 5 questions reasonably well, you may wrap up the interview and say "We are done with the interview". Keep responses concise.`;

    const aiResponseText = await callGeminiAPI(systemInstruction, interview.history);

    // Save AI response
    interview.history.push({
      role: 'model',
      parts: [{ text: aiResponseText }]
    });

    await interview.save();

    res.status(200).json({
      message: 'Answer processed',
      nextQuestion: aiResponseText
    });
  } catch (error) {
    logger.error(`Error in handleStudentAnswer: ${error.message}`);
    res.status(500).json({ message: 'Server error processing answer' });
  }
};

// 3. End Interview
exports.endInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const studentId = req.user.id;

    if (!interviewId) {
      return res.status(400).json({ message: 'interviewId is required' });
    }

    const interview = await Interview.findOne({ _id: interviewId, studentId });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    // Create a scoring prompt
    const scoringPrompt = [{
      role: 'user',
      parts: [{ text: "The interview has concluded. Please evaluate the entire transcript. Reply with ONLY a strictly valid JSON object exactly in this format, with no markdown formatting or extra text: { \"score\": 85, \"feedback\": \"A paragraph of constructive feedback detailing strengths and areas for improvement.\" }" }]
    }];

    // Combine history with scoring prompt
    const fullHistory = [...interview.history, ...scoringPrompt];
    
    const systemInstruction = `You are an expert technical interviewer hiring a ${interview.topic} for ${interview.company}.`;

    const aiResponseText = await callGeminiAPI(systemInstruction, fullHistory);

    let score = 0;
    let feedback = "No feedback generated.";

    try {
      // Clean up markdown block if API returns it
      const cleanJsonStr = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      score = parsed.score || 0;
      feedback = parsed.feedback || "Feedback unavailable.";
    } catch (parseError) {
      logger.error(`Failed to parse AI score JSON: ${aiResponseText}`);
      feedback = aiResponseText; // fallback to the raw text just in case
    }

    interview.status = 'completed';
    interview.score = score;
    interview.feedback = feedback;
    interview.endTime = new Date();
    // Calculate duration in seconds
    interview.duration = Math.floor((interview.endTime.getTime() - interview.startTime.getTime()) / 1000);

    await interview.save();

    res.status(200).json({
      message: 'Interview completed',
      score: interview.score,
      feedback: interview.feedback,
      duration: interview.duration
    });
  } catch (error) {
    logger.error(`Error in endInterview: ${error.message}`);
    res.status(500).json({ message: 'Server error completing interview' });
  }
};

// 4. Get specific interview
exports.getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const studentId = req.user.id;
    
    const interview = await Interview.findOne({ _id: interviewId, studentId });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ interview });
  } catch (error) {
    logger.error(`Error in getInterview: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching interview' });
  }
};

// 5. Get all interviews for student
exports.getStudentInterviews = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check if the requested studentId matches the logged-in user (basic authorization check)
    if (studentId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view these interviews' });
    }

    const interviews = await Interview.find({ studentId }).sort({ createdAt: -1 });

    res.status(200).json({ interviews });
  } catch (error) {
    logger.error(`Error in getStudentInterviews: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching interviews' });
  }
};
