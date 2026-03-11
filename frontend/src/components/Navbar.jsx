import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-logo">
                    <span className="gradient-text">InterConectados</span>Web.es
                </Link>

                <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <a href="/#inicio" className={isActive('/#inicio')} onClick={() => setMenuOpen(false)}>Inicio</a>
<<<<<<< HEAD
=======
                    <Link to="/productos" className={isActive('/productos')} onClick={() => setMenuOpen(false)}>Tienda</Link>
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
                    <a href="/#servicios" className={isActive('/#servicios')} onClick={() => setMenuOpen(false)}>Servicios</a>
                    <a href="/#esencia" className={isActive('/#esencia')} onClick={() => setMenuOpen(false)}>Nuestra Esencia</a>
                    <a href="/#proyectos" className={isActive('/#proyectos')} onClick={() => setMenuOpen(false)}>Proyectos</a>
                    <a href="/#metodologia" className={isActive('/#metodologia')} onClick={() => setMenuOpen(false)}>Proceso</a>
                    <a href="/#testimonios" className={isActive('/#testimonios')} onClick={() => setMenuOpen(false)}>Opiniones</a>
                    <a href="/#contacto" className={isActive('/#contacto')} onClick={() => setMenuOpen(false)}>Contacto</a>

                    {isAdmin && (
                        <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>
                            Admin
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <Link to="/carrito" className="btn btn-ghost cart-badge" title="Carrito">
                        <span style={{ fontSize: '1.2rem' }}>🛒</span>
                        {itemCount > 0 && <span className="count">{itemCount}</span>}
                    </Link>

                    {isAuthenticated ? (
                        <div className="user-actions">
                            <Link to="/pedidos" className="btn btn-ghost" title="Mis Pedidos">
                                <span style={{ fontSize: '1.2rem' }}>📦</span>
                            </Link>
                            <Link to="/perfil" className="btn btn-ghost" title={user?.nombre}>
                                <span style={{ fontSize: '1.2rem' }}>👤</span>
                            </Link>
                            <button className="btn btn-ghost" onClick={logout} title="Cerrar sesión">
                                <span style={{ fontSize: '1.2rem' }}>⏻</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
