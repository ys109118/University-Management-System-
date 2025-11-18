import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseApiURL } from '../baseUrl';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: '🕷️ Hey there! I\'m Spidey Bot, your friendly neighborhood College Management assistant. With great power comes great responsibility - and I\'m here to help you navigate the system! What can I do for you?', 
      time: new Date(),
      avatar: '🕷️',
      id: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [messageCount, setMessageCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Generate session ID on component mount
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    
    // Check for dark mode preference - default to light theme
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    
    // Check connection status
    const checkConnection = async () => {
      try {
        await axios.get(`${baseApiURL()}/chatbot/status`);
        setConnectionStatus('online');
      } catch (error) {
        setConnectionStatus('offline');
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (messageText = null) => {
    const userMessage = messageText || inputMessage.trim();
    if (!userMessage || isLoading) return;

    const newUserMessage = {
      type: 'user', 
      text: userMessage, 
      time: new Date(),
      avatar: '👤',
      id: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setShowSuggestions(false);
    setMessageCount(prev => prev + 1);

    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      const response = await axios.post(`${baseApiURL()}/chatbot/query`, {
        message: userMessage,
        sessionId: sessionId,
        userContext: {
          messageCount: messageCount + 1,
          timestamp: new Date().toISOString()
        }
      });
      
      const { response: responseText, suggestions } = response.data.data;
      
      // Realistic typing simulation based on response length
      const baseDelay = 800;
      const typingSpeed = 30; // ms per character
      const maxDelay = 3000;
      const typingDelay = Math.min(baseDelay + (responseText.length * typingSpeed), maxDelay);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        const botMessage = {
          type: 'bot', 
          text: responseText, 
          time: new Date(),
          avatar: '🕷️',
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        
        // Update smart suggestions if provided
        if (suggestions && suggestions.length > 0) {
          setSmartSuggestions(suggestions);
        }
        
        setConnectionStatus('online');
      }, typingDelay);
      
    } catch (error) {
      console.error('Chat error:', error);
      setConnectionStatus('error');
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        const errorMessage = {
          type: 'bot', 
          text: connectionStatus === 'offline' 
            ? '🕸️ My web seems tangled! Check your connection and try again.' 
            : '🕷️ Even Spider-Man has off days! Try again in a moment.\n\n💡 **Quick help:** Admin login is ID: 123456, Password: admin123',
          time: new Date(),
          avatar: '🕷️',
          id: Date.now() + 1,
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
    setSmartSuggestions([]);
  };

  const clearChat = () => {
    setMessages([
      { 
        type: 'bot', 
        text: '🕸️ Web cleared! Your friendly neighborhood Spidey Bot is still here. What\'s next?', 
        time: new Date(),
        avatar: '🕷️',
        id: Date.now()
      }
    ]);
    setShowSuggestions(true);
    setSmartSuggestions([]);
    setMessageCount(0);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'bg-green-400';
      case 'offline': return 'bg-red-400';
      case 'error': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'online': return 'Online • Ready to help';
      case 'offline': return 'Offline • Check connection';
      case 'error': return 'Error • Retrying...';
      default: return 'Connecting...';
    }
  };

  const quickActions = [
    { text: '🚀 Getting Started', query: 'I\'m new to this system, where should I start?', color: 'from-blue-50 to-indigo-50 border-blue-200' },
    { text: '🔐 Login Help', query: 'How do I login to the system?', color: 'from-green-50 to-emerald-50 border-green-200' },
    { text: '📊 Live Dashboard', query: 'Show me system statistics and overview', color: 'from-purple-50 to-violet-50 border-purple-200' },
    { text: '✨ Features Guide', query: 'What amazing features are available?', color: 'from-orange-50 to-amber-50 border-orange-200' }
  ];

  const defaultSmartSuggestions = [
    { text: '👨🏫 Faculty Portal', query: 'What can faculty members do in the system?' },
    { text: '👨🎓 Student Access', query: 'How do students access their materials and timetables?' },
    { text: '🏢 Admin Controls', query: 'Explain the admin dashboard and management features' },
    { text: '🔧 Troubleshooting', query: 'Help me troubleshoot common login and system issues' }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {!isOpen && messageCount === 0 && (
            <div className="absolute -top-20 -left-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-2xl text-sm font-medium animate-bounce shadow-2xl max-w-xs">
              <div className="flex items-center space-x-2">
                <span className="animate-pulse text-lg">👋</span>
                <div>
                  <div className="font-semibold">Hi! I'm Spidey Bot</div>
                  <div className="text-xs text-red-100">Your friendly neighborhood assistant!</div>
                </div>
              </div>
              <div className="absolute bottom-0 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600 transform translate-y-full"></div>
            </div>
          )}
          
          {messageCount > 0 && !isOpen && (
            <div className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
              {messageCount > 9 ? '9+' : messageCount}
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative group spidey-button hover:spidey-button text-white rounded-full p-4 shadow-2xl transition-all duration-500 transform hover:scale-110 ${
              isOpen ? 'rotate-180 scale-110' : 'rotate-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
            <div className="relative z-10">
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-2xl animate-bounce">🕷️</span>
                </div>
              )}
            </div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[38rem] z-50 transform transition-all duration-700 ease-out animate-slideUp">
          <div className={`relative h-full backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-900/95 border-gray-700/30 chatbot-dark' 
              : 'bg-white/95 border-white/30'
          }`}>
            {/* Animated Background */}
            <div className={`absolute inset-0 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-black/80' 
                : 'bg-gradient-to-br from-red-50/80 via-orange-50/60 to-red-50/80'
            }`}></div>
            <div className="absolute top-0 left-0 w-full h-2 spidey-gradient">
              <div className="h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-20 right-16 w-1 h-1 bg-purple-300/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-32 left-8 w-1.5 h-1.5 bg-indigo-300/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Header */}
            <div className="relative spidey-gradient backdrop-blur-sm text-white p-5 chatbot-header">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                    <span className="text-2xl animate-pulse">🕷️</span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getConnectionStatusColor()} rounded-full border-3 border-white animate-pulse shadow-lg`}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl flex items-center space-x-2">
                    <span>Spidey Bot</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Web-Slinger</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-white/90">
                    <div className={`w-2 h-2 ${getConnectionStatusColor()} rounded-full animate-pulse`}></div>
                    <span>{getConnectionStatusText()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={clearChat}
                    className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    title="Clear chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <div className="text-white/70 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto p-5 space-y-4 h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`flex items-end space-x-3 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                        : message.isError 
                          ? 'bg-gradient-to-br from-red-500 to-pink-500'
                          : 'bg-gradient-to-br from-green-500 to-teal-500'
                    }`}>
                      {message.avatar}
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md border-blue-300/30 hover:from-blue-600 hover:to-purple-700'
                            : message.isError
                              ? 'bg-gradient-to-br from-red-50 to-pink-50 text-red-800 rounded-bl-md border-red-200/50'
                              : 'bg-white/90 text-gray-800 rounded-bl-md border-gray-200/50 hover:bg-white/95'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </div>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 px-2 flex items-center space-x-2 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.type === 'bot' && !message.isError && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(isLoading || isTyping) && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-end space-x-3">
                    <div className="w-8 h-8 rounded-full spidey-gradient flex items-center justify-center text-white text-sm shadow-lg">
                      🕷️
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md border border-gray-200/50 shadow-lg">
                      <div className="flex space-x-2 items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {isTyping ? 'Spidey is web-slinging...' : 'Spider-sense tingling...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showSuggestions && messages.length === 1 && (
              <div className="relative px-5 pb-3">
                <div className="text-xs text-gray-600 mb-3 font-medium flex items-center space-x-2">
                  <span>✨ Quick Start</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.query)}
                      disabled={isLoading}
                      className={`text-xs p-3 bg-gradient-to-r ${action.color} hover:scale-105 hover:shadow-md rounded-xl border transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="font-medium text-gray-700">{action.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {(smartSuggestions.length > 0 || (messages.length > 2 && messages[messages.length - 1].type === 'bot' && !isLoading)) && (
              <div className="relative px-5 pb-3">
                <div className="text-xs text-gray-600 mb-3 font-medium flex items-center space-x-2">
                  <span>💡 Smart Suggestions</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(smartSuggestions.length > 0 ? smartSuggestions : defaultSmartSuggestions).slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(typeof suggestion === 'string' ? suggestion : suggestion.query)}
                      disabled={isLoading}
                      className="text-xs p-3 bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 rounded-xl border border-green-200/50 transition-all duration-300 hover:scale-105 hover:shadow-md text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="font-medium text-gray-700">
                        {typeof suggestion === 'string' ? suggestion : suggestion.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`relative p-5 backdrop-blur-sm border-t chatbot-footer ${
              isDarkMode 
                ? 'bg-gray-900/60 border-gray-700/50' 
                : 'bg-white/60 border-gray-200/50'
            }`}>
              <div className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isLoading ? "Spidey is thinking..." : "Ask your friendly neighborhood bot... (Press Enter to send)"}
                    className={`w-full backdrop-blur-sm border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-200 resize-none min-h-[44px] max-h-24 chatbot-input ${
                      isDarkMode 
                        ? 'bg-gray-800/90 border-gray-600 text-gray-100 placeholder-gray-400' 
                        : 'bg-white/90 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                    disabled={isLoading}
                    rows={1}
                    maxLength={1000}
                  />
                  {inputMessage.length > 800 && (
                    <div className="absolute -top-6 right-2 text-xs text-gray-500">
                      {1000 - inputMessage.length} chars left
                    </div>
                  )}
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="spidey-button hover:spidey-button disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none relative overflow-hidden"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse shadow-sm"></span>
                    <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium">{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <span className="animate-brainPulse">🧠</span>
                  <span>Continuously learning to serve you better</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;