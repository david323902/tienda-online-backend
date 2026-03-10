import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, productsAPI } from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            productsAPI.getAll().catch(() => ({ data: [] })),
            ordersAPI.getAllOrders().catch(() => ({ data: [] })),
            ordersAPI.getStats().catch(() => ({ data: {} }))
        ]).then(([prodRes, ordRes, statsRes]) => {
            const prods = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
            const ords = Array.isArray(ordRes.data) ? ordRes.data : ordRes.data.orders || [];
            setProducts(prods);
            setOrders(ords);
            setStats(statsRes.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.estado === 'pendiente').length;

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1 className="section-title">Panel de Administración</h1>
                        <p className="section-subtitle" style={{ marginBottom: 0 }}>Vista general del negocio</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid fade-in">
                    <div className="stat-card">
                        <div className="value gradient-text">{products.length}</div>
                        <div className="label">Productos</div>
                    </div>
                    <div className="stat-card">
                        <div className="value" style={{ color: 'var(--color-secondary)' }}>{orders.length}</div>
                        <div className="label">Pedidos Totales</div>
                    </div>
                    <div className="stat-card">
                        <div className="value" style={{ color: 'var(--color-warning)' }}>{pendingOrders}</div>
                        <div className="label">Pedidos Pendientes</div>
                    </div>
                    <div className="stat-card">
                        <div className="value" style={{ color: 'var(--color-success)' }}>
                            ${totalRevenue.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                        </div>
                        <div className="label">Ingresos Totales</div>
                    </div>
                </div>

                {/* Quick Links */}
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
                    <Link to="/admin/productos" className="btn btn-primary">
                        📦 Gestionar Productos
                    </Link>
                    <Link to="/admin/pedidos" className="btn btn-secondary">
                        📋 Gestionar Pedidos
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="card" style={{ padding: 'var(--space-xl)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-lg)' }}>
                        Pedidos Recientes
                    </h2>
                    {orders.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 10).map(order => (
                                        <tr key={order.id_pedido || order.id}>
                                            <td>#{order.id_pedido || order.id}</td>
                                            <td>{order.User?.nombre || order.usuario || '—'}</td>
                                            <td>${parseFloat(order.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
                                            <td>
                                                <span className={`status-badge status-${order.estado || 'pendiente'}`}>
                                                    {order.estado}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-muted)' }}>
                                                {order.fecha_pedido && new Date(order.fecha_pedido).toLocaleDateString('es-CO')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--color-text-muted)' }}>No hay pedidos aún</p>
                    )}
                </div>
            </div>
        </div>
    );
}
