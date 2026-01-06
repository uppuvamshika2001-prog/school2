'use client';

import { useState } from 'react';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Circle, CheckCheck, User } from 'lucide-react';

const initialConversations = [
    {
        id: '1',
        name: 'Sarah Wilson',
        role: 'Teacher - Mathematics',
        avatar: 'SW',
        lastMessage: 'The exam schedule has been updated. Please review.',
        time: '2 min ago',
        unread: 2,
        online: true
    },
    {
        id: '2',
        name: 'Rajesh Kumar',
        role: 'Teacher - Science',
        avatar: 'RK',
        lastMessage: 'Lab equipment request approved.',
        time: '15 min ago',
        unread: 0,
        online: true
    },
    {
        id: '3',
        name: 'Priya Sharma',
        role: 'Teacher - English',
        avatar: 'PS',
        lastMessage: 'Thank you for the feedback on my lesson plan.',
        time: '1 hour ago',
        unread: 0,
        online: false
    },
    {
        id: '4',
        name: 'Amit Patel',
        role: 'Parent - Class 10-A',
        avatar: 'AP',
        lastMessage: 'My son will be absent tomorrow due to a family function.',
        time: '2 hours ago',
        unread: 1,
        online: false
    },
    {
        id: '5',
        name: 'Neha Singh',
        role: 'Teacher - Hindi',
        avatar: 'NS',
        lastMessage: 'Can we discuss the Hindi curriculum updates?',
        time: '3 hours ago',
        unread: 0,
        online: true
    },
    {
        id: '6',
        name: 'Vikram Reddy',
        role: 'Teacher - Social Studies',
        avatar: 'VR',
        lastMessage: 'The field trip permission slips are ready.',
        time: 'Yesterday',
        unread: 0,
        online: false
    },
    {
        id: '7',
        name: 'Accounts Department',
        role: 'Department',
        avatar: 'AD',
        lastMessage: 'Monthly salary slip is now available.',
        time: 'Yesterday',
        unread: 0,
        online: false
    }
];

const chatMessages = [
    { id: '1', sender: 'them', text: 'Good morning! I wanted to discuss the upcoming math olympiad preparations.', time: '9:00 AM' },
    { id: '2', sender: 'me', text: 'Good morning Sarah! Yes, I was planning to schedule a meeting for that.', time: '9:02 AM' },
    { id: '3', sender: 'them', text: 'That would be great. We have 15 students who have shown interest.', time: '9:05 AM' },
    { id: '4', sender: 'me', text: 'Wonderful! Can you share the list of students with me?', time: '9:07 AM' },
    { id: '5', sender: 'them', text: 'Sure, I will email you the list today. Also, we need to order some practice books.', time: '9:10 AM' },
    { id: '6', sender: 'me', text: 'Please send me the book details and I will process the order.', time: '9:12 AM' },
    { id: '7', sender: 'them', text: 'The exam schedule has been updated. Please review.', time: '9:30 AM' },
];

export default function MessagesPage() {
    const [conversations] = useState(initialConversations);
    const [selectedChat, setSelectedChat] = useState(conversations[0]);
    const [messages, setMessages] = useState(chatMessages);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: (messages.length + 1).toString(),
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground mt-1">Internal messaging system for staff and parents.</p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden flex">
                {/* Conversations List */}
                <div className="w-80 border-r flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-muted/50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedChat(conv)}
                                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedChat.id === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                            {conv.avatar}
                                        </div>
                                        {conv.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-sm truncate">{conv.name}</h4>
                                            <span className="text-xs text-muted-foreground">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.role}</p>
                                        <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                    {selectedChat.avatar}
                                </div>
                                {selectedChat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold">{selectedChat.name}</h4>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    {selectedChat.online ? (
                                        <>
                                            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                            Online
                                        </>
                                    ) : (
                                        'Offline'
                                    )}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-muted rounded-lg">
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : ''}`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${msg.sender === 'me'
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-muted rounded-bl-md'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                                        {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-primary" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t bg-muted/30">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <button type="button" className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 bg-background border rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
