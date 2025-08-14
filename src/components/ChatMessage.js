import React, { useState, useEffect } from 'react';
import './ChatMessage.css';

function ChatMessage({ role, text, loading = false, onEditSave }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [displayText, setDisplayText] = useState('');

  // Typing animation for AI
  useEffect(() => {
    if (role === 'ai' && !loading) {
      let i = 0;
      let newText = '';
      setDisplayText(''); // Clear display text initially
      
      const interval = setInterval(() => {
        newText += text.charAt(i);  // Append the next character to newText
        setDisplayText(newText);  // Set the new text in displayText state
        i++;
        
        if (i >= text.length) {
          clearInterval(interval);
        }
      }, 30); // Adjust the speed here (in ms)
      
      return () => clearInterval(interval);  // Cleanup interval when the component unmounts
    } else {
      setDisplayText(text);  // If not loading, show the full message immediately
    }
  }, [text, role, loading]);  // Depend on text, role, and loading

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = () => {
    setEditing(false);
    if (onEditSave && editedText !== text) {
      onEditSave(editedText); // Call the onEditSave function passed from parent (Home.js)
    }
  };

  return (
    <div className={`chat-msg ${role} ${loading ? 'loading' : ''}`}>
      <div className="msg-wrapper">
        <div className="msg-bubble">
          {loading ? (
            <div className="loading-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          ) : editing ? (
            <textarea
              className="edit-textarea"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              autoFocus
            />
          ) : (
            displayText
          )}
        </div>

        {!loading && (
          <div className="message-actions">
            <button onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</button>
            {role === 'user' && (
              editing ? (
                <button onClick={handleSaveEdit}>Save</button>
              ) : (
                <button onClick={handleEdit}>Edit</button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
