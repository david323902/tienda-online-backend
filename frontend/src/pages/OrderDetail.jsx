import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        ordersAPI.getDetail(id)
            .then(res => setOrder(res.data.order || res.data))
            .catch(() => navigate('/pedidos'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
        setCancelling(true);
        try {
            await ordersAPI.cancel(id, 'Cancelado por el usuario');
            setOrder(prev => ({ ...prev, estado: 'cancelado' }));
        } catch {
            alert('No se pudo cancelar el pedido');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;
    if (!order) return null;

    const items = order.OrderItems || order.items || [];
    const canCancel = ['pendiente', 'confirmado'].includes(order.estado);

    return (
        <div className="page">
            <div className="container">
                <Link to="/pedidos" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-block', marginBottom: 'var(--space-xl)' }}>
                    ← Volver a mis pedidos
                </Link>

                <div className="fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: 'var(--space-xl)' }}>
                        <div>
                            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-xs)' }}>
                                Pedido #{order.id_pedido || id}
                            </h1>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                {order.fecha_pedido && new Date(order.fecha_pedido).toLocaleDateString('es-CO', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <span className={`status-badge status-${order.estado || 'pendiente'}`}>
                            {statusLabels[order.estado] || order.estado}
                        </span>
                    </div>

                    {/* Items */}
                    <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-lg)' }}>
                            Productos del Pedido
                        </h2>
                        {items.length > 0 ? items.map((item, idx) => {
                            const product = item.Product || item.product || {};
                            return (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: 'var(--space-md) 0',
                                    borderBottom: idx < items.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    flexWrap: 'wrap', gap: '0.5rem'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{product.nombre || item.nombre || 'Producto'}</div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            Cantidad: {item.cantidad || item.quantity || 1}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>
                                        ${parseFloat(item.precio_unitario || item.precio || product.precio || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{ color: 'var(--color-text-muted)' }}>Sin detalles de productos</p>
                        )}

                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            borderTop: '1px solid var(--color-border)',
                            paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)',
                            fontSize: 'var(--font-size-xl)', fontWeight: 700
                        }}>
                            <span>Total</span>
                            <span className="gradient-text">
                                ${parseFloat(order.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Shipping */}
                    {order.direccion_envio && (
                        <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-md)' }}>
                                📍 Dirección de Envío
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                                {typeof order.direccion_envio === 'string'
                                    ? order.direccion_envio
                                    : `${order.direccion_envio.calle || ''}, ${order.direccion_envio.ciudad || ''}, ${order.direccion_envio.codigo_postal || ''}`
                                }
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {canCancel && (
                        <button
                            className="btn btn-danger"
                            onClick={handleCancel}
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelando...' : '✕ Cancelar Pedido'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
