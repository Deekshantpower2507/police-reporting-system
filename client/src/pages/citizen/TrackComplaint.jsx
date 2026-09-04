import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

const TrackComplaint = () => {
    const [trackingId, setTrackingId] = useState('');
    const [complaint, setComplaint] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) return;
        
        setLoading(true);
        setError('');
        setComplaint(null);

        try {
            const res = await axios.get(`/api/complaints/track/${trackingId}`);
            setComplaint(res.data.complaint);
            setHistory(res.data.history);
        } catch (err) {
            setError(err.response?.data?.message || 'Complaint not found');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Submitted': return 'bg-blue-100 text-blue-800';
            case 'Under Review': return 'bg-yellow-100 text-yellow-800';
            case 'Assigned': return 'bg-purple-100 text-purple-800';
            case 'Under Investigation': return 'bg-orange-100 text-orange-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">Track Your Complaint</h1>
                <p className="mt-2 text-gray-600">Enter your complaint reference ID to check the real-time status.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. CR-2026-000001"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:bg-primary-400">
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-center max-w-xl mx-auto">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {complaint && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Complaint Details: {complaint.complaintId}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                        </span>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Incident Information</h3>
                            <div className="space-y-2">
                                <p><strong className="text-gray-700">Crime Type:</strong> {complaint.crimeType}</p>
                                <p><strong className="text-gray-700">Date:</strong> {new Date(complaint.incidentDate).toLocaleDateString()}</p>
                                <p><strong className="text-gray-700">Location:</strong> {complaint.location}, {complaint.city}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Investigation Status</h3>
                            <div className="space-y-2">
                                <p><strong className="text-gray-700">Assigned Officer:</strong> {complaint.assignedOfficer ? complaint.assignedOfficer.name : 'Not assigned yet'}</p>
                                {complaint.policeStation && (
                                    <p><strong className="text-gray-700">Selected Station:</strong> {complaint.policeStation}</p>
                                )}
                                {complaint.assignedOfficer && (
                                    <p><strong className="text-gray-700">Officer Station:</strong> {complaint.assignedOfficer.policeStation}</p>
                                )}
                                <p><strong className="text-gray-700">Last Updated:</strong> {new Date(complaint.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Status Timeline</h3>
                        
                        <div className="relative border-l-2 border-gray-200 ml-3">
                            {history.map((record, index) => (
                                <div key={index} className="mb-8 ml-6 relative">
                                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-9 ring-4 ring-white ${getStatusColor(record.newStatus)}`}>
                                        <CheckCircle size={14} />
                                    </span>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900">{record.newStatus}</h4>
                                        <time className="text-xs text-gray-500">{new Date(record.createdAt).toLocaleString()}</time>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border mt-2">
                                        {record.remarks || 'Status updated'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackComplaint;
