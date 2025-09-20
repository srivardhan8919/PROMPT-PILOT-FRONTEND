
# PromptPilot Frontend

This is the React frontend for PromptPilot, an AI-powered prompt improvement assistant. It features a modern, responsive chat interface and context-aware prompt enhancement.

---

## Features

- Netflix-style startup animation with typing effect
- Responsive, minimalist chat UI
- Auto-scroll to latest message
- User messages right-aligned; AI messages left-aligned
- Authentication (login/signup)
- Context-aware replies based on previous prompts

---

## Getting Started

### 1. Install dependencies
```sh
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and set your backend URL:
```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

### 3. Run the app
```sh
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

- Deploy to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) (free tier)
- Set `REACT_APP_BACKEND_URL` to your backend URL in the deployment dashboard

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
├── public/
├── .env.example
└── package.json
```

---

## Example Use Cases

- Prompt engineering for AI models
- Image generation prompt improvement
- Coding prompt refinement
- Social media content creation

---

## License

MIT
