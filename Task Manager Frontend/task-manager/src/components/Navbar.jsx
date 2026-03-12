import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare, Sun, Moon, Shield } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ isAuthenticated, onLogout, darkMode, toggleDark,username }) => {
    const navigate = useNavigate();

    let isAdmin = false;
    if (isAuthenticated) {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // SimpleJWT usually includes is_staff if added to serializer, 
                // but let's assume we can detect it or badge anyway if relevant
                // For now, let's use a placeholder check or rely on backend data later
            } catch (e) {
                console.error("Token decode failed", e);
            }
        }
    }

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                    <CheckSquare size={28} />
                    <span>TaskMaster</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleDark}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Moon size={20} /> :  <Sun size={20} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                            {username?.charAt(0).toUpperCase()}
                            </span>
                            {username}
                            </div>
                            {/* Admin Badge - assuming isAdmin logic or just showing for demo if user info is fetched */}
                            <Link
                                to="/dashboard"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

