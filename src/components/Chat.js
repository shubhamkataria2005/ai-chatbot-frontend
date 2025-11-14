import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

const Chat = ({ user, sessionToken }) => {
  const [messages, setMessages] = useState([
    { text: `Hello ${user.username}! 👋 I'm your AI assistant. How can I help you today?`, sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken
        },
        body: JSON.stringify({ message: inputText })
      });

      const data = await response.json();
      
      if (data.error) {
        // Authentication error
        const errorMessage = { 
          text: "Authentication error. Please login again.", 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      
      // Add bot response
      const botMessage = { 
        text: data.response, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble connecting to the server. Please try again.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { text: `Chat cleared! Hello ${user.username}, how can I help you?`, sender: 'bot' }
    ]);
  };

  // Quick question suggestions
  const quickQuestions = [
    "What is your name?",
    "what are you studying",
    "what is your interests",
    "what projects have you worked on",
    "What can you help me with?"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <div className="chat-container">
      {/* Header - Simplified for Dashboard */}
      <div className="chat-header">
        <div className="header-content">
          <h1>💬 AI Chatbot</h1>
          <p>Chat with your intelligent AI assistant</p>
        </div>
        <button className="clear-button" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
      
      {/* Quick Questions */}
      <div className="quick-questions">
        <p>Try asking:</p>
        <div className="question-chips">
          {quickQuestions.map((question, index) => (
            <span 
              key={index}
              className="question-chip"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-bubble">
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-bubble loading">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send)"
          rows={2}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !inputText.trim()}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;