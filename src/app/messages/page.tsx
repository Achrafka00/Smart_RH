
"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRole } from "@/hooks/use-role";
import { getConversations, getMessagesForConversation } from "@/lib/services/message.service";
import type { Conversation, Message, Employee } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type PopulatedConversation = Conversation & { otherParticipant: Employee };

export default function MessagesPage() {
    const { currentUser } = useRole();
    const [conversations, setConversations] = useState<PopulatedConversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<PopulatedConversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        async function fetchConversations() {
            const convos = await getConversations(currentUser!.id);
            setConversations(convos);
            if (convos.length > 0) {
                handleConversationSelect(convos[0]);
            }
            setLoading(false);
        }
        fetchConversations();
    }, [currentUser]);

    const handleConversationSelect = async (conversation: PopulatedConversation) => {
        setSelectedConversation(conversation);
        const msgs = await getMessagesForConversation(conversation.id);
        setMessages(msgs);
    };

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col">
            <PageHeader title="Messages" description="Chat with your colleagues." />
            <Card className="flex-1 grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-12rem)]">
                {/* Conversations List */}
                <div className="md:col-span-1 border-r">
                    <ScrollArea className="h-full">
                        <div className="p-2">
                        {loading ? (
                             Array.from({length: 4}).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-2">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                             ))
                        ) : conversations.map((convo) => (
                            <button
                                key={convo.id}
                                onClick={() => handleConversationSelect(convo)}
                                className={cn(
                                    "flex items-center gap-4 p-2 rounded-lg w-full text-left hover:bg-muted",
                                    selectedConversation?.id === convo.id && "bg-muted"
                                )}
                            >
                                <Avatar>
                                    <AvatarImage src={convo.otherParticipant.avatar} alt={convo.otherParticipant.name} data-ai-hint="person avatar" />
                                    <AvatarFallback>{getInitials(convo.otherParticipant.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 truncate">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{convo.otherParticipant.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNowStrict(new Date(convo.lastMessage.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.content}</p>
                                </div>
                            </button>
                        ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Message View */}
                <div className="md:col-span-2 flex flex-col h-full">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b flex items-center gap-4">
                                <Avatar>
                                     <AvatarImage src={selectedConversation.otherParticipant.avatar} alt={selectedConversation.otherParticipant.name} data-ai-hint="person avatar" />
                                    <AvatarFallback>{getInitials(selectedConversation.otherParticipant.name)}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-lg font-semibold">{selectedConversation.otherParticipant.name}</h2>
                            </div>
                            <ScrollArea className="flex-1 p-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex items-end gap-2 my-2",
                                            msg.senderId === currentUser?.id ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {msg.senderId !== currentUser?.id && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={selectedConversation.otherParticipant.avatar} alt={selectedConversation.otherParticipant.name} data-ai-hint="person avatar" />
                                                <AvatarFallback>{getInitials(selectedConversation.otherParticipant.name)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={cn(
                                                "p-3 rounded-lg max-w-xs lg:max-w-md",
                                                msg.senderId === currentUser?.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            <p>{msg.content}</p>
                                            <p className={cn("text-xs mt-1", msg.senderId === currentUser?.id ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                                {format(new Date(msg.timestamp), 'p')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                            <div className="p-4 border-t">
                                <form className="flex gap-2">
                                    <Input placeholder="Type a message..." className="flex-1" />
                                    <Button type="submit">
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
