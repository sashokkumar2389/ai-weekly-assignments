import React from 'react';

export type MessageType = 'user' | 'bot' | 'welcome';

export interface Message {
    id: string;
    type: MessageType;
    text?: string;
    content?: React.ReactNode;
    timestamp: Date;
}

export interface ChatState {
    messages: Message[];
    isInitialized: boolean;
}
