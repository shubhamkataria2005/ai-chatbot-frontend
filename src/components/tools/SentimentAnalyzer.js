import React, { useState } from 'react';
import './Tools.css';
import { API_BASE_URL } from '../../config';

const SentimentAnalyzer = ({ sessionToken }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-tools/sentiment-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken
        },
        body: JSON.stringify({ text: text })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.message || 'Analysis failed');
      } else {
        setResult(data);
      }
    } catch (error) {
      setError('Network error. Please check if backend is running.');
      console.error('Sentiment analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE': return '#10b981';
      case 'NEGATIVE': return '#ef4444';
      case 'NEUTRAL': return '#6b7280';
      case 'MIXED': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE': return '😊';
      case 'NEGATIVE': return '😠';
      case 'NEUTRAL': return '😐';
      case 'MIXED': return '😕';
      default: return '🤔';
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>📊 Sentiment Analyzer</h1>
        <p>Discover the emotional tone behind any text using AI</p>
      </div>

      <div className="input-section">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze (reviews, comments, tweets, feedback...)"
          rows={6}
          disabled={loading}
        />
        <button 
          onClick={analyzeSentiment} 
          disabled={loading || !text.trim()}
          className="analyze-btn"
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="result-section">
          <h3>Analysis Result:</h3>
          <div 
            className="sentiment-result"
            style={{ borderLeftColor: getSentimentColor(result.sentiment) }}
          >
            <div className="sentiment-icon" style={{ color: getSentimentColor(result.sentiment) }}>
              {getSentimentEmoji(result.sentiment)}
            </div>
            <div className="sentiment-details">
              <div className="sentiment-type" style={{ color: getSentimentColor(result.sentiment) }}>
                {result.sentiment} 
                {result.confidence && <span className="confidence"> ({result.confidence}% confident)</span>}
              </div>
              {result.analysis && (
                <div className="analysis-text">{result.analysis}</div>
              )}
              {result.textLength && (
                <div className="text-stats">
                  <small>Text Length: {result.textLength} characters</small>
                  {result.wordCount && <small> • Words: {result.wordCount}</small>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="examples">
        <h4>💡 Try these examples:</h4>
        <div className="example-chips">
          <span onClick={() => setText("I absolutely love this product! It's amazing and works perfectly!")}>
            "I love this product!"
          </span>
          <span onClick={() => setText("This is the worst experience I've ever had. Terrible service and poor quality.")}>
            "Worst experience ever"
          </span>
          <span onClick={() => setText("The meeting will be at 3 PM in conference room B. Please bring your laptops.")}>
            "Meeting at 3 PM"
          </span>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;