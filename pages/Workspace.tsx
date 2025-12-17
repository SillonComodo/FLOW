import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, FileText, Upload, Trash2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateAIResponse, summarizeText } from '../services/openAIService';

const Workspace: React.FC = () => {
  const [docContent, setDocContent] = useState<string>("// Escribe tus notas, código o pega tu ensayo aquí...\n");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setDocContent(text);
          // Auto add a system note to chat
          setChatHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: `He cargado el contenido del archivo "${file.name}". Ahora puedes hacerme preguntas sobre él.`,
            timestamp: new Date()
          }]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSummarize = async () => {
      if(!docContent.trim()) return;
      setIsTyping(true);
      const summary = await summarizeText(docContent);
      setChatHistory(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'user', text: 'Resume el documento actual.', timestamp: new Date() },
          { id: (Date.now()+1).toString(), role: 'model', text: summary, timestamp: new Date() }
      ]);
      setIsTyping(false);
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    const responseText = await generateAIResponse(chatHistory, newMessage.text, docContent);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left: Editor */}
      <div className="flex-1 flex flex-col border-r border-surfaceHighlight min-w-[300px]">
        <div className="h-12 border-b border-surfaceHighlight bg-surface px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-textMuted">
            <FileText size={16} />
            <span className="text-sm font-medium">Editor de Documento</span>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={handleSummarize}
                className="text-xs bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-textMain px-2 py-1 rounded transition-colors"
            >
                Resumir con IA
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-primary hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
            >
              <Upload size={12} /> Cargar .txt/.md
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.md,.js,.ts,.json" 
              onChange={handleFileUpload} 
            />
          </div>
        </div>
        <textarea
          value={docContent}
          onChange={(e) => setDocContent(e.target.value)}
          className="flex-1 w-full bg-[#0f172a] text-textMain p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          placeholder="Comienza a escribir..."
          spellCheck={false}
        />
      </div>

      {/* Right: AI Chat */}
      <div className="w-full md:w-[400px] flex flex-col bg-surface/30">
        <div className="h-12 border-b border-surfaceHighlight bg-surface px-4 flex items-center gap-2">
          <Bot size={18} className="text-accent" />
          <span className="font-medium text-textMain text-sm">Asistente OpenAI</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center text-textMuted text-sm mt-10">
              <Bot size={32} className="mx-auto mb-2 opacity-50" />
              <p>Haz preguntas sobre tu documento o pide ayuda con tu código.</p>
            </div>
          )}
          
          {chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[90%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-surfaceHighlight text-textMain rounded-tl-none border border-surfaceHighlight/50'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-textMuted mt-1 px-1">
                {msg.role === 'user' ? 'Tú' : 'OpenAI'}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-textMuted text-xs pl-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-150" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-surfaceHighlight bg-surface">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta algo..."
              className="flex-1 bg-background border border-surfaceHighlight rounded-lg px-3 py-2 text-sm text-textMain focus:outline-none focus:border-primary"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;