import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FileText, MapPin, Calendar, Clock, User as UserIcon, AlertTriangle, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const ComplaintDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const componentRef = useRef();
    
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Complaint_${complaint?.complaintId}`,
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`/api/complaints/${id}`);
                setComplaint(res.data.complaint);
                setHistory(res.data.history);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch details');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Under Investigation': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <div className="text-center py-20">Loading details...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!complaint) return <div className="text-center py-20">Complaint not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    {user.role === 'citizen' && (
                        <Link to="/citizen/complaints" className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">Back to List</Link>
                    )}
                    {user.role === 'admin' && (
                        <Link to="/admin/complaints" className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">Back to List</Link>
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        <Printer size={16} /> Download Official E-FIR
                    </button>
                    {(user.role === 'police' || user.role === 'admin') && (
                        <Link to={`/police/investigation/${complaint._id}`} className="bg-primary-600 text-white px-4 py-2 rounded text-sm hover:bg-primary-700">Update Investigation</Link>
                    )}
                </div>
            </div>

            <div ref={componentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 print:p-8 bg-white print:text-black print:block relative">
                
                {/* Official FIR Print Header - Only visible when printing */}
                <div className="hidden print:block col-span-1 lg:col-span-3 text-center mb-8 border-b-2 border-black pb-6 relative">
                    <div className="absolute top-0 left-0 w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">OFFICIAL SEAL</span>
                    </div>
                    <div className="absolute top-0 right-0 border border-black p-2">
                        <div className="w-16 h-16 bg-gray-200">
                            {/* Mock QR Code space */}
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=FIR-${complaint.complaintId}`} alt="QR Code" className="w-full h-full opacity-80" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-black uppercase tracking-widest text-black">First Information Report (FIR)</h1>
                    <h2 className="text-xl font-bold uppercase mt-2">Madhya Pradesh Police Department</h2>
                    <p className="font-mono text-sm mt-1">Gwalior Police District - Jurisdiction: {complaint.policeStation || 'HQ'}</p>
                    <p className="font-mono text-xs mt-1 font-bold">DOCUMENT HASH: {btoa(complaint.complaintId + complaint.createdAt).substring(0, 32)}</p>
                </div>

                <div className="col-span-1 lg:col-span-3 mb-2 print:block">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        Complaint ID: {complaint.complaintId}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border print:border-black print:text-black ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1 print:text-black">Submitted on {new Date(complaint.createdAt).toLocaleString()}</p>
                    <hr className="mt-4 border-gray-200 print:border-black" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {/* Incident Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20}/> Incident Details
                        </h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <span className="block text-gray-500 font-medium mb-1">Crime Type</span>
                                <span className="font-semibold text-gray-900">{complaint.crimeType}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 font-medium mb-1 flex items-center gap-1"><Calendar size={14}/> Date & Time</span>
                                <span className="font-semibold text-gray-900">{new Date(complaint.incidentDate).toLocaleDateString()} {complaint.incidentTime}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-gray-500 font-medium mb-1 flex items-center gap-1"><MapPin size={14}/> Location</span>
                                <span className="font-semibold text-gray-900">{complaint.location}, {complaint.city}, {complaint.state}</span>
                            </div>
                            <div className="col-span-2 mt-2">
                                <span className="block text-gray-500 font-medium mb-1 flex items-center gap-1"><FileText size={14}/> Description</span>
                                <div className="bg-gray-50 p-4 rounded border text-gray-800 whitespace-pre-wrap">
                                    {complaint.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parties Involved */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                                <UserIcon className="text-primary-500" size={20}/> Victim Information
                            </h2>
                            {complaint.victimInformation?.name ? (
                                <ul className="space-y-2 text-sm">
                                    <li><span className="text-gray-500">Name:</span> <span className="text-black font-semibold">{complaint.victimInformation.name}</span></li>
                                    <li><span className="text-gray-500">Phone:</span> <span className="text-black font-semibold">{complaint.victimInformation.phone}</span></li>
                                    <li><span className="text-gray-500">Email:</span> <span className="text-black font-semibold">{complaint.victimInformation.email}</span></li>
                                    <li><span className="text-gray-500">Address:</span> <span className="text-black font-semibold">{complaint.victimInformation.address}</span></li>
                                    {complaint.victimInformation.onBehalf && (
                                        <li className="text-orange-600 bg-orange-50 px-2 py-1 rounded mt-2 inline-block text-xs font-bold">Reported on behalf</li>
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Same as reporter.</p>
                            )}
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                                <UserIcon className="text-gray-500" size={20}/> Suspect Information
                            </h2>
                            {complaint.suspectInformation?.name || complaint.suspectInformation?.description || complaint.suspectInformation?.contactInformation ? (
                                <ul className="space-y-2 text-sm">
                                    <li><span className="text-gray-500">Name:</span> <span className="text-black font-semibold">{complaint.suspectInformation.name || 'Unknown'}</span></li>
                                    <li><span className="text-gray-500">Description:</span> <span className="text-black font-semibold">{complaint.suspectInformation.description || 'N/A'}</span></li>
                                    <li><span className="text-gray-500">Contact:</span> <span className="text-black font-semibold">{complaint.suspectInformation.contactInformation || 'N/A'}</span></li>
                                    {complaint.suspectInformation.aiSketchUrl && (
                                        <li className="pt-4">
                                            <span className="text-gray-500 block mb-2 font-bold uppercase text-xs">AI Generated Sketch:</span>
                                            <div className="border border-gray-300 rounded overflow-hidden max-w-[250px]">
                                                <img src={complaint.suspectInformation.aiSketchUrl} alt="AI Suspect Sketch" className="w-full h-auto" />
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm italic">No suspect information provided.</p>
                            )}
                        </div>
                    </div>

                    {/* Evidence */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4">Evidence & Attachments</h2>
                        {complaint.evidence && complaint.evidence.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {complaint.evidence.map((file, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText size={16} className="text-blue-500 flex-shrink-0" />
                                            <span className="truncate">{file.filename}</span>
                                        </div>
                                        {/* Assuming server is running on localhost:5000 */}
                                        <a href={`http://localhost:5000${file.path}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex-shrink-0 ml-2">
                                            View
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm italic">No evidence attached.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Official Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4">Investigation</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-gray-500">Priority</span>
                                <span className={`font-semibold ${complaint.priority === 'High' || complaint.priority === 'Critical' ? 'text-red-600' : 'text-gray-900'}`}>
                                    {complaint.priority}
                                </span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Assigned Officer</span>
                                <span className="font-semibold text-gray-900">{complaint.assignedOfficer ? complaint.assignedOfficer.name : 'Unassigned'}</span>
                            </div>
                            {complaint.policeStation && (
                                <div>
                                    <span className="block text-gray-500">Selected Police Station</span>
                                    <span className="font-semibold text-gray-900">{complaint.policeStation}</span>
                                </div>
                            )}
                            {complaint.assignedOfficer && complaint.assignedOfficer.policeStation && complaint.assignedOfficer.policeStation !== complaint.policeStation && (
                                <div>
                                    <span className="block text-gray-500">Officer's Station</span>
                                    <span className="font-semibold text-gray-900">{complaint.assignedOfficer.policeStation}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                            <Clock size={20}/> Status History
                        </h2>
                        <div className="relative border-l-2 border-gray-200 ml-2 space-y-6 mt-4">
                            {history.map((record, index) => (
                                <div key={index} className="ml-5 relative">
                                    <span className={`absolute w-3 h-3 rounded-full -left-[27px] top-1 ring-4 ring-white ${getStatusColor(record.newStatus)}`}></span>
                                    <p className="font-semibold text-sm text-gray-900">{record.newStatus}</p>
                                    <p className="text-xs text-gray-500 mb-1">{new Date(record.createdAt).toLocaleString()} by {record.updatedBy?.name}</p>
                                    {record.remarks && (
                                        <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border mt-1">{record.remarks}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Print Only Footer / Signatures */}
                <div className="hidden print:flex col-span-1 lg:col-span-3 mt-16 justify-between border-t-2 border-black pt-8">
                    <div className="text-center">
                        <div className="w-40 border-b border-black mb-2 mx-auto"></div>
                        <p className="font-bold">Signature of Complainant</p>
                        <p className="text-xs">{complaint.victimInformation?.name || 'Digitally Signed'}</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-40 border-b border-black mb-2 mx-auto font-signature text-xl">{complaint.assignedOfficer?.name || ''}</div>
                        <p className="font-bold">Investigating Officer</p>
                        <p className="text-xs">{complaint.policeStation || 'N.C.R.S.'}</p>
                    </div>

                    <div className="text-center">
                        <div className="w-40 border-b border-black mb-2 mx-auto"></div>
                        <p className="font-bold">Station House Officer (SHO)</p>
                        <p className="text-xs">Stamp / Seal</p>
                    </div>
                </div>
                
                {/* IPC Disclaimer for Print */}
                <div className="hidden print:block col-span-1 lg:col-span-3 mt-8 text-[10px] text-justify text-gray-700">
                    <p><strong>LEGAL DISCLAIMER:</strong> This is a digitally generated First Information Report (E-FIR) recorded under the National Cybercrime Reporting System (N.C.R.S.). Any tampering, forgery, or unauthorized reproduction of this document is a punishable offense under the Information Technology Act, 2000 and relevant sections of the Bharatiya Nyaya Sanhita (BNS). The complainant has accepted the legal oath under IPC Section 182 at the time of submission.</p>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
