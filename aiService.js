const axios = require('axios');

async function getAIResponse(question, apiKey) {
  if (!question || typeof question !== 'string') {
    throw new Error('Question must be a non-empty string');
  }
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `Answer the following question with ONLY ONE WORD. No explanations, no punctuation, just a single word answer:\n\n${question}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 50,
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!answer) {
      throw new Error('No response from AI model');
    }
    
    const cleanAnswer = answer.trim().split(/\s+/)[0].replace(/[.,!?;:]$/g, '');
    
    return cleanAnswer;
    
  } catch (error) {
    if (error.response) {
      throw new Error(`AI API error: ${error.response.data?.error?.message || error.message}`);
    } else if (error.request) {
      throw new Error('AI service unavailable');
    } else {
      throw error;
    }
  }
}

module.exports = {
  getAIResponse
};
