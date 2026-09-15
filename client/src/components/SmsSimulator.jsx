import React, { useState, useEffect } from 'react';
import { Smartphone, Battery, Wifi, Signal } from 'lucide-react';

const SmsSimulator = ({ complaints }) => {
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        if (!complaints || complaints.length === 0) return;
        
        let generatedMessages = [];
        
        complaints.forEach(c => {
            // First message: Submitted
            generatedMessages.push({
                id: `${c.id}-sub`,
                time: new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                text: `N.C.R.S. ALERT: Your incident report #${c.complaintId} has been successfully filed in the Central Database.`,
                timestamp: new Date(c.createdAt).getTime()
            });

            // Second message: Assigned or other statuses
            if (c.status !== 'Submitted') {
                let statusText = '';
                if (c.status === 'Assigned') {
                    statusText = `has been assigned to an officer for investigation.`;
                } else if (c.status === 'Under Investigation') {
                    statusText = `is currently under active investigation.`;
                } else if (c.status === 'Resolved') {
                    statusText = `has been successfully RESOLVED. Case closed.`;
                } else if (c.status === 'Rejected') {
                    statusText = `has been REJECTED. Please check the portal for details.`;
                } else {
                    statusText = `status updated to: ${c.status}.`;
                }

                generatedMessages.push({
                    id: `${c.id}-stat`,
                    time: new Date(c.updatedAt || c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    text: `N.C.R.S. ALERT: Case #${c.complaintId} ${statusText}`,
                    timestamp: new Date(c.updatedAt || c.createdAt).getTime() + 1000 
                });
            }
        });

        // Sort by timestamp and take top 5 most recent
        generatedMessages.sort((a, b) => b.timestamp - a.timestamp);
        setMessages(generatedMessages.slice(0, 5).reverse());
    }, [complaints]);

    return (
        <div className="bg-[#121212] rounded-[40px] border-[8px] border-[#333] shadow-2xl overflow-hidden w-full max-w-xs mx-auto relative h-[600px] flex flex-col font-sans">
            {/* iPhone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-[#333] rounded-b-3xl w-40 mx-auto z-20"></div>
            
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 pt-2 pb-2 bg-[#f4f4f4] text-black text-[10px] font-bold z-10 relative">
                <span>9:41</span>
                <div className="flex space-x-1 items-center">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={14} />
                </div>
            </div>

            {/* App Header */}
            <div className="bg-[#f4f4f4] pb-2 border-b border-gray-300 text-center relative">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mb-1">
                        <Smartphone size={20} />
                    </div>
                    <span className="text-xs text-gray-800 font-bold">N.C.R.S. Alerts</span>
                    <span className="text-[10px] text-gray-500">Government SMS System</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow bg-white p-4 overflow-y-auto flex flex-col space-y-4">
                <p className="text-center text-[10px] text-gray-400 font-medium">Today</p>
                
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-xs mt-10">No recent alerts</div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className="flex flex-col items-start animate-fadeIn">
                            <div className="bg-[#e9e9eb] text-black p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm text-sm leading-snug">
                                {msg.text}
                            </div>
                            <span className="text-[9px] text-gray-400 mt-1 ml-1">{msg.time}</span>
                        </div>
                    ))
                )}
                
                {/* Typing indicator mock */}
                <div className="flex flex-col items-start opacity-50">
                    <div className="bg-[#e9e9eb] p-3 rounded-2xl rounded-tl-sm w-12 flex space-x-1 items-center justify-center h-8">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
            
            {/* Home Indicator */}
            <div className="h-1 w-1/3 bg-black rounded-full mx-auto my-2 mb-3"></div>
        </div>
    );
};

export default SmsSimulator;
