import React from 'react';
import { Shield, Disc } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-zinc-800 bg-[#09090b] mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-8 md:mb-0">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-primary-500 rounded-full mr-3">
                                <Shield className="h-5 w-5 text-black" />
                            </div>
                            <span className="font-bold text-xl tracking-tighter text-white">
                                N.C.R.<span className="text-primary-500">S.</span>
                            </span>
                        </div>
                        <p className="text-zinc-500 max-w-sm text-sm">
                            Next-gen incident reporting. Encrypted, anonymous if needed, and brutally efficient. Stay safe out there.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Resources</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">Safety Tips</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">API Access</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Emergency</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-red-400 font-bold hover:text-red-300 transition-colors flex items-center"><Disc size={10} className="mr-2 animate-pulse"/> Dial 112</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Cyber Crime: 1930</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600">
                    <p>SYSTEM_V2.0 &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <a href="#" className="hover:text-zinc-300">PRIVACY</a>
                        <a href="#" className="hover:text-zinc-300">TERMS</a>
                        <a href="#" className="hover:text-zinc-300">STATUS</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
