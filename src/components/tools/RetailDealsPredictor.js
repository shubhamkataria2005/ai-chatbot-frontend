import React, { useState } from 'react';
import './Tools.css';
import { API_BASE_URL } from '../../config';

const RetailDealsPredictor = ({ sessionToken }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8080/api/retail/upload-sales-data', {
        method: 'POST',
        headers: {
          'Authorization': sessionToken
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadedFiles(prev => [...prev, ...data.uploadedFiles]);
        setError('');
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const analyzeSalesData = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload sales data first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/retail/analyze-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken
        },
        body: JSON.stringify({
          fileIds: uploadedFiles.map(file => file.id)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data);
        setActiveTab('results');
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (error) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const trainModelInColab = async () => {
    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/retail/train-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken
        },
        body: JSON.stringify({
          fileIds: uploadedFiles.map(file => file.id)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(prev => ({
          ...prev,
          modelTraining: data
        }));
        setError('');
      } else {
        setError(data.message || 'Model training failed');
      }
    } catch (error) {
      setError('Model training failed. Please try again.');
      console.error('Training error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>🛍️ Retail Analytics Dashboard</h1>
        <p>Upload purchase slips and sales data to predict optimal deals using AI</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📁 Upload Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={!analysisResult}
        >
          📊 Analysis Results
        </button>
        <button 
          className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
          disabled={!analysisResult}
        >
          🤖 AI Predictions
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="upload-section">
          <div className="upload-area">
            <div className="upload-box">
              <input
                type="file"
                id="salesFiles"
                multiple
                accept=".csv,.xlsx,.xls,.pdf,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="salesFiles" className="upload-label">
                <div className="upload-icon">📁</div>
                <h3>Upload Purchase Slips & Sales Data</h3>
                <p>Supported formats: CSV, Excel, PDF, TXT</p>
                <button className="browse-button">
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </button>
              </label>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h4>Uploaded Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map(file => (
                <div key={file.id} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{file.size}</span>
                  <button 
                    className="remove-file"
                    onClick={() => removeFile(file.id)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              
              <div className="analysis-actions">
                <button 
                  onClick={analyzeSalesData}
                  disabled={analyzing}
                  className="analyze-btn"
                >
                  {analyzing ? 'Analyzing...' : '📊 Analyze Sales Data'}
                </button>
                
                <button 
                  onClick={trainModelInColab}
                  disabled={analyzing}
                  className="train-btn"
                >
                  {analyzing ? 'Training...' : '🤖 Train AI Model in Colab'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && analysisResult && (
        <div className="results-section">
          <h3>📈 Sales Analysis Results</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{analysisResult.totalSales || '0'}</div>
              <div className="stat-label">Total Sales</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analysisResult.topProduct || 'N/A'}</div>
              <div className="stat-label">Top Product</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analysisResult.avgTransaction || '0'}</div>
              <div className="stat-label">Avg Transaction</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analysisResult.seasonalTrend || 'Stable'}</div>
              <div className="stat-label">Seasonal Trend</div>
            </div>
          </div>

          {analysisResult.insights && (
            <div className="insights-section">
              <h4>💡 Key Insights</h4>
              <ul>
                {analysisResult.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && analysisResult && (
        <div className="predictions-section">
          <h3>🤖 AI Deal Predictions</h3>
          
          <div className="prediction-cards">
            <div className="prediction-card best-deal">
              <h4>🎯 Best Performing Deal</h4>
              <div className="deal-details">
                <div className="deal-type">Bundle Discount</div>
                <div className="deal-discount">25% OFF</div>
                <div className="deal-metric">+45% Expected Sales</div>
              </div>
            </div>
            
            <div className="prediction-card">
              <h4>📊 Recommended Strategy</h4>
              <ul>
                <li>Run weekend flash sales</li>
                <li>Bundle complementary products</li>
                <li>Target email campaigns</li>
                <li>Optimize inventory for top items</li>
              </ul>
            </div>
          </div>

          <div className="colab-integration">
            <h4>🔗 Colab Model Integration</h4>
            <p>Your sales data is ready for advanced AI modeling in Google Colab.</p>
            <button className="colab-btn">
              📊 Open in Google Colab
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <div className="tool-info">
        <h4>ℹ️ How it works:</h4>
        <ol>
          <li><strong>Upload</strong> your purchase slips and sales data</li>
          <li><strong>Analyze</strong> patterns and trends in your sales</li>
          <li><strong>Train</strong> AI models in Google Colab with your data</li>
          <li><strong>Predict</strong> optimal deals and discounts</li>
        </ol>
      </div>
    </div>
  );
};

export default RetailDealsPredictor;