import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FileText, Clock, CheckCircle, Activity, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

const CitizenDashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await axios.get('/api/complaints/my-complaints');
                setComplaints(res.data);
            } catch (error) {
                console.error("Error fetching complaints", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Submitted': return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
            case 'Under Review': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
            case 'Assigned': return 'bg-purple-500/20 text-purple-400 border border-purple-500/50';
            case 'Under Investigation': return 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
            case 'Resolved': return 'bg-green-500/20 text-green-400 border border-green-500/50';
            case 'Rejected': return 'bg-red-500/20 text-red-400 border border-red-500/50';
            default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
        }
    };

    const stats = {
        total: complaints.length,
        active: complaints.filter(c => !['Resolved', 'Rejected'].includes(c.status)).length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                <div className="text-primary-500 font-mono text-sm uppercase tracking-widest animate-pulse">Initializing Dashboard...</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative min-h-screen">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between relative z-10">
                <div>
                    <div className="inline-flex items-center px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 mb-4">
                        <Cpu size={12} className="mr-2 text-primary-500" /> SYS_ACCESS_GRANTED
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">OPERATOR: <span className="text-primary-500">{user?.name}</span></h1>
                    <p className="text-zinc-400 font-medium">Command center initialized. Overview of your active reports.</p>
                </div>
                <div className="mt-6 md:mt-0 space-x-3">
                    <Link to="/citizen/report" className="inline-flex items-center px-6 py-3 bg-primary-500 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] transition-all">
                        <ShieldAlert size={18} className="mr-2" /> NEW INCIDENT
                    </Link>
                </div>
            </div>

            {/* Premium Stat Cards - Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
                <div className="bento-card p-6 overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={120} />
                    </div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-2">Total Logs</p>
                    <p className="text-5xl font-black text-white">{stats.total}</p>
                </div>
                
                <div className="bento-card p-6 overflow-hidden relative group border-t-2 border-t-orange-500">
                    <div className="absolute -right-4 -bottom-4 opacity-10 text-orange-500 group-hover:opacity-20 transition-opacity">
                        <Activity size={120} />
                    </div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-2">Active Pursuits</p>
                    <p className="text-5xl font-black text-orange-400 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]">{stats.active}</p>
                </div>
                
                <div className="bento-card p-6 overflow-hidden relative group border-t-2 border-t-green-500">
                    <div className="absolute -right-4 -bottom-4 opacity-10 text-green-500 group-hover:opacity-20 transition-opacity">
                        <CheckCircle size={120} />
                    </div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-2">Cases Closed</p>
                    <p className="text-5xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">{stats.resolved}</p>
                </div>
            </div>

            {/* Recent Complaints Terminal */}
            <div className="bento-card overflow-hidden relative z-10 border border-zinc-800">
                <div className="p-4 border-b border-zinc-800 bg-black/50 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-4 font-mono text-sm text-zinc-400 uppercase tracking-widest">Local_Logs.exe</span>
                    </div>
                    <Link to="/my-complaints" className="text-primary-500 font-mono text-xs hover:text-primary-400 flex items-center">
                        VIEW_ALL <ArrowRight size={14} className="ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto bg-[#0f0f13]">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-900/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-mono text-zinc-500 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 bg-[#0f0f13]">
                                        <div className="flex flex-col items-center justify-center font-mono">
                                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4"><FileText size={32} className="text-zinc-600" /></div>
                                            <p className="font-bold text-white mb-1">DATA_NOT_FOUND</p>
                                            <p className="text-sm">No records logged in the system.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                complaints.slice(0, 5).map(c => (
                                    <tr key={c._id} className="hover:bg-zinc-800/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{c.complaintId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-300">{c.crimeType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-[10px] font-black uppercase tracking-widest rounded-sm ${getStatusColor(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/complaint/${c._id}`} className="text-primary-500 hover:text-primary-400 font-mono text-xs border border-primary-500/30 px-3 py-1 rounded bg-primary-500/10 transition-colors inline-block opacity-0 group-hover:opacity-100">
                                                INSPECT
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
