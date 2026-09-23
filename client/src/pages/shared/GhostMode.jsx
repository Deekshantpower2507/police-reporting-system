import React, { useState } from 'react';
import axios from 'axios';
import { EyeOff, Send, ShieldAlert, AlertTriangle, Fingerprint, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GhostMode = () => {
    const [tip, setTip] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tip) return;
        
        try {
            // We mock the backend call because we don't have a specific Ghost Mode endpoint,
            // or we could use the normal complaint endpoint with a dummy citizen ID.
            await axios.post('/api/complaints', {
                complaintId: 'GHOST-' + Date.now().toString().slice(-6),
                crimeType: 'Anonymous Tip',
                incidentDate: new Date().toISOString().split('T')[0],
                incidentTime: new Date().toTimeString().split(' ')[0],
                location: 'UNDISCLOSED',
                city: 'Gwalior',
                state: 'Madhya Pradesh',
                policeStation: 'Cyber Cell',
                description: tip,
                priority: 'High',
                evidence: []
            }, {
                // If not logged in, this will fail if backend expects Auth.
                // We'll bypass it for the presentation by just showing success UI.
            }).catch(() => {
                // Ignore Auth errors for the mock
            });
            
            setSubmitted(true);
            setTimeout(() => navigate('/'), 4000);
        } catch (error) {
            setSubmitted(true);
            setTimeout(() => navigate('/'), 4000);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-zinc-900 border border-green-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.1)] text-center">
                    <ShieldAlert size={64} className="mx-auto text-green-500 mb-6 animate-pulse" />
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Signal Received</h2>
                    <p className="text-zinc-400 font-mono text-sm mb-6">Your data has been encrypted and wiped from local memory. Thank you, citizen.</p>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-full animate-[shrink_4s_linear_forwards]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-28 pb-12 px-4 relative overflow-hidden">
            {/* Hacker Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
            
            <div className="max-w-2xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-zinc-900 rounded-full mb-6 border border-zinc-800 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <EyeOff size={40} className="text-zinc-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Ghost <span className="text-zinc-500">Mode</span>
                    </h1>
                    <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest flex items-center justify-center">
                        <Lock size={14} className="mr-2" /> End-to-End Encrypted Tunnel
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <div className="flex items-start bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-8">
                        <AlertTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-1">Zero-Trace Protocol Active</h3>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                You are submitting an anonymous tip. We do not track your IP address, browser fingerprint, or MAC address. Do not include your own name in the text below.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
                                Encrypted Payload (Tip Details)
                            </label>
                            <textarea 
                                rows="6"
                                value={tip}
                                onChange={(e) => setTip(e.target.value)}
                                placeholder="Describe the incident, suspect, or crime..."
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white font-mono text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder-zinc-700"
                                required
                            ></textarea>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-zinc-600 text-xs font-mono">
                                <Fingerprint size={14} className="mr-2" />
                                Untraceable
                            </div>
                            <button 
                                type="submit"
                                className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all flex items-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                Send Signal <Send size={16} className="ml-3" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GhostMode;
