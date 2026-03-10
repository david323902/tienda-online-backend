import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor - add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ---- Auth ----
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// ---- Productos ----
export const productsAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    uploadImage: (id, formData) => api.post(`/products/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// ---- Carrito ----
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
    updateItem: (itemId, cantidad) => api.put(`/cart/item/${itemId}`, { cantidad }),
    removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
    clearCart: () => api.delete('/cart/clear'),
    checkStock: () => api.get('/cart/check-stock'),
    getSummary: () => api.get('/cart/summary'),
};

// ---- Pedidos ----
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getUserOrders: () => api.get('/orders'),
    getDetail: (id) => api.get(`/orders/${id}`),
    cancel: (id, motivo) => api.put(`/orders/${id}/cancel`, { motivo }),
    getStats: () => api.get('/orders/stats'),
    updateShipping: (id, data) => api.put(`/orders/${id}/shipping`, data),
    // Admin
    getAllOrders: () => api.get('/orders/admin/all'),
    updateStatus: (id, estado, notas) => api.put(`/orders/admin/${id}/status`, { estado, notas }),
};

// ---- PayPal ----
export const paypalAPI = {
    createOrder: (orderId, returnUrl, cancelUrl) =>
        api.post('/paypal/create-order', { orderId, returnUrl, cancelUrl }),
    captureOrder: (orderId) => api.post('/paypal/capture-order', { orderId }),
    getOrderDetails: (orderId) => api.get(`/paypal/order/${orderId}`),
    getHistory: () => api.get('/paypal/history'),
};

// ---- WhatsApp ----
export const whatsappAPI = {
    getContactInfo: () => api.get('/whatsapp/contact-info'),
};
// ---- Stripe ----
export const stripeAPI = {
    createPaymentIntent: (data) => api.post('/stripe/create-payment-intent', data),
    createCheckoutSession: (data) => api.post('/stripe/create-checkout-session', data),
};

export default api;
