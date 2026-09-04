import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, AlertCircle, X, Check, Image as ImageIcon } from 'lucide-react';

const ManageBulletins = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Missing',
        title: '',
        description: '',
        contactInfo: 'Contact Local Police Station or dial 100.'
    });
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchBulletins = async () => {
        try {
            const res = await axios.get('/api/bulletins/all', getAuthHeader());
            setBulletins(res.data);
        } catch (error) {
            console.error("Error fetching bulletins", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBulletins();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) data.append('image', image);

            await axios.post('/api/bulletins', data, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setShowModal(false);
            setFormData({ type: 'Missing', title: '', description: '', contactInfo: 'Contact Local Police Station or dial 100.' });
            setImage(null);
            fetchBulletins();
        } catch (error) {
            console.error(error);
            alert("Error creating bulletin");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Resolved' : 'Active';
            await axios.put(`/api/bulletins/${id}/status`, { status: newStatus }, getAuthHeader());
            fetchBulletins();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const deleteBulletin = async (id) => {
        if (!window.confirm("Are you sure you want to delete this bulletin?")) return;
        try {
            await axios.delete(`/api/bulletins/${id}`, getAuthHeader());
            fetchBulletins();
        } catch (error) {
            alert("Failed to delete bulletin");
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Bulletins</h1>
                <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center">
                    <Plus size={18} className="mr-2" /> New Bulletin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bulletins.map(b => (
                            <tr key={b._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${b.type === 'Wanted' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {b.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {b.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button 
                                        onClick={() => toggleStatus(b._id, b.status)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                    >
                                        {b.status}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {b.admin?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => deleteBulletin(b._id)} className="text-red-600 hover:text-red-900 ml-4">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bulletins.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No bulletins found. Create one!</div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-5 border-b pb-2">
                                        <h3 className="text-xl font-bold text-gray-900" id="modal-title">Create New Bulletin</h3>
                                        <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500"><X size={20}/></button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500">
                                                <option value="Missing">Missing Person</option>
                                                <option value="Wanted">Wanted Suspect</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title (Name/Identifier)</label>
                                            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. John Doe - Last seen at Main St." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Details</label>
                                            <textarea name="description" required rows="4" value={formData.description} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Physical description, last known clothing, potential danger, etc."></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                                            <input type="text" name="contactInfo" required value={formData.contactInfo} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{image ? image.name : 'PNG, JPG up to 5MB'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                                    <button type="submit" disabled={submitting} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                        {submitting ? 'Publishing...' : 'Publish Bulletin'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBulletins;
