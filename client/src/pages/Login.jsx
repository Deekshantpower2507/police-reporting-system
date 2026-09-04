import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Key, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        setLocalError('');
        try {
            const data = await login(email, password);
            if (data) {
                if (data.role === 'admin') navigate('/admin/dashboard');
                else if (data.role === 'police') navigate('/police/dashboard');
                else navigate('/citizen/dashboard');
            }
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Authentication Failed');
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden px-4">
            {/* Dark abstract bg elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bento-card p-10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                        <Key className="h-8 w-8 text-primary-500 drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]" />
                    </div>
                    <h2 className="mt-6 text-3xl font-black text-white tracking-tight uppercase">
                        Authenticate
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Enter your credentials to access the system.
                    </p>
                </div>
                
                {localError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center">
                        <span className="mr-2">ACCESS DENIED:</span> {localError}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full pl-12 pr-3 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono text-sm"
                                placeholder="USER_EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full pl-12 pr-3 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono text-sm"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={localLoading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent font-black rounded-xl text-black bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-primary-500 transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] uppercase tracking-wider disabled:opacity-50"
                        >
                            {localLoading ? 'PROCESSING...' : (
                                <span className="flex items-center">
                                    LOGIN <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-zinc-500">
                        NOT REGISTERED?{' '}
                        <Link to="/register" className="font-bold text-primary-500 hover:text-primary-400 hover:underline">
                            CREATE ACCOUNT
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800/50">
                    <p className="text-xs text-zinc-600 text-center mb-4 uppercase font-bold tracking-widest">Demo Access</p>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 text-center text-zinc-400">
                            <span className="text-primary-500">ADMIN</span><br/>admin@gov.in<br/>password123
                        </div>
                        <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 text-center text-zinc-400">
                            <span className="text-primary-500">USER</span><br/>rahul@example.com<br/>password123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
