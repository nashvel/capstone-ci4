import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/breadcrums';
import Header from '../../../layouts/header';
import Sidemenu from '../../../layouts/sidemenu';
import { EmojiSmile, Trash, Camera } from 'react-bootstrap-icons'; // Added Camera icon
import sticker1 from '../../../assets/stickers/sticker1.png';
import sticker2 from '../../../assets/stickers/sticker2.png';
import sticker3 from '../../../assets/stickers/sticker3.png';
import Sticker from './sticker';
import './chat-client.css';

interface Message {
  sender: string;
  text?: string;
  sticker?: string;
  timestamp: string;
  image?: string; // Added image field
}

const clients = ['Admin 1', 'Admin 2'];
const stickers = [sticker1, sticker2, sticker3];

const ChatToAdmin: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null); // For image upload handling

  useEffect(() => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);




  const sendMessage = () => {
    if (!inputMessage.trim() && !imageUpload) return; // Don't send if empty and no image
    const newMessage: Message = {
      sender: 'Admin',
      text: inputMessage,
      image: imageUpload ? URL.createObjectURL(imageUpload) : undefined, // Use image URL if an image is uploaded
      timestamp: new Date().toLocaleTimeString(),
    };
    if (imageUpload) {
      newMessage.text = ''; // Remove text if image is being sent
    }
    setMessages(prev => ({ ...prev, [selectedClient]: [...(prev[selectedClient] || []), newMessage] }));
    setInputMessage('');
    setImageUpload(null); // Clear image after sending
  };

  const sendSticker = (sticker: string) => {
    const newMessage: Message = { sender: 'Admin', sticker, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => ({ ...prev, [selectedClient]: [...(prev[selectedClient] || []), newMessage] }));
    setShowStickers(false);
  };

  const deleteMessage = (index: number) => {
    setMessages(prev => {
      const updated = { ...prev };
      updated[selectedClient] = updated[selectedClient].filter((_, i) => i !== index);
      return updated;
    });
  };

  // Handle file upload (triggered when the camera icon is clicked)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUpload(file);
    }
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div
        className="main-content app-content chat-container fixed inset-0 flex flex-col justify-start pt-16 h-full"
        style={{
          background: 'linear-gradient(135deg, #f8e1e7, #ffffff, #f8e1e7, #d9e7ff, #fff7db)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: '0px',
          marginBottom: '0px',
        }}
      >
      
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md" style={{ pointerEvents: 'none' }}></div>

        <div className="container-fluid mt-20 h-full">
          <Breadcrumb title="Chat to Clients" active={selectedClient} />
          <div className="flex justify-center">
            {/* Sidebar */}
            <div className="w-1/4 p-4 rounded-lg backdrop-blur-lg bg-white/30 border border-white/40 shadow-lg shadow-gray-500/50">
              <h3 className="text-lg font-bold mb-2">Admins</h3>
              <ul>
                {clients.map(client => (
                  <li
                    key={client}
                    className={`p-2 cursor-pointer ${selectedClient === client ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedClient(client)}
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat Section */}
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 rounded-lg ml-4 bg-transparent border border-white/40 shadow-lg shadow-gray-500/50 flex flex-col h-[80vh]">
              <h3 className="text-lg font-bold mb-2">{selectedClient}</h3>

              {/* Messages - Fixed height to prevent overflowing */}
              <div
                className="overflow-y-auto border p-2 chat-window rounded-lg bg-transparent flex-1"
                style={{ maxHeight: '65vh', minHeight: '40vh' }}
              >
                {messages[selectedClient]?.slice().reverse().map((msg, index) => (
                  <div key={index} className="message-wrapper">
                    <div className="message-actions">
                      <button className="delete-btn" onClick={() => deleteMessage(index)}>
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="chat-message">
                      <div className="message-content">
                        <strong>{msg.sender}:</strong>
                        {/* Add a space after the message sender */}
                        <span>{msg.text}</span>
                        {msg.image && <img src={msg.image} alt="Uploaded" className="w-16 h-16 inline-block mt-2" />}
                        {msg.sticker && <img src={msg.sticker} alt="sticker" className="w-16 h-16 inline-block mt-2" />}
                        {/* Add margin between the text and timestamp */}
                        <div className="mt-1 text-gray-400 text-sm">{msg.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Field - Stays Fixed at Bottom */}
              <div className="mt-4 flex items-center bg-white p-2 border-t rounded-lg max-w-[500px] w-full justify-start">
                <input
                  type="text"
                  className="w-full p-2 border rounded-l"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                {/* Show image preview if uploaded */}
                {imageUpload && (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center ml-2">
                    <img src={URL.createObjectURL(imageUpload)} alt="image preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-full">
                  Send
                </button>
                <button onClick={() => setShowStickers(!showStickers)} className="ml-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                  <EmojiSmile size={24} />
                </button>
                <label htmlFor="file-upload" className="ml-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer">
                  <Camera size={24} />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Stickers */}
              {showStickers && <Sticker stickers={stickers} onSelect={sendSticker} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatToAdmin;
