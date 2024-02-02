import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: `http://localhost:3001`,
});
// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.get('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const navigate = useNavigate();
        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = cookies.get('refreshToken');
                const response = await axios.post(url + '/auth/refresh-token', {
                    refreshToken,
                });
                console.log(response);
                const { access_Token } = response.data;

                cookies.set('accessToken', access_Token);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `${access_Token}`;
                return axios(originalRequest);
            } catch (error) {
                // Handle refresh token error or redirect to login
                throw new Error(error);
                //navigate('/login')
            }
        }

        return Promise.reject(error);
    },
);

export default api;
