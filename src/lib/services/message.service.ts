
'use server';

import { CONVERSATIONS, MESSAGES, EMPLOYEES } from '@/lib/data';
import type { Conversation, Message, Employee } from '@/lib/types';
import { getEmployeeById } from './employee.service';

let conversationsData = [...CONVERSATIONS];
let messagesData = [...MESSAGES];

export async function getConversations(userId: string): Promise<(Conversation & { otherParticipant: Employee })[]> {
    const userConversations = conversationsData.filter(c => c.participantIds.includes(userId));
    
    const populatedConversations = await Promise.all(userConversations.map(async (convo) => {
        const otherParticipantId = convo.participantIds.find(id => id !== userId);
        const otherParticipant = await getEmployeeById(otherParticipantId!);
        
        return {
            ...convo,
            // In a real app you should handle the case where the other participant is not found
            otherParticipant: otherParticipant!, 
        };
    }));

    return Promise.resolve(populatedConversations.sort((a,b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()));
}

export async function getMessagesForConversation(conversationId: string): Promise<Message[]> {
    const messages = messagesData.filter(m => m.conversationId === conversationId);
    return Promise.resolve(messages.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()));
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const newMessage: Message = {
        id: `msg${messagesData.length + 1}_${Date.now()}`,
        conversationId,
        senderId,
        content,
        timestamp: new Date(),
    };
    
    // Add message
    messagesData.push(newMessage);

    // Update conversation's last message
    const convoIndex = conversationsData.findIndex(c => c.id === conversationId);
    if (convoIndex !== -1) {
        conversationsData[convoIndex].lastMessage = newMessage;
    }

    return Promise.resolve(newMessage);
}

export async function createOrGetConversation(userId1: string, userId2: string): Promise<Conversation & { otherParticipant: Employee }> {
    // Check if a conversation already exists
    let conversation = conversationsData.find(c => 
        c.participantIds.includes(userId1) && c.participantIds.includes(userId2)
    );

    if (!conversation) {
        // Create a new conversation if one doesn't exist
        const initialMessageContent = "Conversation started.";
        const newConversation: Conversation = {
            id: `conv${conversationsData.length + 1}_${Date.now()}`,
            participantIds: [userId1, userId2],
            lastMessage: { // This will be immediately replaced
                id: `msg${messagesData.length + 1}_${Date.now()}`,
                conversationId: `conv${conversationsData.length + 1}_${Date.now()}`, // Temporary ID
                senderId: userId1,
                content: initialMessageContent,
                timestamp: new Date()
            }
        };
        newConversation.lastMessage.conversationId = newConversation.id;

        conversationsData.unshift(newConversation);
        messagesData.push(newConversation.lastMessage);
        conversation = newConversation;
    }
    
    const otherParticipant = await getEmployeeById(userId2);

    return {
        ...conversation,
        otherParticipant: otherParticipant!
    };
}
