import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ClipboardList, Clock, Search } from 'lucide-react';

const PoliceDashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await axios.get('/api/complaints/assigned');
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
            case 'Assigned': return 'bg-purple-100 text-purple-800';
            case 'Under Investigation': return 'bg-orange-100 text-orange-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = {
        total: complaints.length,
        new: complaints.filter(c => c.status === 'Assigned').length,
        investigating: complaints.filter(c => c.status === 'Under Investigation').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    const filteredComplaints = complaints.filter(c => 
        c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.crimeType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
                    <p className="text-gray-600 mb-8">Welcome back, {user?.name} ({user?.officerId})</p>
                </div>
                
                {/* Dynamic Threat Level Defcon System */}
                <div className={`px-6 py-2 rounded-full border-2 font-black tracking-widest uppercase flex items-center shadow-lg transition-all animate-pulse ${
                    stats.new >= 3 
                        ? 'bg-red-100 border-red-500 text-red-700 shadow-red-500/20' 
                        : stats.investigating >= 3 
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-700 shadow-yellow-500/20'
                            : 'bg-green-100 border-green-500 text-green-700 shadow-green-500/20'
                }`}>
                    <AlertCircle size={20} className="mr-2" />
                    THREAT LEVEL: {
                        stats.new >= 3 ? 'DEFCON 2 (CRITICAL)' 
                        : stats.investigating >= 3 ? 'DEFCON 3 (ELEVATED)'
                        : 'DEFCON 5 (NORMAL)'
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Assigned Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ClipboardList size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">New / Unread</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                    </div>
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Clock size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Under Investigation</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.investigating}</p>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Search size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Resolved Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                    </div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><ClipboardList size={24}/></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">My Cases</h2>
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search cases..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-full p-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crime Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No cases found</td>
                                </tr>
                            ) : (
                                filteredComplaints.map(c => (
                                    <tr key={c._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.complaintId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.crimeType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.city}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${c.priority === 'High' || c.priority === 'Critical' ? 'text-red-600' : 'text-gray-600'}`}>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/police/investigation/${c._id}`} className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1 rounded">Investigate</Link>
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

export default PoliceDashboard;
