"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, ChevronUp, Send, Settings, Paperclip, X } from 'lucide-react' // Import X icon for delete
import chatsData from '@/data/chats.json'; // Import the JSON data
import { Button } from '@/components/ui/button'; // Import Button component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Import Dialog components
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remarkGfm for GitHub Flavored Markdown
import remarkBreaks from 'remark-breaks'; // Import remarkBreaks for handling single newlines

const DEFAULT_LEFT_PANEL_WIDTH = 250;
const DEFAULT_RIGHT_PANEL_WIDTH = 250;
const COLLAPSED_PANEL_WIDTH = 48; // Width for collapsed panels to show the button

// Custom SVG icon for panel toggles
const PanelToggleIcon = ({ isCollapsed, isLeftPanel }: { isCollapsed: boolean; isLeftPanel: boolean }) => {
  const transform = isLeftPanel
    ? (isCollapsed ? 'scaleX(-1)' : 'scaleX(1)') // Flip for left panel when collapsed
    : (isCollapsed ? 'scaleX(1)' : 'scaleX(-1)'); // Flip for right panel when expanded

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: transform, transition: 'transform 0.3s ease-in-out' }}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
    </svg>
  );
};

export default function ThreePanelLayout() {
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_RIGHT_PANEL_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialRightPanelWidth, setInitialRightPanelWidth] = useState(0);
  const [isTableVisible, setIsTableVisible] = useState(true); // New state for table visibility
  const [isContractVisible, setIsContractVisible] = useState(true); // New state for contract visibility
  const [showSettingsModal, setShowSettingsModal] = useState(false); // State for settings modal

  // Chat specific states
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you with your contract today?', sender: 'ai' },
    { id: 2, text: 'I need help reviewing a sales agreement.', sender: 'user' },
    { id: 3, text: 'Please upload the document or paste the text here.', sender: 'ai' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messageIdCounter = useRef(messages.length); // Counter for unique message IDs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const containerRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedLeftState = localStorage.getItem('isLeftPanelCollapsed');
    const savedRightWidth = localStorage.getItem('rightPanelWidth');
    const savedTableVisible = localStorage.getItem('isTableVisible'); // Load new state
    const savedContractVisible = localStorage.getItem('isContractVisible'); // Load new state

    if (savedLeftState !== null) {
      setIsLeftPanelCollapsed(JSON.parse(savedLeftState));
    }
    if (savedRightWidth !== null) {
      setRightPanelWidth(parseFloat(savedRightWidth));
    } else {
      setRightPanelWidth(DEFAULT_RIGHT_PANEL_WIDTH);
    }
    if (savedTableVisible !== null) {
      setIsTableVisible(JSON.parse(savedTableVisible));
    }
    if (savedContractVisible !== null) {
      setIsContractVisible(JSON.parse(savedContractVisible));
    }
  }, []);

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('isLeftPanelCollapsed', JSON.stringify(isLeftPanelCollapsed));
  }, [isLeftPanelCollapsed]);

  useEffect(() => {
    localStorage.setItem('rightPanelWidth', rightPanelWidth.toString());
  }, [rightPanelWidth]);

  useEffect(() => {
    localStorage.setItem('isTableVisible', JSON.stringify(isTableVisible)); // Save new state
  }, [isTableVisible]);

  useEffect(() => {
    localStorage.setItem('isContractVisible', JSON.stringify(isContractVisible)); // Save new state
  }, [isContractVisible]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  const toggleRightPanel = () => {
    setRightPanelWidth(prevWidth => (prevWidth === COLLAPSED_PANEL_WIDTH ? DEFAULT_RIGHT_PANEL_WIDTH : COLLAPSED_PANEL_WIDTH));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setInitialMouseX(e.clientX);
    setInitialRightPanelWidth(rightPanelWidth);
  }, [rightPanelWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const dx = initialMouseX - e.clientX;
    let newWidth = initialRightPanelWidth + dx;

    if (containerRef.current) {
      const maxRightWidth = containerRef.current.offsetWidth * 0.75;
      newWidth = Math.max(COLLAPSED_PANEL_WIDTH, Math.min(newWidth, maxRightWidth));
    }

    setRightPanelWidth(newWidth);
  }, [isDragging, initialMouseX, initialRightPanelWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessageId = ++messageIdCounter.current;
    const newUserMessage = { id: userMessageId, text: inputMessage, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');

    const thinkingMessageId = ++messageIdCounter.current;
    setMessages(prevMessages => [...prevMessages, { id: thinkingMessageId, text: 'Thinking...', sender: 'ai', isThinking: true }]);

    try {
      // Prepare history for the backend, excluding the temporary thinking message
      const historyForBackend = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await fetch('/api/chat', { // Call the Next.js API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newUserMessage.text,
          history: historyForBackend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API call failed:', errorData);
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== thinkingMessageId).concat({ id: ++messageIdCounter.current, text: 'Error: Could not get response.', sender: 'ai' }));
        return;
      }

      const data = await response.json();
      const aiResponseText = data.response; // Extract the 'response' field

      const newAiMessage = { id: ++messageIdCounter.current, text: aiResponseText, sender: 'ai' };
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== thinkingMessageId).concat(newAiMessage));

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== thinkingMessageId).concat({ id: ++messageIdCounter.current, text: 'Error: Network issue or server problem.', sender: 'ai' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      const newUserMessage = { id: ++messageIdCounter.current, text: `Uploaded file: ${fileName}`, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      // Simulate AI response for file upload
      setTimeout(() => {
        const newAiMessage = { id: ++messageIdCounter.current, text: `Received "${fileName}". I'll start processing it now.`, sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
      }, 1000);

      // Clear the file input value to allow re-uploading the same file
      event.target.value = '';
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  return (
    <div ref={containerRef} className="flex h-screen overflow-hidden font-sans">
      {/* Left Panel */}
      <aside
        className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${
          isLeftPanelCollapsed ? `w-[${COLLAPSED_PANEL_WIDTH}px]` : `w-[${DEFAULT_LEFT_PANEL_WIDTH}px]`
        } bg-[#1a202c] text-white flex flex-col`}
        style={{ minWidth: isLeftPanelCollapsed ? `${COLLAPSED_PANEL_WIDTH}px` : `${DEFAULT_LEFT_PANEL_WIDTH}px` }}
      >
        {!isLeftPanelCollapsed && (
          <>
            <div className="p-4 flex-1 overflow-auto custom-scrollbar">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <h2 className="text-xl font-bold mb-4">Recent Chats</h2>
              <p className="text-sm">{""}</p>
              <p className="text-xs mt-2">{""}</p>
              <div className="mt-4 text-xs text-gray-400">
                <p>{""}</p>
                <p>{""}</p>
              </div>
              {/* Recent chat list */}
              <div className="h-[300px] bg-gray-800 mt-4 p-2 rounded-md overflow-auto custom-scrollbar">
                {chatsData.map((chat) => (
                  <p key={chat.id} className="py-1 text-sm cursor-pointer hover:bg-gray-700 rounded-sm">
                    {chat.title}
                  </p>
                ))}
              </div>
            </div>
            {/* Settings Button */}
            <div className="p-4 border-t border-gray-700">
              <Button
                onClick={() => setShowSettingsModal(true)}
                className="w-full bg-gray-800 text-white hover:bg-gray-700"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </div>
          </>
        )}
        {/* Left Panel Toggle Button - now in the middle panel */}
      </aside>

      {/* Middle Content Area */}
      <main className="flex-1 bg-black text-white p-4 flex flex-col relative">
        <div className="flex items-center gap-2 mb-4"> {/* New flex container for icon and title */}
          <button
            onClick={toggleLeftPanel}
            className="bg-black text-white p-1 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label={isLeftPanelCollapsed ? 'Expand left panel' : 'Collapse left panel'}
          >
            <PanelToggleIcon isCollapsed={isLeftPanelCollapsed} isLeftPanel={true} />
          </button>
          <h1 className="text-2xl font-bold">Chat Conversation</h1>
        </div>
        <p className="text-base">{""}</p>
        <p className="text-sm mt-2">{""}</p>
        <div className="mt-4 text-sm text-gray-400">
          <p>{""}</p>
          <p>{""}</p>
        </div>
        {/* Chat messages area */}
        <div className="flex-1 bg-gray-900 mt-4 p-4 rounded-md overflow-auto shadow-inner flex flex-col space-y-4 custom-scrollbar">
          {messages.map(message => (
            <div
              key={message.id}
              className={`relative p-2 rounded-lg max-w-[80%] group ${ // Added group for hover effect
                message.sender === 'user'
                  ? 'bg-blue-900 self-end text-right ml-auto'
                  : 'bg-gray-700 self-start'
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {message.text}
              </ReactMarkdown>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  message.sender === 'user' ? '-left-2 right-auto' : '' // Adjust position for user messages
                }`}
                aria-label="Delete message"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll target */}
        </div>
        {/* Input, Upload, and Send Button - fixed at the bottom */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={messages.some(msg => (msg as any).isThinking)} // Disable input while thinking
          />
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={messages.some(msg => (msg as any).isThinking)} // Disable upload while thinking
          />
          <button
            onClick={handleUploadClick}
            className="bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 flex items-center justify-center w-10 h-10"
            aria-label="Upload file"
            disabled={messages.some(msg => (msg as any).isThinking)} // Disable button while thinking
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center w-10 h-10"
            aria-label="Send message"
            disabled={messages.some(msg => (msg as any).isThinking)} // Disable button while thinking
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Right Panel Toggle Button - already in the middle panel */}
        <button
          onClick={toggleRightPanel}
          className="absolute top-4 right-4 bg-black text-white p-1 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label={rightPanelWidth === COLLAPSED_PANEL_WIDTH ? 'Expand right panel' : 'Collapse right panel'}
        >
          <PanelToggleIcon isCollapsed={rightPanelWidth === COLLAPSED_PANEL_WIDTH} isLeftPanel={false} />
        </button>
      </main>

      {/* Right Panel */}
      <aside
        className={`relative flex-shrink-0 transition-all duration-300 ease-in-out bg-[#0f172a] text-white flex flex-col`}
        style={{ width: rightPanelWidth === COLLAPSED_PANEL_WIDTH ? `${COLLAPSED_PANEL_WIDTH}px` : `${rightPanelWidth}px`, minWidth: `${COLLAPSED_PANEL_WIDTH}px` }}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize bg-gray-700 hover:bg-gray-600 z-20"
          aria-label="Resize right panel"
        />

        {/* Conditional rendering for right panel content */}
        {rightPanelWidth > COLLAPSED_PANEL_WIDTH && (
          <div className="p-4 flex-1 overflow-auto custom-scrollbar">
            <div className="flex flex-col gap-2 mb-4"> {/* Container for the two new buttons */}
              <button
                onClick={() => setIsTableVisible(!isTableVisible)}
                className="w-full text-left text-lg font-bold flex items-center justify-between bg-transparent border-none text-white p-0 cursor-pointer focus:outline-none"
                aria-expanded={isTableVisible}
                aria-controls="table-content"
              >
                Extracted Data Table
                {isTableVisible ? <ChevronUp className="w-5 h-5 stroke-white ml-2" /> : <ChevronDown className="w-5 h-5 stroke-white ml-2" />}
              </button>
              {isTableVisible && (
                <div id="table-content" className="bg-gray-800 p-2 rounded-md overflow-auto mb-4 custom-scrollbar">
                  <p className="text-sm">This panel displays extracted data in a table.</p>
                  <p className="text-xs mt-2">Review key terms here.</p>
                  <table className="w-full text-left text-xs mt-2">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-1">Field</th>
                        <th className="p-1">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-600">
                        <td className="p-1">Client Name</td>
                        <td className="p-1">Acme Corp</td>
                      </tr>
                      <tr className="bg-gray-500">
                        <td className="p-1">Contract Date</td>
                        <td className="p-1">2023-10-26</td>
                      </tr>
                      <tr className="bg-gray-600">
                        <td className="p-1">Amount</td>
                        <td className="p-1">$10,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => setIsContractVisible(!isContractVisible)}
                className="w-full text-left text-lg font-bold flex items-center justify-between bg-transparent border-none text-white p-0 cursor-pointer focus:outline-none"
                aria-expanded={isContractVisible}
                aria-controls="contract-content"
              >
                Generated Contract
                {isContractVisible ? <ChevronUp className="w-5 h-5 stroke-white ml-2" /> : <ChevronDown className="w-5 h-5 stroke-white ml-2" />}
              </button>
              {isContractVisible && (
                <div id="contract-content" className="bg-gray-800 p-2 rounded-md overflow-auto h-[200px] custom-scrollbar">
                  <p className="text-sm">This panel displays the generated contract.</p>
                  <p className="text-xs mt-2">Review the full contract here.</p>
                  <p className="text-xs mt-2">
                    This is a preview of the generated contract based on the conversation and extracted data.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 text-xs text-gray-400">
              <p>{""}</p>
              <p>{""}</p>
            </div>
          </div>
        )}
        {/* The main toggle button for the right panel is in the middle panel */}
      </aside>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your application settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button variant="ghost" className="justify-start text-left text-white hover:bg-gray-700">Knowledge Base</Button>
            <Button variant="ghost" className="justify-start text-left text-white hover:bg-gray-700">Connectors</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
