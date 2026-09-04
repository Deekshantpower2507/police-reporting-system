import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';

const AdminOfficers = () => {
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [adding, setAdding] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', 
        officerId: '', department: '', policeStation: '', city: ''
    });

    useEffect(() => {
        fetchOfficers();
    }, []);

    const fetchOfficers = async () => {
        try {
            const res = await axios.get('/api/admin/officers');
            setOfficers(res.data);
        } catch (error) {
            console.error("Error fetching officers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            await axios.post('/api/admin/officers', formData);
            setShowAddModal(false);
            setFormData({
                name: '', email: '', phone: '', password: '', 
                officerId: '', department: '', policeStation: '', city: ''
            });
            fetchOfficers();
        } catch (error) {
            console.error("Error adding officer", error);
            alert(error.response?.data?.message || "Failed to add officer");
        } finally {
            setAdding(false);
        }
    };

    const filteredOfficers = officers.filter(o => 
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.officerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.policeStation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Police Officers</h1>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center shadow-md"
                >
                    <Plus size={18} className="mr-1" /> Add Officer
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by name, ID, or station..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge/ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOfficers.map(o => (
                                <tr key={o._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{o.officerId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{o.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{o.email}</div>
                                        <div>{o.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.policeStation}, {o.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${o.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {o.status || 'active'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Officer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleAddSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-2 mb-4" id="modal-title">
                                        Add New Police Officer
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Officer ID / Badge No</label>
                                            <input type="text" name="officerId" required value={formData.officerId} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                            <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Password (Default)</label>
                                            <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <input type="text" name="department" required value={formData.department} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Police Station</label>
                                            <input type="text" name="policeStation" required value={formData.policeStation} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">City</label>
                                            <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" disabled={adding} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-primary-400">
                                        {adding ? 'Adding...' : 'Add Officer'}
                                    </button>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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

export default AdminOfficers;
