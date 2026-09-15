import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Menu, X, User, LogOut, AlertCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'police') return '/police/dashboard';
        return '/citizen/dashboard';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed w-full z-50 px-4 sm:px-6 top-6 flex justify-center pointer-events-none">
            <nav className={`pointer-events-auto transition-all duration-300 w-full max-w-5xl rounded-full border ${scrolled ? 'glass-dark border-zinc-700/50 shadow-2xl py-3' : 'glass border-transparent py-4'}`}>
                <div className="px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="p-2 bg-primary-500 rounded-full mr-3 shadow-[0_0_15px_rgba(0,255,204,0.5)] group-hover:shadow-[0_0_25px_rgba(0,255,204,0.8)] transition-all">
                                <Shield className="h-5 w-5 text-black" />
                            </div>
                            <span className="font-bold text-xl tracking-tighter text-white">
                                N.C.R.<span className="text-primary-500">S.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                <Link to={getDashboardLink()} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive(getDashboardLink()) ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                                    Dash
                                </Link>
                                
                                <Link to="/safety-map" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/safety-map') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                                    Safety Map
                                </Link>

                                {user.role === 'citizen' && (
                                    <>
                                        <Link to="/citizen/report" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/citizen/report') ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                                            Report
                                        </Link>
                                        <Link to="/track" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/track') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                                            Track
                                        </Link>
                                    </>
                                )}
                                
                                <div className="ml-4 flex items-center border-l pl-4 border-zinc-700">
                                    <div className="flex items-center mr-3 text-sm font-medium text-zinc-300 bg-zinc-800/80 px-4 py-1.5 rounded-full border border-zinc-700">
                                        <User size={14} className="mr-2 text-primary-500" />
                                        {user.name} <span className="ml-2 text-[10px] px-2 py-0.5 bg-primary-500/20 text-primary-500 rounded-full uppercase tracking-wider">{user.role}</span>
                                    </div>
                                    <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/bulletins" className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center group">
                                    <AlertCircle size={16} className="mr-2 text-primary-500 group-hover:animate-pulse" /> Bulletins
                                </Link>
                                <Link to="/safety-map" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/safety-map') ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}>
                                    Safety Map
                                </Link>
                                <Link to="/login" className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="ml-2 px-5 py-2 bg-primary-500 text-black rounded-full text-sm font-bold shadow-[0_0_15px_rgba(0,255,204,0.3)] hover:shadow-[0_0_20px_rgba(0,255,204,0.6)] hover:-translate-y-0.5 transition-all">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="p-2 text-zinc-300 hover:text-white"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-zinc-700/50 mt-3 pt-3 px-6 pb-2">
                        {user ? (
                            <div className="flex flex-col space-y-2">
                                <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg">Dash</Link>
                                <Link to="/safety-map" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg">Safety Map</Link>
                                {user.role === 'citizen' && (
                                    <>
                                        <Link to="/citizen/report" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-primary-500 font-semibold bg-primary-500/10 rounded-lg">Report Incident</Link>
                                        <Link to="/track" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg">Track Status</Link>
                                    </>
                                )}
                                <button onClick={handleLogout} className="px-4 py-2 text-left text-red-400 hover:bg-red-400/10 rounded-lg">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link to="/bulletins" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg">Bulletins</Link>
                                <Link to="/safety-map" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg">Safety Map</Link>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg">Login</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-black font-bold bg-primary-500 rounded-lg text-center">Sign Up</Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
