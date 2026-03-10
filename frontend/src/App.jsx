import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/" />;
    return children;
}

function App() {
    const { toasts } = useCart();

    return (
        <>
            <Navbar />

            {/* Toasts */}
            {toasts.length > 0 && (
                <div className="toast-container">
                    {toasts.map(t => (
                        <div key={t.id} className={`toast toast-${t.type}`}>
                            {t.message}
                        </div>
                    ))}
                </div>
            )}

            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/productos/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route path="/carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/pedidos" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/pedidos/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/productos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/pedidos" element={<AdminRoute><AdminOrders /></AdminRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <Footer />
            <WhatsAppButton />
        </>
    );
}

export default App;
