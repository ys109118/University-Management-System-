import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { baseApiURL } from '../baseUrl';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: '👋 Hello! I\'m Alex, your AI College Assistant. I\'m here to help you navigate the system and answer any questions you might have!', 
      time: new Date(),
      avatar: '🤖'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText = null) => {
    const userMessage = messageText || inputMessage.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { 
      type: 'user', 
      text: userMessage, 
      time: new Date(),
      avatar: '👤'
    }]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const response = await axios.post(`${baseApiURL()}/chatbot/query`, {
        message: userMessage
      });
      
      const responseText = response.data.data.response;
      const typingDelay = Math.min(responseText.length * 25, 2500);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: responseText, 
          time: new Date(),
          avatar: '🤖'
        }]);
        setIsLoading(false);
      }, typingDelay);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: '😔 I\'m having trouble connecting right now. Please try again in a moment!',
          time: new Date(),
          avatar: '🤖'
        }]);
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

  const quickActions = [
    { text: '🚀 Getting Started', query: 'I\'m new to this system, where should I start?' },
    { text: '🔐 Login Help', query: 'How do I login to the system?' },
    { text: '📊 System Overview', query: 'Show me system statistics' },
    { text: '📚 Features Guide', query: 'What features are available?' }
  ];

  const smartSuggestions = [
    { text: '👨‍🏫 Faculty Features', query: 'What can faculty members do in the system?' },
    { text: '👨‍🎓 Student Portal', query: 'How do students access their materials?' },
    { text: '📋 Admin Dashboard', query: 'Explain the admin dashboard features' },
    { text: '🔧 Troubleshooting', query: 'Help me troubleshoot common issues' }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {!isOpen && (
            <div className="absolute -top-16 -left-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium animate-bounce shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="animate-pulse">💬</span>
                <span>Need help? Chat with Alex!</span>
              </div>
              <div className="absolute bottom-0 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600 transform translate-y-full"></div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative group bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white rounded-full p-4 shadow-2xl transition-all duration-500 transform hover:scale-110 ${
              isOpen ? 'rotate-180 scale-110' : 'rotate-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
            <div className="relative z-10">
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[36rem] z-50 transform transition-all duration-700 ease-out animate-slideUp">
          <div className="relative h-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-indigo-50/80"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-indigo-600/95 backdrop-blur-sm text-white p-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl">Alex AI Assistant</h3>
                  <div className="flex items-center space-x-2 text-sm text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online • Ready to help</span>
                  </div>
                </div>
                <div className="text-white/70 hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto p-5 space-y-4 h-80 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`flex items-end space-x-3 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm shadow-lg">
                      {message.avatar}
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md border-blue-300/30'
                            : 'bg-white/90 text-gray-800 rounded-bl-md border-gray-200/50'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </div>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 px-2 ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(isLoading || isTyping) && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-end space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm shadow-lg">
                      🤖
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md border border-gray-200/50 shadow-lg">
                      <div className="flex space-x-2 items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {isTyping ? 'Alex is typing...' : 'Thinking...'}
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
                <div className="text-xs text-gray-600 mb-3 font-medium">✨ Quick Start:</div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.query)}
                      className="text-xs p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border border-blue-200/50 transition-all duration-300 hover:scale-105 hover:shadow-md text-left"
                    >
                      <div className="font-medium text-gray-700">{action.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {messages.length > 2 && messages[messages.length - 1].type === 'bot' && (
              <div className="relative px-5 pb-3">
                <div className="text-xs text-gray-600 mb-3 font-medium">💡 You might also ask:</div>
                <div className="grid grid-cols-2 gap-2">
                  {smartSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion.query)}
                      className="text-xs p-3 bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 rounded-xl border border-green-200/50 transition-all duration-300 hover:scale-105 hover:shadow-md text-left"
                    >
                      <div className="font-medium text-gray-700">{suggestion.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="relative p-5 bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
              <div className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Press Enter to send)"
                    className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none min-h-[44px] max-h-24"
                    disabled={isLoading}
                    rows={1}
                  />
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • Always learning to help you better
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;