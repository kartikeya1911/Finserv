require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const {
  generateFibonacci,
  filterPrimes,
  calculateHCF,
  calculateLCM
} = require('./utils');
const { getAIResponse } = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = (process.env.OFFICIAL_EMAIL || 'your.email@chitkara.edu.in').trim();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : undefined;

app.use(helmet());
app.use(express.json({ limit: '10mb' }));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

app.post('/bfhl', async (req, res) => {
  try {
    const body = req.body;
    
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: 'Request body is required'
      });
    }
    
    const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
    const providedKeys = Object.keys(body).filter(key => validKeys.includes(key));
    
    if (providedKeys.length === 0) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: 'Request must contain one of: fibonacci, prime, lcm, hcf, AI'
      });
    }
    
    if (providedKeys.length > 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: 'Request must contain exactly one operation key'
      });
    }
    
    const operationKey = providedKeys[0];
    const inputValue = body[operationKey];
    
    let result;
    
    switch (operationKey) {
      case 'fibonacci':
        if (typeof inputValue !== 'number' || !Number.isInteger(inputValue)) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Fibonacci input must be an integer'
          });
        }
        
        if (inputValue < 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Fibonacci input must be non-negative'
          });
        }
        
        if (inputValue > 1000) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Fibonacci input too large (max: 1000)'
          });
        }
        
        result = generateFibonacci(inputValue);
        break;
        
      case 'prime':
        if (!Array.isArray(inputValue)) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Prime input must be an array of integers'
          });
        }
        
        if (inputValue.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Prime input array cannot be empty'
          });
        }
        
        if (inputValue.length > 10000) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Prime input array too large (max: 10000 elements)'
          });
        }
        
        // Validate all elements are integers
        if (!inputValue.every(num => Number.isInteger(num))) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'All prime array elements must be integers'
          });
        }
        
        result = filterPrimes(inputValue);
        break;
        
      case 'lcm':
        if (!Array.isArray(inputValue)) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'LCM input must be an array of integers'
          });
        }
        
        if (inputValue.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'LCM input array cannot be empty'
          });
        }
        
        if (inputValue.length > 100) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'LCM input array too large (max: 100 elements)'
          });
        }
        
        if (!inputValue.every(num => Number.isInteger(num))) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'All LCM array elements must be integers'
          });
        }
        
        result = calculateLCM(inputValue);
        break;
        
      case 'hcf':
        if (!Array.isArray(inputValue)) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'HCF input must be an array of integers'
          });
        }
        
        if (inputValue.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'HCF input array cannot be empty'
          });
        }
        
        if (inputValue.length > 100) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'HCF input array too large (max: 100 elements)'
          });
        }
        
        if (!inputValue.every(num => Number.isInteger(num))) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'All HCF array elements must be integers'
          });
        }
        
        result = calculateHCF(inputValue);
        break;
        
      case 'AI':
        if (typeof inputValue !== 'string') {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'AI input must be a string'
          });
        }
        
        if (inputValue.trim().length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'AI question cannot be empty'
          });
        }
        
        if (inputValue.length > 1000) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'AI question too long (max: 1000 characters)'
          });
        }
        
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
          return res.status(503).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'AI service not configured'
          });
        }
        
        try {
          result = await getAIResponse(inputValue, GEMINI_API_KEY);
        } catch (aiError) {
          return res.status(503).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: aiError.message
          });
        }
        break;
        
      default:
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: 'Invalid operation'
        });
    }
    
    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: result
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error.message.includes('must be')) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: error.message
      });
    }
    
    res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: 'Internal server error'
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    error: 'Endpoint not found'
  });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Official email: ${OFFICIAL_EMAIL}`);
  console.log(`AI service: ${GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health`);
  console.log(`  POST /bfhl`);
});

module.exports = app;
