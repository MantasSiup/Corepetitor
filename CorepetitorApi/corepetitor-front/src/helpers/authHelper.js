import { jwtDecode } from 'jwt-decode';

export const getUserRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null; // "Student", "Tutor", "Admin"
    } catch (e) {
        console.error('Invalid token', e);
        return null;
    }
};

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.nameid || null; // This is the userId from your backend claim
    } catch (e) {
        console.error('Invalid token', e);
        return null;
    }
};
