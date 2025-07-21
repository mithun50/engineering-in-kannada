import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(
        `You are an AI assistant for a YouTube channel named "Engineering in Kannada". Your name is "EiK Assistant". You should only answer questions related to engineering, technology, and education. You should not answer questions about other topics. If you are asked a question that is not related to these topics, you should politely decline to answer and say that you can only answer questions related to engineering, technology, and education.

        Here is the user's question: ${input}`
      );
      const response = await result.response;
      const text = await response.text();

      const botMessage = { text, sender: 'bot' as const };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response from Gemini:', error);
      const errorMessage = { text: 'Sorry, something went wrong.', sender: 'bot' as const };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999]">
      <button
        onClick={toggleChat}
        className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:bg-yellow-600 transition-colors"
        aria-label="Toggle Chat"
      >
        🤖
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-gray-800 rounded-lg shadow-xl flex flex-col h-96">
          <div className="bg-gray-900 p-4 rounded-t-lg">
            <h3 className="text-white text-lg font-semibold">Chat with our AI</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white rounded-lg px-3 py-2">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-900 rounded-b-lg flex">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
