import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartAPI } from '../api/apiClient';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    const itemCount = items.reduce((sum, item) => sum + (item.cantidad || item.quantity || 1), 0);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const res = await cartAPI.getCart();
            const data = res.data;
            if (data.cart && data.cart.items) {
                setItems(data.cart.items);
                setTotal(parseFloat(data.cart.total) || 0);
            } else if (Array.isArray(data.items)) {
                setItems(data.items);
                setTotal(parseFloat(data.total) || 0);
            } else if (Array.isArray(data)) {
                setItems(data);
            }
        } catch {
            // Cart might not exist yet
            setItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setItems([]);
            setTotal(0);
        }
    }, [isAuthenticated, fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            await cartAPI.addToCart(productId, quantity);
            await fetchCart();
            showToast('Producto agregado al carrito');
        } catch (err) {
            showToast(err.response?.data?.error || 'Error al agregar al carrito', 'error');
            throw err;
        }
    };

    const updateItem = async (itemId, cantidad) => {
        try {
            await cartAPI.updateItem(itemId, cantidad);
            await fetchCart();
        } catch (err) {
            showToast(err.response?.data?.error || 'Error al actualizar', 'error');
            throw err;
        }
    };

    const removeItem = async (itemId) => {
        try {
            await cartAPI.removeItem(itemId);
            await fetchCart();
            showToast('Producto eliminado del carrito');
        } catch (err) {
            showToast(err.response?.data?.error || 'Error al eliminar', 'error');
            throw err;
        }
    };

    const clearCart = async () => {
        try {
            await cartAPI.clearCart();
            setItems([]);
            setTotal(0);
            showToast('Carrito vaciado');
        } catch (err) {
            showToast(err.response?.data?.error || 'Error al vaciar carrito', 'error');
        }
    };

    const value = {
        items,
        total,
        itemCount,
        loading,
        toasts,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        showToast,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
