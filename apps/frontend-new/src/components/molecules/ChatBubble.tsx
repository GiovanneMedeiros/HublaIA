'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/atoms';

export interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'ai' | 'agent';
  timestamp?: string;
  avatar?: string;
  avatarFallback?: string;
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  (
    {
      message,
      sender,
      timestamp,
      avatar,
      avatarFallback = 'A',
    },
    ref
  ) => {
    const isUser = sender === 'user';

    return (
      <div
        ref={ref}
        className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}
      >
        {!isUser && (
          <Avatar
            src={avatar}
            fallback={avatarFallback}
            size="sm"
            status={sender === 'agent' ? 'online' : undefined}
          />
        )}

        <div className={cn('flex flex-col gap-1', isUser && 'items-end')}>
          <div
            className={cn(
              'px-4 py-2 rounded-lg max-w-xs lg:max-w-md break-words',
              isUser
                ? 'bg-primary-500 text-white rounded-br-none'
                : sender === 'ai'
                  ? 'bg-bg-tertiary text-neutral-gray rounded-bl-none'
                  : 'bg-status-green/10 border border-status-green/20 text-neutral-white rounded-bl-none'
            )}
          >
            <p className="text-sm">{message}</p>
          </div>

          {timestamp && (
            <span className="text-xs text-neutral-gray px-2">{timestamp}</span>
          )}
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';

export { ChatBubble };
