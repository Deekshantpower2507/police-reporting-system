import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Zap, ArrowRight, Activity, Terminal } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#09090b] overflow-hidden relative">
            {/* Cyberpunk Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-900 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-900 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-blue-900 rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>

            {/* Grid overlay for tech vibe */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0 pointer-events-none"></div>

            {/* Massive Blurred POLICE Text Background */}
            <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none select-none opacity-[0.04]">
                <h1 className="text-[30vw] font-black text-white filter blur-[12px] tracking-tighter uppercase whitespace-nowrap leading-none">
                    POLICE
                </h1>
            </div>

            {/* Hero Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-48 flex flex-col lg:flex-row items-center z-10">
                <div className="lg:w-1/2 text-center lg:text-left lg:pr-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-xs font-bold mb-8 uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,204,0.1)]">
                        <span className="flex h-1.5 w-1.5 relative mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
                        </span>
                        System Online_
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
                        REPORT. <br />
                        <span className="text-zinc-600">TRACK.</span> <br />
                        <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,255,204,0.3)]">RESOLVE.</span>
                    </h1>
                    <p className="mt-6 text-xl text-zinc-400 mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                        The next-gen citizen platform. Secure your block, upload evidence anonymously, and watch justice happen in real-time. No cap.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link to="/citizen/report" className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-black rounded-full font-bold shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:shadow-[0_0_30px_rgba(0,255,204,0.6)] transition-all flex items-center justify-center transform hover:-translate-y-1">
                            Report Incident <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <Link to="/track" className="px-8 py-4 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white rounded-full font-bold transition-all flex items-center justify-center transform hover:-translate-y-1">
                            Track Status <Activity size={20} className="ml-2 text-zinc-400" />
                        </Link>
                    </div>
                </div>
                
                <div className="lg:w-1/2 mt-20 lg:mt-0 relative w-full">
                    {/* Abstract Data Visualization */}
                    <div className="relative w-full aspect-square max-w-lg mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/50 to-accent-900/50 rounded-[3rem] transform rotate-6 scale-105 border border-white/5 backdrop-blur-3xl"></div>
                        
                        <div className="absolute inset-0 bg-[#18181b] rounded-[3rem] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
                            {/* Fake Terminal Header */}
                            <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto flex items-center text-xs text-zinc-500 font-mono">
                                    <Terminal size={12} className="mr-2" /> secure_feed.exe
                                </div>
                            </div>
                            
                            {/* Fake Terminal Body */}
                            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">


                                <div className="bento-card p-4 border-primary-500/30 bg-primary-500/5 animate-float" style={{animationDelay: '1s'}}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-xs font-mono text-zinc-400">STATUS_UPDATE</span>
                                        </div>
                                        <span className="text-xs text-zinc-600">2m ago</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">Case #0042 Resolved.</p>
                                    <div className="mt-2 flex space-x-1">
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded uppercase font-bold">Closed</span>
                                        <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded uppercase font-bold">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - Bento Grid */}
            <div className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">THE ARSENAL</h2>
                        <p className="text-zinc-400 text-lg">Everything you need. Nothing you don't.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                        {/* Large Bento */}
                        <div className="md:col-span-2 bento-card p-8 flex flex-col justify-end relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full filter blur-[50px] group-hover:bg-primary-500/20 transition-all"></div>
                            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-auto border border-zinc-700">
                                <Zap className="text-primary-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Lightning Fast</h3>
                            <p className="text-zinc-400 relative z-10">Drop your report in under 60 seconds. Upload pics, vids, and drop a pin. We handle the rest.</p>
                        </div>
                        
                        {/* Standard Bento */}
                        <div className="bento-card p-8 flex flex-col justify-end group">
                            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-auto border border-zinc-700">
                                <Shield className="text-accent-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Ghost Mode</h3>
                            <p className="text-zinc-400">Total anonymity. Zero digital footprints left behind.</p>
                        </div>

                        {/* Standard Bento */}
                        <div className="bento-card p-8 flex flex-col justify-end group">
                            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-auto border border-zinc-700">
                                <Eye className="text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Live Tracking</h3>
                            <p className="text-zinc-400">Watch the investigation unfold in real-time.</p>
                        </div>

                        {/* Large Bento */}
                        <div className="md:col-span-2 bento-card p-8 flex flex-col justify-end relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555626906-fcf10d6851b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center grayscale mix-blend-overlay"></div>
                            <div className="relative z-10">
                                <div className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded mb-4 border border-red-500/30">EMERGENCY DIRECT</div>
                                <h3 className="text-3xl font-black text-white mb-2">Direct to Authorities</h3>
                                <p className="text-zinc-400 max-w-md">Bypass the red tape. High-priority alerts go straight to the nearest active patrol units.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="py-32 relative z-10 border-t border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">
                        JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">NETWORK.</span>
                    </h2>
                    <Link to="/register" className="inline-block px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-lg transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                        INITIALIZE ACCOUNT
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
