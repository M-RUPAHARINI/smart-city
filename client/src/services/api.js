import axios from 'axios';

const SERVER_URL = 'http://localhost:5000';
const API = axios.create({
    baseURL: `${SERVER_URL}/api`,
});

export { SERVER_URL };

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const fetchComplaints = () => API.get('/complaints');
export const createComplaint = (complaintData) => API.post('/complaints', complaintData);
export const updateComplaintStatus = (id, statusData) => {
    // If it's FormData, it's already structured for file upload
    return API.put(`/complaints/${id}/status`, statusData);
};

export const fetchAdminComplaints = () => API.get('/admin/complaints');
export const fetchDashboardAnalytics = () => API.get('/admin/dashboard');

export default API;
