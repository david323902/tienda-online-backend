import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const initials = (user.nombre || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header fade-in">
                    <div className="profile-avatar">{initials}</div>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-xs)' }}>
                            {user.nombre}
                        </h1>
                        <span className={`badge ${user.rol === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                            {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                    </div>
                </div>

                <div className="profile-details fade-in-up">
                    <div className="profile-field">
                        <div className="field-label">Email</div>
                        <div className="field-value">{user.email}</div>
                    </div>
                    <div className="profile-field">
                        <div className="field-label">Teléfono</div>
                        <div className="field-value">{user.telefono || 'No registrado'}</div>
                    </div>
                    <div className="profile-field">
                        <div className="field-label">Rol</div>
                        <div className="field-value" style={{ textTransform: 'capitalize' }}>{user.rol}</div>
                    </div>
                    <div className="profile-field">
                        <div className="field-label">Estado</div>
                        <div className="field-value">
                            <span className={`badge ${user.activo ? 'badge-success' : 'badge-error'}`}>
                                {user.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                    <Link to="/pedidos" className="btn btn-secondary">
                        📦 Mis Pedidos
                    </Link>
                    <Link to="/carrito" className="btn btn-secondary">
                        🛒 Mi Carrito
                    </Link>
                    <button className="btn btn-danger" onClick={logout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
