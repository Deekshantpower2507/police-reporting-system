import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, Terminal, XCircle, CheckCircle2 } from 'lucide-react';

const DarkWebScanner = () => {
    const [email, setEmail] = useState('');
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [logs, setLogs] = useState([]);

    const handleScan = (e) => {
        e.preventDefault();
        if (!email) return;

        setScanning(true);
        setResult(null);
        setLogs([]);

        // Mock scanning sequence for Cyberpunk aesthetic
        const sequence = [
            `> Initializing secure connection...`,
            `> Bypassing Tor entry nodes...`,
            `> Accessing deep web index databases...`,
            `> Querying COMB (Compilation of Many Breaches)...`,
            `> Cross-referencing alias: ${email}...`,
            `> Decrypting hash tables...`
        ];

        let i = 0;
        const logInterval = setInterval(() => {
            if (i < sequence.length) {
                setLogs(prev => [...prev, sequence[i]]);
                i++;
            } else {
                clearInterval(logInterval);
                finishScan();
            }
        }, 600); // 600ms between logs
    };

    const finishScan = () => {
        setScanning(false);
        // Randomize result based on email string length for demo consistency
        if (email.length % 2 === 0) {
            setResult({
                breached: true,
                breaches: [
                    { name: 'LinkedIn (2012)', date: '2012-05-05', data: 'Email, Passwords' },
                    { name: 'Canva (2019)', date: '2019-05-24', data: 'Email, Names, Passwords' }
                ]
            });
        } else {
            setResult({ breached: false, breaches: [] });
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative mb-10">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-black/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Terminal className="text-primary-500" size={20} />
                    <h3 className="text-white font-mono text-sm uppercase tracking-widest font-bold">Dark Web Threat Scanner</h3>
                </div>
                <div className="px-2 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded text-[10px] font-mono tracking-widest animate-pulse">
                    OSINT TOOL v2.4
                </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Input Section */}
                <div className="flex-1">
                    <p className="text-zinc-400 text-sm mb-6">
                        Enter your email address to run a deep-scan against known cybercriminal databases and dark web leaks. 
                        Protect your identity before attackers strike.
                    </p>
                    
                    <form onSubmit={handleScan} className="space-y-4">
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="TARGET_EMAIL_ADDRESS"
                                    disabled={scanning}
                                    className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-lg bg-black text-white font-mono placeholder-zinc-600 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={scanning || !email}
                            className="w-full bg-primary-600 text-black font-black uppercase tracking-widest py-3 rounded-lg hover:bg-primary-500 transition-colors disabled:bg-zinc-700 disabled:text-zinc-500 flex items-center justify-center"
                        >
                            {scanning ? (
                                <><span className="animate-spin h-4 w-4 border-2 border-zinc-500 border-t-black rounded-full mr-2"></span> SCANNING...</>
                            ) : 'INITIATE SCAN'}
                        </button>
                    </form>
                </div>

                {/* Output Terminal */}
                <div className="flex-1 bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs overflow-hidden h-[250px] flex flex-col relative">
                    <div className="text-zinc-600 mb-2 border-b border-zinc-800 pb-2">SCAN_OUTPUT_LOGS</div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className="text-primary-500/80 animate-fadeIn">{log}</div>
                        ))}

                        {scanning && (
                            <div className="text-zinc-500 animate-pulse mt-2">_</div>
                        )}

                        {result && !result.breached && (
                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 flex items-start">
                                <CheckCircle2 className="mr-2 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <strong className="block mb-1">NO BREACHES DETECTED</strong>
                                    This email was not found in any known dark web databases.
                                </div>
                            </div>
                        )}

                        {result && result.breached && (
                            <div className="mt-4 animate-fadeIn">
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 flex items-start mb-3">
                                    <AlertTriangle className="mr-2 shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <strong className="block mb-1 text-red-500">WARNING: BREACH DETECTED</strong>
                                        Your data was found in {result.breaches.length} compromised databases!
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {result.breaches.map((b, i) => (
                                        <div key={i} className="pl-3 border-l-2 border-red-500/50 text-zinc-300 py-1">
                                            <span className="text-red-400 font-bold">{b.name}</span> <span className="text-zinc-500">({b.date})</span>
                                            <div className="text-[10px] text-zinc-500 mt-1">Compromised Data: {b.data}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-[10px] text-zinc-500">RECOMMENDATION: CHANGE PASSWORDS IMMEDIATELY</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DarkWebScanner;
