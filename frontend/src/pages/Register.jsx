import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await register({
                nombre: form.nombre,
                email: form.email,
                password: form.password,
                telefono: form.telefono || undefined
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="auth-page">
            <div className="auth-card glass">
                <h1>Crear Cuenta</h1>
                <p className="subtitle">Únete y empieza a comprar</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="nombre">Nombre completo</label>
                        <input
                            id="nombre"
                            type="text"
                            className="form-input"
                            placeholder="Tu nombre"
                            value={form.nombre}
                            onChange={update('nombre')}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            className="form-input"
                            placeholder="tu@email.com"
                            value={form.email}
                            onChange={update('email')}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="telefono">Teléfono (opcional)</label>
                        <input
                            id="telefono"
                            type="tel"
                            className="form-input"
                            placeholder="+57 300 000 0000"
                            value={form.telefono}
                            onChange={update('telefono')}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password">Contraseña</label>
                        <input
                            id="reg-password"
                            type="password"
                            className="form-input"
                            placeholder="Mínimo 6 caracteres"
                            value={form.password}
                            onChange={update('password')}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirm-password">Confirmar contraseña</label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="form-input"
                            placeholder="Repite tu contraseña"
                            value={form.confirmPassword}
                            onChange={update('confirmPassword')}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <p className="footer-text">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
