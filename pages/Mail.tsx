import React, { useState } from 'react';
import { Mail, Send, Paperclip, X } from 'lucide-react';
import { EmailDraft } from '../types';

const MailPage: React.FC = () => {
  const [draft, setDraft] = useState<EmailDraft>({ to: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = () => {
    if (!draft.to || !draft.subject) return;
    
    setSending(true);
    // Simulate API/N8N call
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setDraft({ to: '', subject: '', body: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="h-full p-8 max-w-4xl mx-auto animate-fade-in flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textMain flex items-center gap-3">
          <Mail className="text-primary" />
          Redactar Correo
        </h1>
        <p className="text-textMuted text-sm mt-1 ml-9">
          Envía correos importantes conectando con tu cuenta de Gmail (vía N8N).
        </p>
      </div>

      <div className="bg-surface border border-surfaceHighlight rounded-xl overflow-hidden flex flex-col flex-1 shadow-2xl">
        <div className="p-4 border-b border-surfaceHighlight space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-textMuted w-16 text-sm font-medium">Para:</label>
            <input 
              type="email" 
              value={draft.to}
              onChange={e => setDraft({...draft, to: e.target.value})}
              className="flex-1 bg-transparent border-b border-surfaceHighlight focus:border-primary focus:outline-none text-textMain py-1"
              placeholder="profesor@universidad.edu"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-textMuted w-16 text-sm font-medium">Asunto:</label>
            <input 
              type="text" 
              value={draft.subject}
              onChange={e => setDraft({...draft, subject: e.target.value})}
              className="flex-1 bg-transparent border-b border-surfaceHighlight focus:border-primary focus:outline-none text-textMain py-1"
              placeholder="Duda sobre el proyecto final..."
            />
          </div>
        </div>

        <textarea 
          value={draft.body}
          onChange={e => setDraft({...draft, body: e.target.value})}
          className="flex-1 w-full bg-background p-6 text-textMain resize-none focus:outline-none font-sans leading-relaxed"
          placeholder="Escribe tu mensaje aquí..."
        />

        <div className="p-4 bg-surface border-t border-surfaceHighlight flex justify-between items-center">
          <button className="text-textMuted hover:text-textMain transition-colors p-2 hover:bg-surfaceHighlight rounded-full">
            <Paperclip size={20} />
          </button>
          
          <div className="flex items-center gap-3">
             {sentSuccess && (
               <span className="text-green-500 text-sm font-medium animate-pulse">
                 ¡Correo enviado exitosamente!
               </span>
             )}
            <button 
              onClick={() => setDraft({ to: '', subject: '', body: '' })}
              className="px-4 py-2 text-textMuted hover:text-textMain text-sm font-medium"
            >
              Descartar
            </button>
            <button 
              onClick={handleSend}
              disabled={sending || !draft.to}
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Enviar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailPage;