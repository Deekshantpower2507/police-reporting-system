import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PoliceInvestigation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`/api/complaints/${id}`);
                setComplaint(res.data.complaint);
                setStatus(res.data.complaint.status);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await axios.put(`/api/complaints/${id}/status`, { status, remarks });
            navigate(`/complaint/${id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!complaint) return <div className="text-center py-20">Complaint not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Investigation: {complaint.complaintId}</h1>
                <Link to={`/complaint/${complaint._id}`} className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">View Full Details</Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-bold mb-4">Quick Reference</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong className="text-gray-600">Crime Type:</strong> {complaint.crimeType}</p>
                    <p><strong className="text-gray-600">Priority:</strong> {complaint.priority}</p>
                    <p><strong className="text-gray-600">Location:</strong> {complaint.location}, {complaint.city}</p>
                    <p><strong className="text-gray-600">Date Reported:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4">Update Investigation Progress</h2>
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="Assigned">Assigned</option>
                            <option value="Under Investigation">Under Investigation</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Investigation Remarks / Officer Notes</label>
                        <textarea
                            required
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows="5"
                            placeholder="Detail your findings, actions taken, or reason for status change. This will be recorded in the official timeline."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link to={`/complaint/${id}`} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</Link>
                        <button type="submit" disabled={updating || !remarks} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-primary-400">
                            {updating ? 'Updating...' : 'Save & Update Official Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PoliceInvestigation;
