'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MessageCircle, Users, LogOut, Settings, Plus, Search, Send, Paperclip } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
}

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  media_url?: string;
  created_at: string;
  username?: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
  avatar_url?: string;
  creator_id: number;
}

export default function ChatPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
    fetchUsers();
    fetchGroups();
  }, [user, token, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const fetchMessages = async (recipientId: number) => {
    try {
      const res = await fetch(`/api/messages?recipientId=${recipientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          content: messageText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, { ...data.message, username: user?.username }]);
        setMessageText('');
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName }),
      });

      if (res.ok) {
        const data = await res.json();
        setGroups([...groups, data.group]);
        setGroupName('');
        setShowNewGroup(false);
        toast.success('Group created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">SAM.CHAT</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="messages" className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b border-gray-200">
            <TabsTrigger value="messages" className="flex-1">
              Messages
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1">
              Groups
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1 p-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setSelectedGroup(null);
                    fetchMessages(u.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedUser?.id === u.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-sm">{u.username}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="flex-1 overflow-y-auto p-0">
            <div className="p-2">
              <Button
                onClick={() => setShowNewGroup(!showNewGroup)}
                className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Button>

              {showNewGroup && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                  <Input
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={createGroup}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Create
                    </Button>
                    <Button
                      onClick={() => setShowNewGroup(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGroup(g);
                      setSelectedUser(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedGroup?.id === g.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-sm">{g.name}</div>
                        {g.description && (
                          <div className="text-xs text-gray-500">{g.description}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser || selectedGroup ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedUser?.username || selectedGroup?.name}
              </h2>
              {selectedUser && (
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender_id === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.media_url && (
                      <img
                        src={msg.media_url}
                        alt="media"
                        className="max-w-xs rounded mb-2"
                      />
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a user or group to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
