import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(); // eslint-disable-line no-unused-vars

// eslint-disable-next-line react-refresh/only-export-components
const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
    const isAuthenticated = !!user;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}