import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone, MapPin, Building, Hash, ArrowRight, ScanFace } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', 
        confirmPassword: '', address: '', city: '', state: '', pincode: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('PASSWORDS_MISMATCH');
        }

        setLoading(true);
        try {
            await axios.post('/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'REGISTRATION_FAILED');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "appearance-none block w-full pl-12 pr-3 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono text-sm";
    const iconWrapperClasses = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none";
    const iconClasses = "h-5 w-5 text-zinc-500 group-focus-within:text-primary-500 transition-colors";

    return (
        <div className="min-h-screen bg-[#09090b] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
            {/* Dark abstract bg elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-float"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-float" style={{animationDelay: '3s'}}></div>

            <div className="max-w-4xl w-full bento-card overflow-hidden relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">
                {/* Left Side: Branding */}
                <div className="md:w-1/3 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMjA0LDAuMDUpIi8+PC9zdmc+')] opacity-50"></div>
                    
                    <div className="relative z-10">
                        <ScanFace className="h-12 w-12 text-primary-500 mb-6 drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]" />
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                            INITIALIZE <br/><span className="text-primary-500">USER_PROFILE</span>
                        </h2>
                        <p className="mt-4 text-zinc-400 text-sm">Join the grid. Report securely. Track investigations in real-time.</p>
                    </div>

                    <div className="relative z-10 mt-12 md:mt-0">
                        <div className="p-4 bg-black/50 rounded-xl border border-zinc-800 backdrop-blur-sm">
                            <p className="text-xs text-zinc-500 font-mono mb-2">STATUS:</p>
                            <div className="flex items-center text-sm font-bold text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                SECURE CONNECTION
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Side: Form */}
                <div className="md:w-2/3 p-8 md:p-10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 font-mono flex items-center">
                            <span className="mr-2">ERR:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Identity</h3>
                                
                                <div className="relative group">
                                    <div className={iconWrapperClasses}><User className={iconClasses} /></div>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClasses} placeholder="FULL_NAME" />
                                </div>
                                
                                <div className="relative group">
                                    <div className={iconWrapperClasses}><Mail className={iconClasses} /></div>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClasses} placeholder="EMAIL_ADDRESS" />
                                </div>

                                <div className="relative group">
                                    <div className={iconWrapperClasses}><Phone className={iconClasses} /></div>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="MOBILE_NUM" />
                                </div>

                                <div className="relative group">
                                    <div className={iconWrapperClasses}><Lock className={iconClasses} /></div>
                                    <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className={inputClasses} placeholder="PASSWORD" />
                                </div>

                                <div className="relative group">
                                    <div className={iconWrapperClasses}><Lock className={iconClasses} /></div>
                                    <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} className={inputClasses} placeholder="CONFIRM_PASS" />
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Location Data</h3>
                                
                                <div className="relative group">
                                    <div className={iconWrapperClasses}><MapPin className={iconClasses} /></div>
                                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className={inputClasses} placeholder="STREET_ADDRESS" />
                                </div>

                                <div className="relative group">
                                    <div className={iconWrapperClasses}><Building className={iconClasses} /></div>
                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className={inputClasses} placeholder="CITY" />
                                </div>

                                <div className="relative group">
                                    <div className={iconWrapperClasses}><MapPin className={iconClasses} /></div>
                                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className={inputClasses} placeholder="STATE" />
                                </div>

                                <div className="relative group">
                                    <div className={iconWrapperClasses}><Hash className={iconClasses} /></div>
                                    <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className={inputClasses} placeholder="ZIP_CODE" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-zinc-800">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full py-4 bg-primary-500 hover:bg-primary-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? 'PROCESSING...' : (
                                    <>REGISTER <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-zinc-500">
                            ALREADY IN THE SYSTEM?{' '}
                            <Link to="/login" className="font-bold text-primary-500 hover:text-primary-400 hover:underline">
                                LOGIN
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
