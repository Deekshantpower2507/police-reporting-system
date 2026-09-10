import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, AlertCircle, CheckCircle, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leafet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom Police Icon
const policeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2933/2933221.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// Helper component to center map
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const TrackComplaint = () => {
    const [trackingId, setTrackingId] = useState('');
    const [complaint, setComplaint] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Map States
    const [incidentLocation, setIncidentLocation] = useState([28.6139, 77.2090]);
    const [policeLocation, setPoliceLocation] = useState([28.6200, 77.2200]);
    const [eta, setEta] = useState(15);

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
            
            // Generate deterministic mock coordinates based on string to prevent jumping around
            const hash = trackingId.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
            const latOff = (hash % 100) / 10000;
            const lngOff = ((hash >> 2) % 100) / 10000;
            
            const baseLat = 28.6139 + latOff;
            const baseLng = 77.2090 + lngOff;
            
            setIncidentLocation([baseLat, baseLng]);
            
            // Start police slightly far away
            setPoliceLocation([baseLat + 0.02, baseLng + 0.02]);
            setEta(Math.floor(Math.random() * 10) + 5);

        } catch (err) {
            setError(err.response?.data?.message || 'Complaint not found');
        } finally {
            setLoading(false);
        }
    };

    // Simulate Police Movement
    useEffect(() => {
        if (!complaint) return;
        
        // Only move if assigned or investigating
        if (complaint.status !== 'Assigned' && complaint.status !== 'Under Investigation') return;

        const interval = setInterval(() => {
            setPoliceLocation(prev => {
                const latDiff = incidentLocation[0] - prev[0];
                const lngDiff = incidentLocation[1] - prev[1];
                
                // If very close, stop moving
                if (Math.abs(latDiff) < 0.0005 && Math.abs(lngDiff) < 0.0005) {
                    setEta(0);
                    return prev;
                }

                setEta(prevEta => Math.max(1, prevEta - 1));

                return [
                    prev[0] + latDiff * 0.1, // Move 10% closer each tick
                    prev[1] + lngDiff * 0.1
                ];
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [complaint, incidentLocation]);

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

                    {/* LIVE TRACKING MAP UI */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-bold text-gray-900 flex items-center">
                                <Navigation className="mr-2 text-primary-600" size={20}/>
                                Live Geographical Tracking
                            </h3>
                            {(complaint.status === 'Assigned' || complaint.status === 'Under Investigation') && (
                                <div className="text-sm font-semibold text-red-600 animate-pulse bg-red-100 px-3 py-1 rounded-full">
                                    {eta > 0 ? `Police ETA: ~${eta} mins` : 'Police on scene'}
                                </div>
                            )}
                        </div>
                        <div className="h-64 w-full rounded-xl overflow-hidden shadow-inner border border-gray-300">
                            <MapContainer center={incidentLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                <ChangeView center={incidentLocation} />
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={incidentLocation}>
                                    <Popup>
                                        <strong>Incident Location</strong><br/>{complaint.location}
                                    </Popup>
                                </Marker>
                                
                                {(complaint.status === 'Assigned' || complaint.status === 'Under Investigation' || complaint.status === 'Resolved') && (
                                    <Marker position={policeLocation} icon={policeIcon}>
                                        <Popup>
                                            <strong>Assigned Unit</strong><br/>{complaint.assignedOfficer?.name || 'Police Patrol'}
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
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
