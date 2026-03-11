<<<<<<< HEAD
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
=======
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';
<<<<<<< HEAD
import ToastContainer from './components/ToastContainer';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));

function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function AdminRoute() {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    // Primero verificamos si es admin, si no, a la página principal.
    // Si no es admin, tampoco puede estar autenticado como tal, así que lo mandamos a login.
    if (!isAdmin) return <Navigate to="/" />;
    if (!isAuthenticated) return <Navigate to="/login" />; // Redundante si !isAdmin ya redirige, pero es más seguro.
    return <Outlet />;
}

function App() {
    return (
        <>
            <Navbar />
            <ToastContainer />

            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Products />} />
                    <Route path="/productos/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas Protegidas para Usuarios */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/carrito" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/pedidos" element={<Orders />} />
                        <Route path="/pedidos/:id" element={<OrderDetail />} />
                        <Route path="/perfil" element={<Profile />} />
                    </Route>

                    {/* Rutas Protegidas para Administradores */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="productos" element={<AdminProducts />} />
                        <Route path="pedidos" element={<AdminOrders />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
=======

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
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b

            <Footer />
            <WhatsAppButton />
        </>
    );
}

export default App;
