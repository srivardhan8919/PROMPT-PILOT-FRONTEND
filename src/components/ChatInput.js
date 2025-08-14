// frontend/src/components/ChatInput.js
import React from 'react';
import './ChatInput.css';

function ChatInput({ input, setInput, handleSend, disabled = false, placeholder = "Enter your prompt..." }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleButtonClick = () => {
    handleSend();
  };

  return (
    <div className="chat-input-bar">
      <textarea
        rows="1"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="chat-input"
        disabled={disabled}
      />
      <button 
        onClick={handleButtonClick} 
        className="send-button"
        disabled={disabled}
      >
        {disabled ? '...' : '→'}
      </button>
    </div>
  );
}

export default ChatInput;
