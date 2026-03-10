import { useState, useEffect } from 'react';
import { ordersAPI } from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusOptions = [
    'pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado', 'reembolsado'
];
const statusLabels = {
    pendiente: 'Pendiente', confirmado: 'Confirmado', procesando: 'Procesando',
    enviado: 'Enviado', entregado: 'Entregado', completado: 'Completado',
    cancelado: 'Cancelado', reembolsado: 'Reembolsado'
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = () => {
        ordersAPI.getAllOrders()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
                setOrders(data);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await ordersAPI.updateStatus(orderId, newStatus, '');
            setOrders(prev =>
                prev.map(o => (o.id_pedido || o.id) === orderId ? { ...o, estado: newStatus } : o)
            );
        } catch {
            alert('Error al actualizar el estado');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = filterStatus
        ? orders.filter(o => o.estado === filterStatus)
        : orders;

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1 className="section-title">Gestión de Pedidos</h1>
                        <p className="section-subtitle" style={{ marginBottom: 0 }}>
                            {orders.length} pedidos en total
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <button
                        className={`filter-chip ${!filterStatus ? 'active' : ''}`}
                        onClick={() => setFilterStatus('')}
                    >
                        Todos ({orders.length})
                    </button>
                    {statusOptions.map(s => {
                        const count = orders.filter(o => o.estado === s).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={s}
                                className={`filter-chip ${filterStatus === s ? 'active' : ''}`}
                                onClick={() => setFilterStatus(s)}
                            >
                                {statusLabels[s]} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Orders Table */}
                <div className="card fade-in" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Cambiar Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => {
                                    const orderId = order.id_pedido || order.id;
                                    return (
                                        <tr key={orderId}>
                                            <td style={{ fontWeight: 600 }}>#{orderId}</td>
                                            <td>
                                                <div>{order.User?.nombre || '—'}</div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                    {order.User?.email || ''}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                ${parseFloat(order.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${order.estado || 'pendiente'}`}>
                                                    {statusLabels[order.estado] || order.estado}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                                {order.fecha_pedido && new Date(order.fecha_pedido).toLocaleDateString('es-CO')}
                                            </td>
                                            <td>
                                                <select
                                                    className="form-input"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-size-xs)', width: 'auto', minWidth: '130px' }}
                                                    value={order.estado}
                                                    onChange={(e) => handleStatusChange(orderId, e.target.value)}
                                                    disabled={updatingId === orderId}
                                                >
                                                    {statusOptions.map(s => (
                                                        <option key={s} value={s}>{statusLabels[s]}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No hay pedidos con este estado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
