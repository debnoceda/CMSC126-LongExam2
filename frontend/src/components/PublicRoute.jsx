import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function PublicRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const tokenExpiration = decodedToken.exp;
                const now = Date.now() / 1000;

                setIsAuthorized(tokenExpiration > now);
            } catch (error) {
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute; 