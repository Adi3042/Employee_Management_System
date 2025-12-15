// src/components/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { BellIcon } from "./Icons";

const ChatSection = ({ currentUser }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [currentUser]);

  // Update the fetchContacts function in ChatSection.jsx
  const fetchContacts = async () => {
    try {
      const response = await authFetch(`${API_BASE}/messages?user_id=${currentUser.id}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Return empty array if unauthorized (demo mode)
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : []; // Ensure it's an array
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return []; // Return empty array on error
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages?user_id=${currentUser.id}&contact_id=${contactId}`);
      const data = await response.json();
      setMessages(data);
      setSelectedContact(contactId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: selectedContact,
          content: newMessage
        })
      });

      setNewMessage('');
      fetchMessages(selectedContact); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <BellIcon className="w-5 h-5 mr-3 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedContact === contact.id ? 'bg-indigo-50' : ''
              }`}
              onClick={() => fetchMessages(contact.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
                </div>
                {contact.unread && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate mt-1">
                {contact.last_message}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === currentUser.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === currentUser.id ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;