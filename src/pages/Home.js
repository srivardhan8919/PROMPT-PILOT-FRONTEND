import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { llmService, authService } from '../services/api';
import './Home.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can log the error to a monitoring service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please reload the page.</div>;
    }
    return this.props.children;
  }
}

function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatWindowRef = useRef(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    // This is a placeholder for your actual auth check.
    // Replace with your actual authentication logic.
    if (!authService.isAuthenticated()) { 
      navigate('/login'); // Redirect to your login route if not authenticated
    }
  }, [navigate]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Simple intent detection from the last AI message
  const detectIntent = (lastAiText) => {
    if (!lastAiText) return null;
    const text = lastAiText.toLowerCase();
    if (text.includes('image') || text.includes('photo') || text.includes('generate')) {
      return 'image_generation';
    }
    if (text.includes('code') || text.includes('function')) {
      return 'coding';
    }
    // Add more rules as needed
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const promptText = input.trim();
    const userMessage = { id: Date.now(), role: 'user', text: promptText };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let previousIntent = null;
      // Find the last AI message to determine context
      const lastAiMessage = [...messages].reverse().find(m => m.role === 'ai');
      if (lastAiMessage) {
          previousIntent = detectIntent(lastAiMessage.text);
      }
      
      console.log("Sending prompt to improve:", promptText, "Previous intent:", previousIntent);
      const response = await llmService.improvePrompt(promptText, previousIntent);
      const improvedPrompt = response.improved_prompt;

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: improvedPrompt }
      ]);
    } catch (error) {
      console.error('Error improving prompt:', error);
      let errorMessage = "Sorry, I couldn't improve your prompt. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = "Your prompt is too short. Please provide a prompt with at least 10 characters.";
      }
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (index, newText) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = newText;

    // If an AI response follows the edited message, remove it to generate a new one
    if (updatedMessages[index + 1]?.role === 'ai') {
      updatedMessages.splice(index + 1, 1);
    }

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await llmService.improvePrompt(newText);
      const improvedPrompt = response.improved_prompt;
      
      // Add the new AI response
      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'ai', text: improvedPrompt }
      ]);
    } catch (error) {
      console.error('Error improving edited prompt:', error);
      const fallback = {
        id: Date.now(),
        role: 'ai',
        text: "Something went wrong while improving the edited prompt."
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="home-wrapper">
        <Sidebar />
        <main className="chat-area">
          <Header />
          <div className="chat-window" ref={chatWindowRef}>
            {messages.length === 0 ? (
              <div className="empty-state">
                <h3>Welcome to PromptPilot!</h3>
                <p>Enter a prompt below and I'll help you improve it.</p>
                <p className="hint">Try something like: "Create an image of a sunset over the ocean"</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id} // Use unique ID for key
                  role={msg.role}
                  text={msg.text}
                  onEditSave={
                    msg.role === 'user'
                      ? (newText) => handleEditSave(idx, newText)
                      : undefined
                  }
                />
              ))
            )}
            {loading && <ChatMessage role="ai" text="Improving your prompt..." loading={true} />}
          </div>
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            disabled={loading}
            placeholder="Enter a prompt to improve... (min. 10 characters)"
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default Home;