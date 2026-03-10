import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Cart() {
    const { items, total, loading, updateItem, removeItem, clearCart } = useCart();
    const navigate = useNavigate();

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-empty fade-in">
                        <div className="icon">🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega productos para comenzar tu compra</p>
                        <Link to="/productos" className="btn btn-primary">
                            Ver Productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                    <h1 className="section-title" style={{ marginBottom: 0 }}>Mi Carrito</h1>
                    <button className="btn btn-ghost" onClick={clearCart}>
                        🗑 Vaciar carrito
                    </button>
                </div>

                <div className="cart-layout fade-in">
                    <div className="cart-items-list">
                        {items.map(item => {
                            const product = item.Product || item.product || {};
                            const itemId = item.id_item || item.id_carrito_item || item.id;
                            const qty = item.cantidad || item.quantity || 1;
                            const price = parseFloat(product.precio || item.precio_unitario || 0);
                            const imgUrl = product.imagen || null;

                            return (
                                <div key={itemId} className="cart-item">
                                    <div className="cart-item-image">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={product.nombre || 'Producto'} />
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>📦</span>
                                        )}
                                    </div>
                                    <div className="cart-item-info">
                                        <div className="cart-item-name">{product.nombre || 'Producto'}</div>
                                        <div className="cart-item-price">
                                            ${price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-selector">
                                            <button onClick={() => updateItem(itemId, Math.max(1, qty - 1))}>−</button>
                                            <span>{qty}</span>
                                            <button onClick={() => updateItem(itemId, qty + 1)}>+</button>
                                        </div>
                                        <div style={{ fontWeight: 600, minWidth: '80px', textAlign: 'right' }}>
                                            ${(price * qty).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                        </div>
                                        <button className="btn btn-ghost" onClick={() => removeItem(itemId)} title="Eliminar">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary-box">
                        <h3>Resumen del Pedido</h3>
                        <div className="cart-summary-row">
                            <span>Productos ({items.length})</span>
                            <span>${parseFloat(total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Envío</span>
                            <span style={{ color: 'var(--color-success)' }}>Gratis</span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span className="gradient-text">
                                ${parseFloat(total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                            onClick={() => navigate('/checkout')}
                        >
                            Proceder al Pago →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
