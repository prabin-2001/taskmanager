import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);

    // ✅ DARK MODE STATE
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    // ✅ Apply dark class when darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const toggleDark = () => {
        const newTheme = darkMode ? "light" : "dark";
        setDarkMode(!darkMode);
        localStorage.setItem("theme", newTheme);
    };

    // ✅ AUTH LOGIC
    useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        setLoadingUser(false);
        return;
    }

    fetch("http://127.0.0.1:8000/api/me/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
    })
    .then(data => {
        setIsAuthenticated(true);
        setUsername(data.username);
    })
    .catch(() => {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
    })
    .finally(() => {
        setLoadingUser(false);
    });

}, []);

    const login = (token) => {
        localStorage.setItem('access_token', token);
        setIsAuthenticated(true);

        fetch("http://127.0.0.1:8000/api/me/", {
                headers: {
                Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                setUsername(data.username);
            });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    onLogout={logout}
                    darkMode={darkMode}
                    toggleDark={toggleDark}
                    username={username}
                />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route
                            path="/login"
                            element={!isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/register"
                            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/dashboard"
                            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;