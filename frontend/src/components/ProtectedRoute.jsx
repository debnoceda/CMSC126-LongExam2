import { Navigate } from "react-router-dom";
import { jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Setup from './Setup';

function ProtectedRoute({ children }) {
    const { user, loading, error, fetchUserData } = useContext(UserContext);
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            await auth();
            setIsLoading(false);
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            fetchUserData();
        }
    }, [isAuthorized]);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh', { refresh: refreshToken });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decodedToken = jwtDecode(token);
        const tokenExpiration = decodedToken.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    const requiresSetup = !user?.monthly_budget;
    if (requiresSetup) {
        return <Setup />;
    }

    return children;
}

export default ProtectedRoute;