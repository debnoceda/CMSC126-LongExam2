import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function PublicRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const tokenExpiration = decodedToken.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? <Navigate to="/home" /> : children;
}

export default PublicRoute; 