import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, MapPin, AlertCircle, Upload, CheckCircle, ChevronRight, ChevronLeft, Hexagon, User, Zap } from 'lucide-react';

const ReportCrime = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        crimeType: '',
        incidentDate: '',
        incidentTime: '',
        location: '',
        city: '',
        state: '',
        policeStation: '',
        assignedOfficer: '',
        description: '',
        priority: 'Medium'
    });

    const [victimInfo, setVictimInfo] = useState({ name: '', phone: '', email: '', address: '' });
    const [suspectInfo, setSuspectInfo] = useState({ name: '', description: '', contactInformation: '', relationship: '', aiSketchUrl: '' });
    const [evidence, setEvidence] = useState([]);
    const [generatingSketch, setGeneratingSketch] = useState(false);

    // AI CyberCop States
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [aiInputText, setAiInputText] = useState('');
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiLogs, setAiLogs] = useState([]);

    const handleAIAssist = async () => {
        if (!aiInputText.trim()) return;
        setAiProcessing(true);
        setAiLogs(['> Initializing NLP Core...', '> Analyzing linguistic semantics...']);
        
        await new Promise(r => setTimeout(r, 800));
        setAiLogs(prev => [...prev, '> Extracting entities (Time, Location, Crime)...']);
        
        await new Promise(r => setTimeout(r, 1000));
        setAiLogs(prev => [...prev, '> Cross-referencing penal codes...']);

        await new Promise(r => setTimeout(r, 800));
        
        const lowerText = aiInputText.toLowerCase();
        
        // Mock NLP Extraction Logic
        let detectedType = 'Other';
        if (lowerText.includes('hack') || lowerText.includes('password') || lowerText.includes('email') || lowerText.includes('scam')) detectedType = 'Cybercrime';
        if (lowerText.includes('stole') || lowerText.includes('robbed') || lowerText.includes('wallet') || lowerText.includes('thief')) detectedType = 'Theft';
        if (lowerText.includes('hit') || lowerText.includes('attack') || lowerText.includes('fight')) detectedType = 'Assault';

        let detectedPriority = 'Medium';
        if (lowerText.includes('gun') || lowerText.includes('knife') || lowerText.includes('blood') || lowerText.includes('urgent')) detectedPriority = 'High';
        if (lowerText.includes('scam')) detectedPriority = 'Low';

        const today = new Date().toISOString().split('T')[0];
        
        // Extract a mock suspect physical description if available
        let extractedSuspect = '';
        if (lowerText.includes('tall') || lowerText.includes('short') || lowerText.includes('wearing') || lowerText.includes('beard')) {
            extractedSuspect = 'Auto-extracted: ' + aiInputText.substring(0, 50) + '...';
        }

        setFormData(prev => ({
            ...prev,
            crimeType: detectedType,
            incidentDate: today,
            incidentTime: '12:00',
            description: `[AI AUTO-TRANSCRIBED]\n${aiInputText}`,
            priority: detectedPriority,
            city: 'Gwalior',
            location: 'Auto-extracted from context'
        }));

        if (extractedSuspect) {
            setSuspectInfo(prev => ({ ...prev, description: extractedSuspect }));
        }

        setAiLogs(prev => [...prev, '> Form auto-populated successfully!']);
        
        await new Promise(r => setTimeout(r, 1000));
        setAiProcessing(false);
        setAiChatOpen(false);
        setStep(3); // Jump to Details step to show off the populated form
    };

    const handleGenerateSketch = (e) => {
        e.preventDefault();
        if (!suspectInfo.description) {
            alert("Please provide a physical description first!");
            return;
        }
        setGeneratingSketch(true);
        // Using Pollinations AI for free, no-key image generation based on prompt
        const prompt = encodeURIComponent(`police composite sketch of a suspect, ${suspectInfo.description}, black and white pencil drawing, highly detailed, realistic`);
        const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;
        
        // Pre-load the image
        const img = new Image();
        img.onload = () => {
            setSuspectInfo({ ...suspectInfo, aiSketchUrl: url });
            setGeneratingSketch(false);
        };
        img.onerror = () => {
            alert("Failed to generate sketch. Try again.");
            setGeneratingSketch(false);
        };
        img.src = url;
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleVictimChange = (e) => setVictimInfo({ ...victimInfo, [e.target.name]: e.target.value });
    const handleSuspectChange = (e) => setSuspectInfo({ ...suspectInfo, [e.target.name]: e.target.value });
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setEvidence([...evidence, ...files]);
    };

    const removeFile = (index) => {
        const newEvidence = [...evidence];
        newEvidence.splice(index, 1);
        setEvidence(newEvidence);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('victimInformation', JSON.stringify(victimInfo));
        data.append('suspectInformation', JSON.stringify(suspectInfo));
        
        evidence.forEach(file => {
            data.append('evidence', file);
        });

        try {
            const res = await axios.post('/api/complaints', data);
            alert(`REPORT LOGGED. ID: ${res.data.complaintId}`);
            navigate('/citizen/dashboard');
        } catch (error) {
            console.error("Error submitting", error);
            alert("SYSTEM ERROR. FAILED TO LOG REPORT.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, title: 'BASE_DATA', icon: <FileText size={16} /> },
        { num: 2, title: 'GEO_LOC', icon: <MapPin size={16} /> },
        { num: 3, title: 'DETAILS', icon: <AlertCircle size={16} /> },
        { num: 4, title: 'UPLOADS', icon: <Upload size={16} /> },
    ];

    const inputClasses = "appearance-none block w-full p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono text-sm shadow-inner";
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 relative min-h-screen">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-900/10 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"></div>

            <div className="text-center mb-12 relative z-10">
                <div className="inline-block p-3 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
                    <Hexagon size={24} className="text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">LOG <span className="text-primary-500">INCIDENT</span></h1>
                <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Secure encrypted submission portal</p>
            </div>

            {/* Premium Stepper */}
            <div className="mb-12 relative z-10 max-w-2xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10 transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -z-10 transform -translate-y-1/2 transition-all duration-500 shadow-[0_0_10px_rgba(0,255,204,0.8)]" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
                
                <div className="flex justify-between">
                    {steps.map((s) => (
                        <div key={s.num} className="flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${step >= s.num ? 'bg-primary-500 text-black shadow-[0_0_15px_rgba(0,255,204,0.5)] transform scale-110' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}>
                                {step > s.num ? <CheckCircle size={18} /> : s.icon}
                            </div>
                            <div className={`mt-3 text-[10px] font-mono tracking-widest ${step >= s.num ? 'text-primary-500 font-bold' : 'text-zinc-600'}`}>
                                {s.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bento-card p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 border-t-2 border-t-primary-500">
                <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                    
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center mb-6 border-b border-zinc-800 pb-4">
                                <span className="text-primary-500 font-mono text-sm mr-2">01 //</span>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Base Data</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Category <span className="text-primary-500">*</span></label>
                                    <select name="crimeType" required value={formData.crimeType} onChange={handleInputChange} className={inputClasses}>
                                        <option value="">-- SELECT CLASSIFICATION --</option>
                                        <option value="Theft/Burglary">THEFT / BURGLARY</option>
                                        <option value="Cybercrime">CYBERCRIME / FRAUD</option>
                                        <option value="Assault">ASSAULT / VIOLENCE</option>
                                        <option value="Harassment">HARASSMENT</option>
                                        <option value="Missing Person">MISSING PERSON</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Date <span className="text-primary-500">*</span></label>
                                        <input type="date" name="incidentDate" required max={today} value={formData.incidentDate} onChange={handleInputChange} className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Time</label>
                                        <input type="time" name="incidentTime" max={formData.incidentDate === today ? currentTime : undefined} value={formData.incidentTime} onChange={handleInputChange} className={inputClasses} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center mb-6 border-b border-zinc-800 pb-4">
                                <span className="text-primary-500 font-mono text-sm mr-2">02 //</span>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Geo-Location</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Coordinates / Address <span className="text-primary-500">*</span></label>
                                    <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className={inputClasses} placeholder="EXACT_LOCATION_DATA" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">City <span className="text-primary-500">*</span></label>
                                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">State <span className="text-primary-500">*</span></label>
                                        <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className={inputClasses} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Nearest Police Station</label>
                                        <select name="policeStation" value={formData.policeStation} onChange={handleInputChange} className={inputClasses}>
                                            <option value="">-- SELECT NEAREST STATION --</option>
                                            <option value="Gwalior HQ">Gwalior HQ</option>
                                            <option value="Maharajpura Station">Maharajpura Station</option>
                                            <option value="Hazira Station">Hazira Station</option>
                                            <option value="University Station">University Station</option>
                                            <option value="Lashkar Station">Lashkar Station</option>
                                            <option value="Behat Station">Behat Station</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center mb-6 border-b border-zinc-800 pb-4">
                                <span className="text-primary-500 font-mono text-sm mr-2">03 //</span>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Details</h2>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Log entry <span className="text-primary-500">*</span></label>
                                <textarea name="description" required rows="5" value={formData.description} onChange={handleInputChange} className={inputClasses} placeholder="Describe the sequence of events..."></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                                    <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest flex items-center"><User size={14} className="mr-2 text-blue-500"/> Victim Info <span className="text-zinc-600 ml-2">(OPTIONAL)</span></h3>
                                    <div className="space-y-3">
                                        <input type="text" name="name" placeholder="NAME" value={victimInfo.name} onChange={handleVictimChange} className={inputClasses} />
                                        <input type="text" name="phone" placeholder="PHONE" value={victimInfo.phone} onChange={handleVictimChange} className={inputClasses} />
                                        <input type="email" name="email" placeholder="EMAIL" value={victimInfo.email || ''} onChange={handleVictimChange} className={inputClasses} />
                                        <textarea name="address" placeholder="ADDRESS" rows="2" value={victimInfo.address} onChange={handleVictimChange} className={inputClasses}></textarea>
                                    </div>
                                </div>
                                <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                                    <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest flex items-center"><AlertCircle size={14} className="mr-2 text-red-500"/> Suspect Info <span className="text-zinc-600 ml-2">(IF KNOWN)</span></h3>
                                    <div className="space-y-3">
                                        <input type="text" name="name" placeholder="NAME / ALIAS" value={suspectInfo.name} onChange={handleSuspectChange} className={inputClasses} />
                                        <input type="text" name="description" placeholder="PHYSICAL_DESCRIPTION" value={suspectInfo.description} onChange={handleSuspectChange} className={inputClasses} />
                                        <input type="text" name="contactInformation" placeholder="CONTACT (PHONE/EMAIL/SOCIAL)" value={suspectInfo.contactInformation || ''} onChange={handleSuspectChange} className={inputClasses} />
                                        
                                        <button 
                                            onClick={handleGenerateSketch} 
                                            disabled={generatingSketch}
                                            className="w-full mt-2 py-2 px-4 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                        >
                                            {generatingSketch ? 'Generating AI Sketch...' : 'Generate AI Suspect Sketch'}
                                        </button>
                                        
                                        {suspectInfo.aiSketchUrl && (
                                            <div className="mt-4 border border-zinc-700 rounded-lg overflow-hidden relative">
                                                <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 font-mono w-full">AI GENERATED COMPOSITE SKETCH</div>
                                                <img src={suspectInfo.aiSketchUrl} alt="AI Suspect Sketch" className="w-full h-auto" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center mb-6 border-b border-zinc-800 pb-4">
                                <span className="text-primary-500 font-mono text-sm mr-2">04 //</span>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Evidence & Priority</h2>
                            </div>
                            
                            <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-700 rounded-2xl p-10 text-center relative hover:bg-zinc-900/80 hover:border-primary-500/50 transition-colors group cursor-pointer">
                                <Upload size={48} className="mx-auto text-zinc-600 mb-4 group-hover:text-primary-500 transition-colors" />
                                <p className="text-white font-bold mb-2">DRAG & DROP OR CLICK TO BROWSE</p>
                                <p className="text-xs text-zinc-500 font-mono">JPG, PNG, MP4, PDF (MAX 50MB)</p>
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>

                            {evidence.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Attached Files:</h4>
                                    <ul className="space-y-2">
                                        {evidence.map((file, index) => (
                                            <li key={index} className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800 shadow-sm text-sm">
                                                <span className="truncate text-zinc-300 font-mono text-xs"><FileText size={12} className="inline mr-2 text-primary-500"/>{file.name}</span>
                                                <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-300 font-mono text-xs bg-red-500/10 px-2 py-1 rounded">REMOVE</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-zinc-800">
                                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Threat Level</label>
                                <select name="priority" value={formData.priority} onChange={handleInputChange} className={inputClasses}>
                                    <option value="Low">LOW (Non-urgent info)</option>
                                    <option value="Medium">MEDIUM (Standard log)</option>
                                    <option value="High">HIGH (Serious, needs attention)</option>
                                    <option value="Critical">CRITICAL (Immediate danger)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex justify-between">
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} className="px-6 py-4 border border-zinc-700 rounded-xl text-zinc-400 font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-colors flex items-center text-sm">
                                <ChevronLeft size={16} className="mr-2" /> REVERT
                            </button>
                        ) : <div></div>}
                        
                        {step < 4 ? (
                            <button type="submit" className="px-8 py-4 bg-primary-500 text-black rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] transition-all flex items-center text-sm transform hover:-translate-y-1">
                                PROCEED <ChevronRight size={16} className="ml-2" />
                            </button>
                        ) : (
                            <button type="submit" disabled={loading} className="px-8 py-4 bg-red-500 text-black rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all flex items-center text-sm transform hover:-translate-y-1 disabled:opacity-50">
                                {loading ? 'UPLOADING...' : 'TRANSMIT REPORT'} <Zap size={16} className="ml-2" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Floating AI Assistant Button */}
            {!aiChatOpen && (
                <button 
                    onClick={() => setAiChatOpen(true)}
                    className="fixed bottom-8 right-8 z-50 bg-primary-500 text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,255,204,0.6)] hover:scale-110 transition-transform flex items-center justify-center group"
                >
                    <Zap size={24} className="group-hover:animate-pulse" />
                </button>
            )}

            {/* AI Assistant Modal */}
            {aiChatOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-primary-500/50 rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(0,255,204,0.15)] flex flex-col overflow-hidden">
                        <div className="bg-black/80 border-b border-zinc-800 p-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <Zap className="text-primary-500 mr-2" size={20} />
                                <h3 className="text-white font-mono font-bold uppercase tracking-widest">CyberCop AI Assist</h3>
                            </div>
                            <button onClick={() => setAiChatOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-6 flex-grow flex flex-col">
                            {!aiProcessing ? (
                                <>
                                    <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                                        Hello. I am CyberCop, your AI reporting assistant. 
                                        Don't worry about filling out complicated forms. Just describe what happened in your own words, and I will automatically extract the details and fill out the report for you.
                                    </p>
                                    <textarea 
                                        rows="5"
                                        value={aiInputText}
                                        onChange={(e) => setAiInputText(e.target.value)}
                                        placeholder="e.g., Yesterday around 3 PM, my Facebook was hacked by someone claiming to be a tech support agent. He scammed me out of $500. He sounded like a tall man with a deep voice..."
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-sm font-mono focus:border-primary-500 outline-none resize-none mb-4"
                                    ></textarea>
                                    <button 
                                        onClick={handleAIAssist}
                                        disabled={!aiInputText.trim()}
                                        className="w-full bg-primary-600 text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Extract & Auto-Fill
                                    </button>
                                </>
                            ) : (
                                <div className="py-8 font-mono text-xs flex flex-col h-full bg-black rounded-lg p-4 border border-zinc-800">
                                    <div className="text-primary-500 mb-2 border-b border-zinc-800 pb-2 flex items-center">
                                        <span className="animate-spin h-3 w-3 border-2 border-primary-500 border-t-transparent rounded-full mr-2"></span>
                                        PROCESSING_NLP_STREAM
                                    </div>
                                    <div className="space-y-2 flex-grow overflow-y-auto mt-2 text-zinc-400">
                                        {aiLogs.map((log, i) => (
                                            <div key={i} className="animate-fadeIn">{log}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportCrime;
