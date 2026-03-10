import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addToCart(product.id_producto, 1);
        } catch {
            // Error handled by CartContext toast  
        }
    };

    const imageUrl = product.imagen
        ? (product.imagen.startsWith('http') ? product.imagen : product.imagen)
        : null;

    const inStock = product.stock > 0;

    return (
        <div className="product-card" onClick={() => navigate(`/productos/${product.id_producto}`)}>
            <div className="product-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={product.nombre} loading="lazy" />
                ) : (
                    <span className="placeholder-icon">📦</span>
                )}
            </div>
            <div className="product-card-body">
                {product.categoria && (
                    <div className="product-card-category">{product.categoria}</div>
                )}
                <h3 className="product-card-name">{product.nombre}</h3>
                <div className="product-card-price">
                    ${parseFloat(product.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </div>
                <div className="product-card-footer">
                    <span className={`product-card-stock ${inStock ? 'in-stock' : 'out-stock'}`}>
                        {inStock ? `${product.stock} disponibles` : 'Agotado'}
                    </span>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddToCart}
                        disabled={!inStock}
                    >
                        {inStock ? '+ Carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    );
}
