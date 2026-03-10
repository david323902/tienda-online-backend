import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="container">
                <div className="footer-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="footer-brand" style={{ gridColumn: '1 / -1', maxWidth: '400px', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}><span className="gradient-text">InterConectados</span>Web.es</h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                            Transformamos tu visión en realidad digital. Creamos sitios web profesionales que impulsan el crecimiento de tu negocio con diseño moderno y tecnología de vanguardia.
                        </p>
                    </div>
                    <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Servicios</h4>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Landing Page</a>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Tienda Online</a>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Sitio Web Corporativo</a>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Diseño Personalizado</a>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Hosting Web</a>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Mantenimiento</a>
                    </div>
                    <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Enlaces</h4>
                        <a href="/#inicio" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Inicio</a>
                        <a href="/#servicios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Servicios</a>
                        <a href="/#metodologia" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Proceso</a>
                        <a href="/#testimonios" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Testimonios</a>
                        <a href="/#contacto" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Contacto</a>
                    </div>
                    <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Soporte</h4>
                        <a href="mailto:soporte@interconectadosweb.es" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>soporte@interconectadosweb.es</a>
                        <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Centro de Ayuda</Link>
                        <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Política de Privacidad</Link>
                        <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Términos de Servicio</Link>
                    </div>
                </div>
                <div className="footer-bottom" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <p>© {new Date().getFullYear()} Interconectadosweb. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
