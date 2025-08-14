import React, { useEffect, useState } from 'react';
import './StartupScreen.css';

const description = "Prompt Pilot: Your AI assistant. Loading backend...";

function StartupScreen({ onReady, backendUrl }) {
  const [typed, setTyped] = useState('');
  const [checking, setChecking] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [error, setError] = useState('');

  // Typing effect
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setTyped(description.slice(0, i));
      i++;
      if (i > description.length) clearInterval(typing);
    }, 50);
    return () => clearInterval(typing);
  }, []);

  // Backend health check after animation
  useEffect(() => {
    if (typed === description) {
      setChecking(true);
      const checkBackend = () => {
        fetch(`${backendUrl}/api/health`)
          .then(res => {
            if (res.ok) {
              setBackendReady(true);
              setError('');
              setTimeout(onReady, 800); // Small delay before transition
            } else {
              setError('Backend not ready. Retrying...');
              setTimeout(checkBackend, 2000);
            }
          })
          .catch(() => {
            setError('Backend not ready. Retrying...');
            setTimeout(checkBackend, 2000);
          });
      };
      checkBackend();
    }
  }, [typed, backendUrl, onReady]);

  return (
    <div className="startup-screen">
      <div className="logo-animation">Prompt Pilot</div>
      <div className="typing-desc">{typed}</div>
      {checking && !backendReady && (
        <div className="backend-status">
          {error || 'Checking backend...'}
        </div>
      )}
    </div>
  );
}

export default StartupScreen;
