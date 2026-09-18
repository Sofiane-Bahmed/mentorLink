import  { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import NavBar from '../../components/navbar/NavBar';
import ContactList from '../../components/messages/ContactList';
import ChatWindow from '../../components/messages/ChatWindow';
import MessagesSkeleton from './MessagesSkeleton';
import { MdArrowBack } from 'react-icons/md';

const Messages = () => {
  const { user: localUser } = useAuth();
  const {
    conversations,
    selectedContact,
    setSelectedContact,
    messages,
    loading,
    sendMessage,
    deleteMessage,
    typingStatus,
    handleTyping
  } = useMessages(localUser);

  const [showChatMobile, setShowChatMobile] = useState(false);

  // Handle contact selection
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowChatMobile(true);
  };

  if (loading) {
    return <MessagesSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <NavBar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto flex md:p-4 lg:p-6 gap-0 md:gap-4 lg:gap-6 overflow-hidden w-full h-full">
          {/* Contact List - Hidden on mobile when chat is open */}
          <div className={`w-full md:w-80 lg:w-96 flex flex-col h-full shrink-0 ${showChatMobile ? 'hidden md:flex' : 'flex'}`}>
            <ContactList 
              conversations={conversations} 
              selectedContact={selectedContact} 
              onSelectContact={handleSelectContact} 
            />
          </div>

          {/* Chat Window - Hidden on mobile when list is open */}
          <div className={`flex-1 flex flex-col h-full min-w-0 ${!showChatMobile ? 'hidden md:flex' : 'flex'}`}>
            {showChatMobile && (
              <button 
                onClick={() => setShowChatMobile(false)}
                className="md:hidden flex items-center gap-2 p-4 text-[#007749] font-bold bg-white border-b sticky top-0 z-20"
              >
                <MdArrowBack size={24} />
                Back to conversations
              </button>
            )}
            <ChatWindow 
              selectedContact={selectedContact} 
              messages={messages} 
              onSendMessage={sendMessage} 
              onDeleteMessage={deleteMessage}
              currentUserId={localUser?.userId}
              typingStatus={typingStatus}
              onTyping={handleTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
