// [path]: components/dashboard/MessagingCenter.tsx

'use client';

import { useState } from 'react';
import { Project, Message, UserRole } from '@/lib/types'; // Import UserRole
import Button from '../ui/Button';
import { Send } from 'lucide-react';

interface MessagingCenterProps {
  project: Project;
  currentUserRole: UserRole; // CORRECTED: Now accepts any UserRole
  onSendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'authorRole'>) => void;
}

type MessageVisibility = 'BossOnly' | 'StaffOnly';

const MessagingCenter = ({ project, currentUserRole, onSendMessage }: MessagingCenterProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [visibility, setVisibility] = useState<MessageVisibility>('StaffOnly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage({
      author: currentUserRole,
      text: newMessage,
      visibleTo: visibility,
    });

    setNewMessage('');
  };

  const filteredMessages = project.messages.filter(msg => {
    if (currentUserRole === 'Boss') return true;
    return msg.visibleTo === 'StaffOnly';
  }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="bg-background border border-border p-6 rounded shadow-soft">
      <h3 className="text-xl font-bold text-foreground mb-4">Notes</h3>
      <div className="h-64 overflow-y-auto mb-4 p-3 bg-muted/10 rounded border border-border space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map(msg => (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-copper/20 border border-copper/30">
                <p className="text-sm text-foreground">{msg.text}</p>
              </div>
              <p className="text-xs text-muted mt-1 px-1">
                {msg.author} — {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                {currentUserRole === 'Boss' && (
                  <span className="ml-2 inline-flex items-center text-accent">({msg.visibleTo})</span>
                )}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 bg-background border border-border rounded text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Type a note (internal)..."
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2 text-sm">
            <select value={visibility} onChange={e => setVisibility(e.target.value as MessageVisibility)} className="text-xs rounded border border-border bg-background text-foreground focus:ring-accent">
              <option value="StaffOnly">Staff only</option>
              <option value="BossOnly">Boss only</option>
            </select>
          </div>
          <Button type="submit" variant="primary" size="sm" disabled={!newMessage.trim()}>
            Send <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessagingCenter;