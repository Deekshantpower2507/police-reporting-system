import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/admin/analytics');
                setAnalytics(res.data);
            } catch (err) {
                setError('Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Format data for charts
    const pieData = analytics.statusDistribution.map(item => ({
        name: item._id,
        value: item.count
    }));

    const barData = analytics.crimeTypes.map(item => ({
        name: item._id,
        count: item.count
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <FileText size={24}/>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Complaints</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.stats.totalComplaints}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-3">
                        <AlertCircle size={24}/>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.stats.pendingComplaints}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                        <AlertCircle size={24}/>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Active Investigation</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.stats.activeComplaints}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle size={24}/>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.stats.resolvedComplaints}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-3">
                        <Users size={24}/>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Total Citizens</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.stats.totalUsers}</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Link to="/admin/complaints" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:bg-gray-50 transition-colors font-medium text-red-600">Manage Complaints</Link>
                <Link to="/admin/users" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:bg-gray-50 transition-colors font-medium text-red-600">Manage Users</Link>
                <Link to="/admin/officers" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:bg-gray-50 transition-colors font-medium text-red-600">Manage Officers</Link>
                <Link to="/admin/bulletins" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:bg-gray-50 transition-colors font-medium flex items-center justify-center text-red-600"><AlertCircle size={16} className="mr-2"/> Manage Bulletins</Link>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Complaints by Status</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Complaints by Crime Type</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
