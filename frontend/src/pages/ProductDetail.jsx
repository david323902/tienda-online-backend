import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        productsAPI.getById(id)
            .then(res => setProduct(res.data))
            .catch(() => navigate('/productos'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setAdding(true);
        try {
            await addToCart(product.id_producto, quantity);
        } catch {
            // handled by context
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!product) return null;

    const imageUrl = product.imagen || null;
    const inStock = product.stock > 0;

    return (
        <div className="product-detail">
            <div className="container">
                <nav style={{ marginBottom: 'var(--space-xl)' }}>
                    <Link to="/productos" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        ← Volver a productos
                    </Link>
                </nav>

                <div className="product-detail-grid fade-in-up">
                    <div className="product-detail-image">
                        {imageUrl ? (
                            <img src={imageUrl} alt={product.nombre} />
                        ) : (
                            <span style={{ fontSize: '5rem', color: 'var(--color-text-muted)' }}>📦</span>
                        )}
                    </div>

                    <div className="product-detail-info">
                        {product.categoria && (
                            <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                                {product.categoria}
                            </span>
                        )}
                        <h1>{product.nombre}</h1>
                        <div className="product-detail-price gradient-text">
                            ${parseFloat(product.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                        </div>

                        <p className="product-detail-description">
                            {product.descripcion || 'Sin descripción disponible.'}
                        </p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <span className={`badge ${inStock ? 'badge-success' : 'badge-error'}`}>
                                {inStock ? `${product.stock} en stock` : 'Agotado'}
                            </span>
                        </div>

                        {inStock && (
                            <>
                                <div className="quantity-selector">
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Cantidad:</span>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    style={{ width: '100%' }}
                                >
                                    {adding ? 'Agregando...' : '🛒 Agregar al Carrito'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
