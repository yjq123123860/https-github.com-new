import { useState, useEffect } from 'react';
import { useMessageStore } from '../store/index';
import { MessageSquare, Clock, User } from 'lucide-react';

function Messages() {
  const { conversations, currentConversation, setConversations, setCurrentConversation, addMessage } = useMessageStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 模拟获取对话列表
    const mockConversations = [
      {
        id: 1,
        otherUserId: 2,
        otherUserName: '张三',
        otherUserSchool: '北京大学',
        otherUserAvatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=512x512',
        lastMessage: '好的，我帮你取快递',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
        messages: [
          {
            id: 1,
            content: '能帮我取一下快递吗？',
            senderId: 1,
            senderName: '我',
            timestamp: new Date().toISOString(),
            isMine: true
          },
          {
            id: 2,
            content: '好的，我帮你取快递',
            senderId: 2,
            senderName: '张三',
            timestamp: new Date().toISOString(),
            isMine: false
          }
        ]
      },
      {
        id: 2,
        otherUserId: 3,
        otherUserName: '李四',
        otherUserSchool: '清华大学',
        otherUserAvatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=512x512',
        lastMessage: '自习室已经帮你预约好了',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        messages: [
          {
            id: 1,
            content: '能帮我预约明天的自习室吗？',
            senderId: 1,
            senderName: '我',
            timestamp: new Date().toISOString(),
            isMine: true
          },
          {
            id: 2,
            content: '自习室已经帮你预约好了',
            senderId: 3,
            senderName: '李四',
            timestamp: new Date().toISOString(),
            isMine: false
          }
        ]
      }
    ];
    setConversations(mockConversations);
  }, [setConversations]);

  const handleSendMessage = () => {
    if (message.trim() && currentConversation) {
      const newMessage = {
        id: Date.now(),
        content: message,
        senderId: 1,
        senderName: '我',
        timestamp: new Date().toISOString(),
        isMine: true
      };
      addMessage(currentConversation.id, newMessage);
      setMessage('');
    }
  };

  const selectConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  // 简单的加载状态
  if (!conversations || conversations.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-10"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="h-[600px] bg-white rounded-lg border">
              <div className="p-4 border-b animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-[400px] p-4 animate-pulse">
                <div className="h-full bg-gray-100 rounded-lg"></div>
              </div>
              <div className="p-4 border-t animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">消息中心</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">暂无消息</h3>
                <p className="text-gray-600 mt-2">您还没有任何消息</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${currentConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={conversation.otherUserAvatar || 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=512x512'} alt={conversation.otherUserName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{conversation.otherUserName}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.lastMessageTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full mt-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          {currentConversation ? (
            <div className="h-[600px] bg-white rounded-lg border">
              <div className="p-4 border-b flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img src={currentConversation.otherUserAvatar || 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=512x512'} alt={currentConversation.otherUserName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentConversation.otherUserName}</h3>
                  <span className="text-sm text-gray-500">{currentConversation.otherUserSchool}</span>
                </div>
              </div>
              <div className="h-[450px] p-4 overflow-y-auto">
                <div className="space-y-4">
                  {currentConversation.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.isMine ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
                        <p>{msg.content}</p>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    placeholder="输入消息..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleSendMessage}>
                    发送
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">选择一个对话</h3>
                <p className="text-gray-600 mt-2">从左侧选择一个对话开始聊天</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;