# Chitkara Qualifier API

REST API for Chitkara University Qualifier 1 - Feb 10, 2026

## Quick Start

**Install dependencies:**
```bash
npm install
```

**Set up your .env file:**
```env
PORT=3000
OFFICIAL_EMAIL=your.email@chitkara.edu.in
GEMINI_API_KEY=your_gemini_api_key
```

Get your free Gemini API key from [aistudio.google.com](https://aistudio.google.com)

**Run the server:**
```bash
npm start
```

Server runs at `http://localhost:3000`

## API Endpoints

**GET /health**
```json
{ "is_success": true, "official_email": "your.email@chitkara.edu.in" }
```

**POST /bfhl**

Send one operation at a time:

Fibonacci:
```json
{ "fibonacci": 7 }
// Returns: [0, 1, 1, 2, 3, 5, 8]
```

Prime Numbers:
```json
{ "prime": [2, 4, 7, 9, 11] }
// Returns: [2, 7, 11]
```

LCM:
```json
{ "lcm": [12, 18, 24] }
// Returns: 72
```

HCF:
```json
{ "hcf": [24, 36, 60] }
// Returns: 12
```

AI Question:
```json
{ "AI": "What is the capital city of Maharashtra?" }
// Returns: "Mumbai"
```

All responses follow this format:
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": "result here"
}
```

## Testing

Using curl:
```bash
curl http://localhost:3000/health

curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 7}'
```

Or use Postman to test the endpoints.

## Deploy

Push your code to GitHub (make it public), then deploy to:
- **Vercel** - vercel.com (recommended)
- **Railway** - railway.app  
- **Render** - render.com

Don't forget to add your environment variables (OFFICIAL_EMAIL and GEMINI_API_KEY) in the hosting platform.

## Project Files

- `server.js` - Main API server
- `utils.js` - Math functions (fibonacci, prime, lcm, hcf)
- `aiService.js` - Google Gemini integration
- `.env` - Your config (create this)

## Common Issues

**AI not working?** Check your GEMINI_API_KEY in .env

**Port in use?** Change PORT in .env or kill the process

**Module errors?** Run `npm install` again

## What's Inside

- Input validation for all operations
- Rate limiting (100 requests per 15 min)
- Security headers (Helmet)
- Error handling
- Google Gemini AI (gemini-2.5-flash)

That's it! Build, test, deploy, and submit your GitHub + deployed URL.

---
Made for Chitkara Qualifier 1
