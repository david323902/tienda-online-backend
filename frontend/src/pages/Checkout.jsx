import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI, cartAPI, stripeAPI } from '../api/apiClient';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Stripe Integration
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Reemplaza con la clave pública de Vite (en desarrollo puedes usarla directa si no lee el env por ahora)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51T7h7pFX8AoU6nmlkzSBcPl7Caz98udqqnpKFoS1UR333c9uIYdUpgMxmOLlFlPgkJPBAXxYEMoiIkkTeLnpUdLs00PIAwapOl');

function CheckoutForm({ clientSecret, total, cartItems, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL si quieres redirigir luego, pero con redirect: 'if_required' podemos manejarlo sin salir
                // return_url: `${window.location.origin}/pedidos`, 
            },
            redirect: 'if_required'
        });

        if (error) {
            onError(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        } else {
            onError('Estado de pago inesperado.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="payment-form">
            <PaymentElement id="payment-element" />
            <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                disabled={isProcessing || !stripe || !elements}
            >
                {isProcessing ? 'Procesando pago...' : `Pagar $${parseFloat(total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
            </button>
        </form>
    );
}


export default function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart, fetchCart } = useCart();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [form, setForm] = useState({
        calle: '',
        ciudad: '',
        codigo_postal: '',
        pais: 'España',
        notas: ''
    });

    useEffect(() => {
        cartAPI.getSummary()
            .then(res => setSummary(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Create PaymentIntent as soon as checkout loads
    useEffect(() => {
        if (total > 0 && !clientSecret) {
            stripeAPI.createPaymentIntent({ amount: total, currency: 'eur' })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    setError('Error al inicializar el pago.');
                    console.error('Stripe Intent Error:', err);
                });
        }
    }, [total]);


    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            const orderData = {
                direccion_envio: {
                    calle: form.calle,
                    ciudad: form.ciudad,
                    codigo_postal: form.codigo_postal,
                    pais: form.pais
                },
                notas: form.notas || undefined,
                metodo_pago: 'stripe' // Usamos esto en backend si queremos mapearlo
            };

            const res = await ordersAPI.create(orderData);
            const orderId = res.data.order?.id_pedido || res.data.orderId || res.data.id; console.log('ORDER RESPONSE:', JSON.stringify(res.data)); console.log('ORDER ID:', orderId); console.log('ORDER RESPONSE:', JSON.stringify(res.data)); console.log('ORDER ID:', orderId);
            await fetchCart();
            // Optional: You could update order to paid here via another endpoint, but simplified for now
            navigate(`/pedidos/${orderId}`);
        } catch (err) {
            setError(err.response?.data?.error || 'El pago fue exitoso pero hubo un error al crear el pedido (por favor contáctanos).');
        }
    };

    const handlePaymentError = (errorMsg) => {
        setError(errorMsg);
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="icon">🛒</div>
                        <h3>No hay items en el carrito</h3>
                        <p>Agrega productos antes de hacer checkout</p>
                        <button className="btn btn-primary" onClick={() => navigate('/productos')}>
                            Ver Productos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#3b82f6',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="section-title">Checkout Seguro</h1>
                <p className="section-subtitle">Completa tu pedido usando Tarjeta, Apple Pay o Google Pay</p>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="checkout-layout fade-in">
                    <div>
                        <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-xl)' }}>
                                📍 Dirección de Envío
                            </h2>

                            <div className="form-group">
                                <label className="form-label" htmlFor="calle">Dirección / Calle</label>
                                <input
                                    id="calle"
                                    type="text"
                                    className="form-input"
                                    placeholder="Calle Principal 123"
                                    value={form.calle}
                                    onChange={update('calle')}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ciudad">Ciudad</label>
                                    <input
                                        id="ciudad"
                                        type="text"
                                        className="form-input"
                                        placeholder="Madrid"
                                        value={form.ciudad}
                                        onChange={update('ciudad')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="codigo_postal">Código Postal</label>
                                    <input
                                        id="codigo_postal"
                                        type="text"
                                        className="form-input"
                                        placeholder="28001"
                                        value={form.codigo_postal}
                                        onChange={update('codigo_postal')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="pais">País</label>
                                <input
                                    id="pais"
                                    type="text"
                                    className="form-input"
                                    value={form.pais}
                                    onChange={update('pais')}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="notas">Notas (opcional)</label>
                                <textarea
                                    id="notas"
                                    className="form-input"
                                    rows="3"
                                    placeholder="Instrucciones especiales de entrega..."
                                    value={form.notas}
                                    onChange={update('notas')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="cart-summary-box">
                        <h3>Resumen del Pedido</h3>

                        {items.map(item => {
                            const product = item.Product || item.product || {};
                            const qty = item.cantidad || item.quantity || 1;
                            const price = parseFloat(product.precio || item.precio_unitario || 0);

                            return (
                                <div key={item.id_item || item.id} className="cart-summary-row" style={{ alignItems: 'flex-start' }}>
                                    <span style={{ flex: 1 }}>
                                        {product.nombre || 'Producto'} × {qty}
                                    </span>
                                    <span>${(price * qty).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                                </div>
                            );
                        })}

                        <div className="cart-summary-row" style={{ marginTop: 'var(--space-md)' }}>
                            <span>Envío</span>
                            <span style={{ color: 'var(--color-success)' }}>Gratis</span>
                        </div>

                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span className="gradient-text">
                                ${parseFloat(total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Método de Pago Seguro</h4>

                            {clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        total={total}
                                        cartItems={items}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                    />
                                </Elements>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <LoadingSpinner />
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                        Cargando métodos de pago (Apple Pay / Google Pay / Tarjeta)...
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
