import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, User, Phone, MapPin, Search } from 'lucide-react';

const Bulletins = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBulletins = async () => {
            try {
                const res = await axios.get('/api/bulletins');
                setBulletins(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBulletins();
    }, []);

    const filtered = bulletins.filter(b => {
        const matchesFilter = filter === 'All' || b.type === filter;
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                              b.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary-500 font-mono">LOADING_DATABANKS...</div>;

    return (
        <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Cyberpunk background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block p-3 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
                        ACTIVE <span className="text-red-500">BULLETINS</span>
                    </h1>
                    <p className="text-zinc-400 font-mono text-sm max-w-2xl mx-auto uppercase tracking-widest">
                        Official Police missing persons and wanted suspect board. Submit anonymous tips if spotted.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bento-card p-4 border-l-4 border-l-primary-500">
                    <div className="flex space-x-2 w-full md:w-auto">
                        {['All', 'Missing', 'Wanted'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-xs transition-all ${filter === f ? 'bg-primary-500 text-black shadow-[0_0_15px_rgba(0,255,204,0.4)]' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-zinc-500" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="SEARCH_RECORDS..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(bulletin => (
                            <div key={bulletin._id} className="bento-card overflow-hidden group hover:border-zinc-700 transition-all flex flex-col h-full">
                                {bulletin.image ? (
                                    <div className="h-64 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                        {/* Assuming server on localhost:5000 for image */}
                                        <img src={`http://localhost:5000${bulletin.image}`} alt={bulletin.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <span className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${bulletin.type === 'Wanted' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.8)]'}`}>
                                            {bulletin.type}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="h-48 bg-zinc-900 flex items-center justify-center relative border-b border-zinc-800">
                                        <User size={48} className="text-zinc-700" />
                                        <span className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${bulletin.type === 'Wanted' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.8)]'}`}>
                                            {bulletin.type}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-black uppercase tracking-wide mb-2 text-white">{bulletin.title}</h3>
                                    <p className="text-zinc-400 text-sm mb-6 flex-grow">{bulletin.description}</p>
                                    
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 mt-auto">
                                        <div className="flex items-start text-xs font-mono text-zinc-300">
                                            <Phone size={14} className="mr-2 mt-0.5 text-primary-500 flex-shrink-0" />
                                            <span>{bulletin.contactInfo}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
                        <AlertCircle size={48} className="mx-auto text-zinc-600 mb-4" />
                        <p className="text-zinc-400 font-mono text-lg uppercase tracking-widest">No active bulletins found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bulletins;
