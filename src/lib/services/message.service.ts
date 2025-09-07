
'use server';

import { CONVERSATIONS, MESSAGES, EMPLOYEES } from '@/lib/data';
import type { Conversation, Message, Employee } from '@/lib/types';

export async function getConversations(userId: string): Promise<(Conversation & { otherParticipant: Employee })[]> {
    const userConversations = CONVERSATIONS.filter(c => c.participantIds.includes(userId));
    
    const populatedConversations = userConversations.map(convo => {
        const otherParticipantId = convo.participantIds.find(id => id !== userId);
        const otherParticipant = EMPLOYEES.find(emp => emp.id === otherParticipantId);
        
        return {
            ...convo,
            // In a real app you should handle the case where the other participant is not found
            otherParticipant: otherParticipant!, 
        };
    });

    return Promise.resolve(populatedConversations.sort((a,b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()));
}

export async function getMessagesForConversation(conversationId: string): Promise<Message[]> {
    const messages = MESSAGES.filter(m => m.conversationId === conversationId);
    return Promise.resolve(messages.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()));
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const newMessage: Message = {
        id: `msg${MESSAGES.length + 1}`,
        conversationId,
        senderId,
        content,
        timestamp: new Date(),
    };
    
    // Add message
    MESSAGES.push(newMessage);

    // Update conversation's last message
    const convoIndex = CONVERSATIONS.findIndex(c => c.id === conversationId);
    if (convoIndex !== -1) {
        CONVERSATIONS[convoIndex].lastMessage = newMessage;
    }

    return Promise.resolve(newMessage);
}
