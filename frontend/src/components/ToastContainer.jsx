import { useCart } from '../context/CartContext';

export default function ToastContainer() {
    const { toasts } = useCart();

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.message}
                </div>
            ))}
        </div>
    );
}