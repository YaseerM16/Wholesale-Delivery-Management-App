import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slice/AdminSlice';
// import { useAppSelector, useAppDispatch } from '../app/hooks';
// import { logoutAdmin } from '../features/admin/adminSlice';

const AdminNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const admin = useAppSelector(state => state.admins.admin);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/admin" className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">DeliveryPro</span>
                            <span className="ml-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-md">Admin</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <NavLink to="/admin/orders" text="Orders" />
                        <NavLink to="/admin/vendors-management" text="Vendors" />
                        <NavLink to="/admin/drivers-management" text="Drivers" />
                        <NavLink to="/admin/inventory-management" text="Inventory" />
                    </nav>

                    {/* Admin Profile & Actions (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {admin && (
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{admin.name}</span>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t">
                    <MobileNavLink to="/admin/orders" text="Orders" />
                    <MobileNavLink to="/admin/vendors-management" text="Vendors" />
                    <MobileNavLink to="/admin/drivers-management" text="Drivers" />
                    <MobileNavLink to="/admin/inventory-management" text="Inventory" />

                    {admin && (
                        <div className="pt-4 border-t mt-2">
                            <div className="flex items-center px-3 py-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                    <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{admin.name}</p>
                                    <p className="text-xs text-gray-500">{admin.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, text }: { to: string; text: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
        >
            {text}
        </Link>
    );
};

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, text }: { to: string; text: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
        >
            {text}
        </Link>
    );
};

export default AdminNavbar;