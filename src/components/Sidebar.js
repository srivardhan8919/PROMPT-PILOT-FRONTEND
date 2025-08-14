import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '×' : '≡'}
      </button>

      {isOpen && (
        <>
          {/* Top section: app name or logo */}
          <div className="sidebar-top">
            <h2 className="sidebar-app-title">AI visit bar</h2>
          </div>

          {/* Spacer to push icons to bottom */}
          <div className="sidebar-spacer" />

          {/* Bottom section: AI tools */}
          <div className="sidebar-bottom">
            <button
              className="ai-tool-button"
              onClick={() => window.open('https://chat.openai.com/', '_blank')}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                alt="ChatGPT"
                className="ai-tool-icon"
              />
              <span>ChatGPT</span>
            </button>

            <button
              className="ai-tool-button"
              onClick={() => window.open('https://gemini.google.com/', '_blank')}
            >
              <img
                src="https://www.iconpacks.net/icons/free-icons-7/free-google-gemini-logomark-icon-24438-thumb.png"
                alt="Gemini"
                className="ai-tool-icon"
              />
              <span>Gemini</span>
            </button>

            <button
              className="ai-tool-button"
              onClick={() => window.open('https://grok.com/?referrer=website', '_blank')}
            >
              <img
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/grok.png"
                alt="Grok"
                className="ai-tool-icon"
              />
              <span>Grok</span>
            </button>

            <button
              className="ai-tool-button"
              onClick={() => window.open('https://chat.deepseek.com/', '_blank')}
            >
              <img
                src="https://freepnglogo.com/images/all_img/deep-seek-logo-whale-1ced.png"
                alt="DeepSeek"
                className="ai-tool-icon"
              />
              <span>DeepSeek</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
