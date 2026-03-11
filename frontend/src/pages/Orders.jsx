import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';

const statusLabels = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    confirmado: 'Confirmado',
    procesando: 'Procesando',
    enviado: 'Enviado',
    entregado: 'Entregado',
    completado: 'Completado',
    cancelado: 'Cancelado',
    reembolsado: 'Reembolsado'
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        ordersAPI.getUserOrders()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
                setOrders(data);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="section-title">Mis Pedidos</h1>
                <p className="section-subtitle">Historial de tus compras</p>

                {orders.length === 0 ? (
                    <div className="empty-state fade-in">
                        <div className="icon">📦</div>
                        <h3>No tienes pedidos aún</h3>
                        <p>Cuando hagas tu primera compra, aparecerá aquí</p>
                        <button className="btn btn-primary" onClick={() => navigate('/productos')}>
                            Explorar Productos
                        </button>
                    </div>
                ) : (
                    <div className="order-list fade-in">
                        {orders.map(order => {
                            const id = order.id_pedido || order.id;
                            const date = order.fecha_pedido || order.creado_en || order.createdAt;
                            return (
                                <div
                                    key={id}
                                    className="order-card"
                                    onClick={() => navigate(`/pedidos/${id}`)}
                                >
                                    <div className="order-card-info">
                                        <h3>Pedido #{id}</h3>
                                        <p>{date ? new Date(date).toLocaleDateString('es-CO', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        }) : ''}</p>
                                    </div>
                                    <span className={`status-badge status-${order.estado || 'pendiente'}`}>
                                        {statusLabels[order.estado] || order.estado}
                                    </span>
                                    <div className="order-card-total gradient-text">
                                        ${parseFloat(order.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </div>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>→</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
