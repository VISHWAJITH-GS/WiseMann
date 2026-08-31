import { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Button, Input } from '../components/common';
import { Send, Lightbulb, MessageCircle } from 'lucide-react';
import { aiAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { AIMessage } from '../types';

const suggestedQuestions = [
  'What should I buy today?',
  'Where is my money stuck?',
  'Which products may stock out?',
  'I only have ₹10,000. What should I buy?',
  'Why shouldn\'t I buy biscuits?',
  'What are slow-moving products?',
];

export default function AIStoreManager() {
  const { aiMessages, addAIMessage } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(suggestedQuestions);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  useEffect(() => {
    // Load suggestions on mount
    const loadSuggestions = async () => {
      try {
        const res = await aiAPI.getSuggestions();
        setSuggestions(res.data);
      } catch {
        // Use defaults
      }
    };
    loadSuggestions();
  }, []);

  const handleSendMessage = async (message: string = input) => {
    if (!message.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    addAIMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const res = await aiAPI.chat(message);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.content,
        timestamp: new Date().toISOString(),
        context: res.data.context,
      };
      addAIMessage(aiMessage);
    } catch (err) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addAIMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink mb-2 flex items-center gap-2">
            <MessageCircle size={32} className="text-ai-primary" />
            AI Store Manager
          </h1>
          <p className="text-text-secondary">Ask anything about your inventory and purchases.</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-surface rounded-xl p-6 mb-6 overflow-y-auto">
          {aiMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Lightbulb size={48} className="text-ai-primary mb-4 opacity-50" />
              <h2 className="text-xl font-bold text-ink mb-2">Start a Conversation</h2>
              <p className="text-text-secondary text-center mb-8 max-w-md">
                Ask questions about your inventory, get purchase recommendations, or run what-if scenarios.
              </p>

              <div className="w-full space-y-2">
                <p className="text-sm font-medium text-text mb-3">Suggested Questions:</p>
                {suggestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-white hover:border-black transition-all text-sm text-text hover:font-medium"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-black text-white rounded-br-none'
                        : 'bg-white border border-border text-text rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'opacity-70' : 'text-text-muted'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border text-text px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={setInput}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
