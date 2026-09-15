import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, Info, MapPin } from 'lucide-react';

const HeatmapLegend = () => (
    <div className="absolute bottom-6 left-6 z-[400] bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 shadow-xl backdrop-blur-md">
        <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 border-b border-zinc-700 pb-2">Risk Legend</h4>
        <div className="space-y-2">
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-red-600 opacity-80 mr-3"></div><span className="text-zinc-300 text-sm">High Priority (Active)</span></div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-orange-500 opacity-80 mr-3"></div><span className="text-zinc-300 text-sm">Under Investigation</span></div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-green-500 opacity-80 mr-3"></div><span className="text-zinc-300 text-sm">Resolved Case</span></div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-blue-500 opacity-80 mr-3"></div><span className="text-zinc-300 text-sm">Recently Submitted</span></div>
        </div>
    </div>
);

const SafetyMap = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const res = await axios.get('/api/complaints/public/heatmap');
                // Enhance raw data with deterministic mock coordinates
                const enhanced = res.data.map(incident => {
                    const hash = incident.complaintId.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
                    const latOff = (hash % 100) / 2000;
                    const lngOff = ((hash >> 2) % 100) / 2000;
                    // Base Gwalior coordinates
                    return {
                        ...incident,
                        position: [26.2183 + latOff, 78.1828 + lngOff]
                    };
                });
                setIncidents(enhanced);
            } catch (err) {
                console.error("Failed to load map data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHeatmap();
    }, []);

    const getColorByStatus = (status) => {
        switch(status) {
            case 'Assigned': return '#dc2626'; // red
            case 'Under Investigation': return '#f97316'; // orange
            case 'Resolved': return '#22c55e'; // green
            default: return '#3b82f6'; // blue (Submitted/Under Review)
        }
    };

    return (
        <div className="min-h-screen bg-black pt-20 pb-12 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 w-full flex-grow flex flex-col">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white uppercase tracking-widest flex items-center">
                        <ShieldAlert className="mr-4 text-red-500" size={36} />
                        Public Safety Heatmap
                    </h1>
                    <p className="text-zinc-400 mt-2 font-mono">Real-time geographical analysis of reported incidents.</p>
                </div>

                <div className="flex-grow bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[600px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <div className="text-primary-500 font-mono animate-pulse flex items-center">
                                <MapPin className="animate-bounce mr-2"/> INITIALIZING GEOSPATIAL DATA...
                            </div>
                        </div>
                    ) : (
                        <>
                            <MapContainer 
                                center={[26.2183, 78.1828]} 
                                zoom={12} 
                                style={{ height: '100%', width: '100%' }}
                                className="z-0"
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                
                                {incidents.map((incident) => (
                                    <CircleMarker 
                                        key={incident.complaintId}
                                        center={incident.position}
                                        pathOptions={{ 
                                            color: getColorByStatus(incident.status), 
                                            fillColor: getColorByStatus(incident.status),
                                            fillOpacity: 0.6,
                                            weight: 0
                                        }}
                                        radius={8}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="p-1">
                                                <div className="text-xs font-mono text-zinc-500 mb-1">{incident.complaintId}</div>
                                                <div className="font-bold text-gray-900 mb-2">{incident.crimeType}</div>
                                                <div className="text-sm">
                                                    <strong>Status:</strong> <span style={{color: getColorByStatus(incident.status)}}>{incident.status}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                                                    Reported: {new Date(incident.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                            <HeatmapLegend />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SafetyMap;
