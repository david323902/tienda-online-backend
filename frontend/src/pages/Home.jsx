import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { stripeAPI, productsAPI } from '../api/apiClient';
<<<<<<< HEAD
import PortfolioPremium from '../components/PortfolioPremium';
=======
import ProductCard from '../components/ProductCard';
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
import '../styles/landing.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Home() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        servicio: '',
        mensaje: ''
    });
<<<<<<< HEAD
=======
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b

    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();

<<<<<<< HEAD
=======
    useEffect(() => {
        productsAPI.getAll()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.products || [];
                setFeaturedProducts(data.slice(0, 3));
            })
            .catch(() => setFeaturedProducts([]))
            .finally(() => setLoadingProducts(false));
    }, []);

>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the message
        const serviceName = formData.servicio ? formData.servicio.toUpperCase() : 'General';
        const text = `Hola equipo de InterConectadosWeb, me interesa solicitar un presupuesto.%0A%0A`
            + `*Servicio:* ${serviceName}%0A`
            + `*Nombre:* ${formData.nombre}%0A`
            + `*Email:* ${formData.email}%0A`
            + `*Teléfono:* ${formData.telefono}%0A%0A`
            + `*Mensaje:* ${formData.mensaje}`;

        // Send via WhatsApp
        const phone = '573014367948';
        const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        setFormData({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
    };

    const handleContratar = async (serviceName, price) => {
        try {
            const res = await stripeAPI.createCheckoutSession({ serviceName, price });
            if (res.data.success && res.data.url) {
                window.location.href = res.data.url; // Redirect to Stripe Checkout
            }
        } catch (error) {
            console.error('Error al iniciar checkout de Stripe:', error);
            alert('En este momento no se puede iniciar el pago. Intenta solicitar un presupuesto vía WhatsApp.');
        }
    };

    // Reseñas 
    const reviews = [
        { id: 1, texto: "El equipo de Interconectadosweb es excepcional. Entendieron perfectamente nuestra visión y la ejecución fue impecable.", autor: "Carlos Rodríguez", cargo: "Director Ejecutivo, TechStart Solutions", iniciales: "CR" },
        { id: 2, texto: "Interconectadosweb transformó completamente nuestra presencia online. El sitio web superó todas nuestras expectativas.", autor: "María González", cargo: "Directora de Marketing, Moda Urbana", iniciales: "MG" },
        { id: 3, texto: "La landing page generó más de 500 leads calificados en el primer mes. El ROI ha sido excepcional y el soporte es de primera.", autor: "Roberto Sánchez", cargo: "Director Comercial, Gimnasio FitLife", iniciales: "RS" },
        { id: 4, texto: "Trabajar con ellos fue una experiencia increíble. Su atención al detalle y compromiso con la calidad son incomparables.", autor: "Ana Martínez", cargo: "Propietaria, La Bella Vista", iniciales: "AM" }
    ];

<<<<<<< HEAD
   useEffect(() => {
    // Pequeño delay para que los componentes hijos terminen de montarse
    const timer = setTimeout(() => {
=======
    useEffect(() => {
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
<<<<<<< HEAD
    }, 100);

    return () => clearTimeout(timer);
}, []);
=======
        return () => observer.disconnect();
    }, []);
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section" id="inicio">
                <div className="container">
                    <div className="hero-content zoom-in">
                        <div className="badge-wrapper floating">
                            <span className="badge">🚀 Agencia de Desarrollo Web y Apps de Elite</span>
                        </div>
                        <h1 className="slide-in-left" style={{ textAlign: 'center' }}>
                            Transformamos Tu Visión en <br className="hidden-mobile" />
                            <span className="gradient-text">Realidad Digital</span>
                        </h1>
                        <p className="hero-subtitle slide-in-right" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
                            Creamos sitios web profesionales, landing pages de alto rendimiento y ecosistemas online que impulsan el crecimiento de tu negocio. Precios transparentes desde 299€.
                        </p>

                        <div className="tech-stack-emojis floating" style={{ animationDelay: '0.5s', fontSize: '2rem', marginBottom: '3rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                            <div className="tech-item"><span style={{ fontSize: '2.5rem' }}>⚛️</span><span className="tech-label">React</span></div>
                            <div className="tech-item"><span style={{ fontSize: '2.5rem' }}>🅰️</span><span className="tech-label">Angular</span></div>
                            <div className="tech-item"><span style={{ fontSize: '2.5rem' }}>🟢</span><span className="tech-label">Node.js</span></div>
                            <div className="tech-item"><span style={{ fontSize: '2.5rem' }}>🐍</span><span className="tech-label">Python</span></div>
                            <div className="tech-item"><span style={{ fontSize: '2.5rem' }}>☁️</span><span className="tech-label">Cloud</span></div>
                        </div>

                        <div className="hero-actions fade-in" style={{ animationDelay: '1s', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
<<<<<<< HEAD
=======
                            <Link to="/productos" className="btn btn-primary btn-lg" style={{ background: 'var(--color-secondary)' }}>Tienda de Páginas</Link>
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
                            <a href="#servicios" className="btn btn-primary btn-lg">Explorar Servicios</a>
                            <a href="#contacto" className="btn btn-secondary btn-lg">Solicitar Presupuesto</a>
                        </div>
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* Estadísticas - Números que nos respaldan */}
            <section className="stats-section section reveal" style={{ padding: '4rem 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ color: 'white' }}>Números que nos respaldan</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                        {[
                            { number: "100+", label: "Proyectos" },
                            { number: "150+", label: "Clientes Felices" },
                            { number: "5+", label: "Años Experiencia" },
                            { number: "4.9", label: "Calificación" },
                            { number: "200%", label: "ROI Promedio" },
                            { number: "30", label: "Días Garantía" }
                        ].map((stat, idx) => (
                            <div key={idx} className="reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38bdf8', marginBottom: '0.5rem' }}>{stat.number}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '500' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

=======
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
            {/* Servicios Principales */}
            <section className="servicios section reveal" id="servicios">
                <div className="container">
                    <div className="text-center mb-5" style={{ marginBottom: '4rem' }}>
                        <h2 className="section-title"><span style={{ fontSize: '1.2rem', display: 'block', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Nuestros Servicios</span>SERVICIOS DE DISEÑO Y HOSTING</h2>
                        <p className="section-subtitle">Soluciones web adaptadas a las necesidades de tu empresa con precios transparentes y calidad garantizada.</p>
                    </div>
                    <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="pricing-card reveal" style={{ animationDelay: '0.1s' }}>
                            <h4>LANDING PAGE</h4>
                            <div className="price">€299</div>
                            <p className="desc">Página optimizada para conversión directa y Google Ads.</p>
                            <ul>
                                <li>Diseño responsive</li>
                                <li>Formulario de contacto</li>
                                <li>SEO básico</li>
                                <li>Hosting 1 año</li>
                            </ul>
                            <button onClick={() => handleContratar('Landing Page', 299)} className="btn btn-primary btn-block">CONTRATAR</button>
                        </div>
                        <div className="pricing-card reveal" style={{ animationDelay: '0.2s' }}>
                            <h4>DISEÑO PERSONALIZADO</h4>
                            <div className="price">€599</div>
                            <p className="desc">Diseño único de identidad visual corporativa avanzada.</p>
                            <ul>
                                <li>Diseño exclusivo</li>
                                <li>Brand identity</li>
                                <li>Manual de marca</li>
                                <li>Archivos editables</li>
                            </ul>
                            <button onClick={() => handleContratar('Diseño Personalizado', 599)} className="btn btn-primary btn-block">CONTRATAR</button>
                        </div>
                        <div className="pricing-card popular reveal" style={{ animationDelay: '0.3s' }}>
                            <div className="ribbon">POPULAR</div>
                            <h4>TIENDA ONLINE</h4>
                            <div className="price">€799</div>
                            <p className="desc">E-commerce completo con gestión de productos e inventario.</p>
                            <ul>
                                <li>Hasta 100 productos</li>
                                <li>Pasarela de pagos</li>
                                <li>Panel admin</li>
                                <li>Soporte 3 meses</li>
                            </ul>
                            <button onClick={() => handleContratar('Tienda Online', 799)} className="btn btn-primary btn-block">CONTRATAR</button>
                        </div>
                        <div className="pricing-card reveal" style={{ animationDelay: '0.4s' }}>
                            <h4>SITIO CORPORATIVO</h4>
                            <div className="price">€1199</div>
                            <p className="desc">Presencia profesional avanzada para empresas y PYMES.</p>
                            <ul>
                                <li>Hasta 10 páginas</li>
                                <li>Blog integrado</li>
                                <li>Multilenguaje</li>
                                <li>Analytics avanzado</li>
                            </ul>
                            <button onClick={() => handleContratar('Sitio Corporativo', 1199)} className="btn btn-primary btn-block">CONTRATAR</button>
                        </div>
                        <div className="pricing-card reveal" style={{ animationDelay: '0.5s' }}>
                            <h4>HOSTING WEB PRO</h4>
                            <div className="price">€99<span>/año</span></div>
                            <p className="desc">Alta velocidad, backups y seguridad SSL incluida.</p>
                            <ul>
                                <li>SSD 5TB</li>
                                <li>SSL gratuito</li>
                                <li>Backups diarios</li>
                                <li>Soporte 24/7</li>
                            </ul>
                            <button onClick={() => handleContratar('Hosting Web Pro', 99)} className="btn btn-primary btn-block">CONTRATAR</button>
                        </div>
                        <div className="pricing-card reveal" style={{ animationDelay: '0.6s' }}>
                            <h4>MANTENIMIENTO</h4>
                            <div className="price">€19<span>/mes</span></div>
                            <p className="desc">Seguridad activa y actualizaciones mensuales técnicas.</p>
                            <ul>
                                <li>Actualizaciones</li>
                                <li>Seguridad</li>
                                <li>Monitoreo</li>
                                <li>Soporte técnico</li>
                            </ul>
                            <button onClick={() => handleContratar('Mantenimiento', 19)} className="btn btn-primary btn-block">CONTRATAR</button>
                        </div>
                    </div>
                    <div className="text-center mt-5">
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Todos los precios incluyen IVA. Consulta condiciones especiales para proyectos personalizados.</p>
                    </div>
                </div>
            </section>


            {/* Nuestra Esencia */}
            <section className="esencia section-dark reveal" id="esencia" style={{ background: '#0a0a0f' }}>
                <div className="container">
                    <div className="text-center mb-5" style={{ marginBottom: '4rem' }}>
                        <h2 className="section-title slide-in-left" style={{ color: 'white' }}>🚀 Nuestra Esencia</h2>
                        <p className="section-subtitle fade-in" style={{ color: '#94a3b8' }}>Compromiso inquebrantable con la calidad y la innovación.</p>
                    </div>

                    <div className="grid-2" style={{ marginBottom: '4rem' }}>
                        <div className="esencia-card reveal" style={{ animationDelay: '0.2s', background: 'rgba(255, 255, 255, 0.03)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)', color: 'white', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#7c3aed' }}>Misión: Impulsar tu éxito digital</h3>
                            <p style={{ fontStyle: 'italic', marginBottom: '2rem', fontSize: '1.1rem', color: '#cbd5e1', lineHeight: '1.8' }}>"Empoderamos a empresas mediante soluciones digitales inteligentes que eliminan la complejidad técnica. Tú te concentras en crecer, nosotros en la tecnología."</p>
                            <div className="badge badge-primary">Resultados Tangibles</div>
                        </div>
                        <div className="esencia-card reveal" style={{ animationDelay: '0.4s', background: 'rgba(255, 255, 255, 0.03)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)', color: 'white', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌐</div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#06b6d4' }}>Visión: Conectando el Futuro</h3>
                            <p style={{ fontStyle: 'italic', marginBottom: '2rem', fontSize: '1.1rem', color: '#cbd5e1', lineHeight: '1.8' }}>"Liderar la transformación digital con ecosistemas web robustos, seguros y escalables que transforman ideas en resultados reales en un mercado global."</p>
                            <div className="badge badge-info">Innovación Constante</div>
                        </div>
                    </div>

                    <div className="valores-section">
                        <div className="text-center mb-4" style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>💎 Nuestros Valores: Tu ADN de Confianza</h3>
                            <p style={{ color: '#94a3b8', maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem' }}>Estos son los pilares que blindan tu proyecto y garantizan el éxito:</p>
                        </div>
                        <div className="grid-3" style={{ gap: '1.5rem' }}>
                            <div className="valor-item reveal" style={{ animationDelay: '0.1s', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🔍</span> Transparencia Radical</h4>
                                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Hablamos claro, sin tecnicismos ni sorpresas. Honestidad total en cada etapa de tu proyecto.</p>
                                </div>
                            </div>
                            <div className="valor-item reveal" style={{ animationDelay: '0.2s', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>📈</span> Obsesión por el Rendimiento</h4>
                                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Creamos máquinas de resultados optimizadas para convertir visitantes en clientes reales.</p>
                                </div>
                            </div>
                            <div className="valor-item reveal" style={{ animationDelay: '0.3s', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🛡️</span> Seguridad Innegociable</h4>
                                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Aplicamos los estándares más rigurosos para blindar tu presencia digital y proteger tu activo más valioso.</p>
                                </div>
                            </div>
                            <div className="valor-item reveal" style={{ animationDelay: '0.4s', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%', gridColumn: 'span 1' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>⚡</span> Agilidad Adaptativa</h4>
                                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Evolucionamos al ritmo del mercado digital para garantizar que tu negocio esté siempre a la vanguardia.</p>
                                </div>
                            </div>
                            <div className="valor-item reveal" style={{ animationDelay: '0.5s', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%', gridColumn: 'span 2' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <h4 style={{ color: 'white', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span>🤝</span> Compromiso Real</h4>
                                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>No somos simples proveedores, somos tus socios. Tu crecimiento define nuestro éxito.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proyectos Destacados */}
<<<<<<< HEAD
            <PortfolioPremium />
=======
            <section className="proyectos section reveal" id="proyectos">
                <div className="container">
                    <div className="text-center mb-5" style={{ marginBottom: '4rem' }}>
                        <h2 className="section-title">🌟 Casos de Éxito</h2>
                        <p className="section-subtitle">Descubre el impacto real en negocios de diversos sectores.</p>
                    </div>
                    <div className="grid-3" style={{ gap: '2rem' }}>
                        <div className="proyecto-card reveal" style={{ animationDelay: '0.2s' }}>
                            <div style={{ height: '300px', width: '100%', background: 'linear-gradient(135deg, #1e293b, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '5rem', position: 'relative', overflow: 'hidden' }}>
                                <span className="floating">🛍️</span>
                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem', backdropFilter: 'blur(5px)' }}>+150% Ventas</div>
                            </div>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Moda Urbana Shop</h4>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>E-commerce de alto rendimiento con diseño ultra-moderno y pagos seguros.</p>
                                <div className="badge badge-primary">React + Node.js</div>
                            </div>
                        </div>
                        <div className="proyecto-card reveal" style={{ animationDelay: '0.4s' }}>
                            <div style={{ height: '300px', width: '100%', background: 'linear-gradient(135deg, #0a0a0f, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '5rem', position: 'relative', overflow: 'hidden' }}>
                                <span className="floating" style={{ animationDelay: '0.5s' }}>🥗</span>
                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem', backdropFilter: 'blur(5px)' }}>Reservas 24/7</div>
                            </div>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>La Bella Vista</h4>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Portal gastronómico de lujo con sistema de gestión de reservas en tiempo real.</p>
                                <div className="badge badge-info">Next.js + Tailwind</div>
                            </div>
                        </div>
                        <div className="proyecto-card reveal" style={{ animationDelay: '0.6s' }}>
                            <div style={{ height: '300px', width: '100%', background: 'linear-gradient(135deg, #7c3aed, #f472b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '5rem', position: 'relative', overflow: 'hidden' }}>
                                <span className="floating" style={{ animationDelay: '1s' }}>💪</span>
                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem', backdropFilter: 'blur(5px)' }}>500+ Leads/mes</div>
                            </div>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gimnasio FitLife</h4>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Landing de conversión captación masiva de socios con alta velocidad de carga.</p>
                                <div className="badge badge-accent" style={{ background: 'rgba(244, 114, 182, 0.2)', color: '#f472b6' }}>Marketing Pro</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b

            {/* Diferenciadores */}
            <section className="diferenciadores section reveal" id="diferenciadores">
                <div className="container">
                    <div className="text-center mb-5" style={{ marginBottom: '4rem' }}>
                        <h2 className="section-title">¿Por qué elegirnos?</h2>
                        <p className="section-subtitle">Compromiso con la excelencia y la satisfacción total en cada proyecto.</p>
                    </div>
                    <div className="grid-2-to-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
                        <div className="diferenciador-card reveal" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏆</div>
                            <h4>Garantía de Calidad</h4>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>100% satisfacción con revisiones ilimitadas en el diseño inicial.</p>
                        </div>
                        <div className="diferenciador-card reveal" style={{ textAlign: 'center', padding: '2rem', animationDelay: '0.1s' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚡</div>
                            <h4>Velocidad Pura</h4>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Sitios optimizados para cargar en milisegundos y retener usuarios.</p>
                        </div>
                        <div className="diferenciador-card reveal" style={{ textAlign: 'center', padding: '2rem', animationDelay: '0.2s' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎧</div>
                            <h4>Soporte Dedicado</h4>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Canal directo de comunicación vía WhatsApp y Email los 365 días.</p>
                        </div>
                        <div className="diferenciador-card reveal" style={{ textAlign: 'center', padding: '2rem', animationDelay: '0.3s' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💻</div>
                            <h4>Código Moderno</h4>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Arquitecturas escalables utilizando las últimas tecnologías pro.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metodología */}
            <section className="proceso section-dark reveal" id="metodologia" style={{ background: '#0a0a0f' }}>
                <div className="container">
                    <div className="text-center mb-5" style={{ marginBottom: '4rem' }}>
<<<<<<< HEAD
                        <h2 className="section-title" style={{ color: 'white' }}>¿Cómo Trabajamos?</h2>
                        <p className="section-subtitle" style={{ color: '#94a3b8', maxWidth: '600px', margin: '1rem auto 0' }}>Un proceso transparente y colaborativo de principio a fin. Tu proyecto en manos expertas.</p>
                    </div>
                    <div className="timeline">
                        {[
                            { step: '01', title: 'Consulta Inicial', desc: 'Conversamos sobre tu proyecto, objetivos y necesidades específicas para entender tu visión completamente.' },
                            { step: '02', title: 'Pago Seguro y Firma de Contrato', desc: 'Proceso de pago 100% garantizado con factura oficial y Firma del contrato. Tu inversión está protegida en todo momento.' },
                            { step: '03', title: 'Diseño y Propuesta', desc: 'Creamos prototipos y maquetas personalizadas que reflejan la identidad de tu marca para tu aprobación.' },
                            { step: '04', title: 'Desarrollo', desc: 'Programamos tu sitio con código limpio, optimizado y las mejores tecnologías del mercado actual.' },
                            { step: '05', title: 'Lanzamiento', desc: 'Publicamos tu web, te capacitamos y damos soporte continuo para asegurar el éxito de tu proyecto.' }
=======
                        <h2 className="section-title" style={{ color: 'white' }}>Nuestro Proceso</h2>
                        <p className="section-subtitle">Un flujo de trabajo transparente y altamente colaborativo.</p>
                    </div>
                    <div className="timeline">
                        {[
                            { step: '01', title: 'Consulta Inicial', desc: 'Analizamos tus objetivos y definimos la estrategia digital ganadora.' },
                            { step: '02', title: 'Diseño UX/UI', desc: 'Creamos prototipos visuales que reflejan fielmente tu identidad.' },
                            { step: '03', title: 'Desarrollo Pro', desc: 'Programamos con código limpio, escalable y optimizado para SEO.' },
                            { step: '04', title: 'QA & Testing', desc: 'Verificamos cada detalle para asegurar un funcionamiento impecable.' },
                            { step: '05', title: 'Lanzamiento', desc: 'Ponemos tu proyecto en marcha y te acompañamos en el crecimiento.' }
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
                        ].map((item, idx) => (
                            <div key={idx} className="timeline-item reveal" style={{ animationDelay: `${idx * 0.15}s` }}>
                                <div className="step">{item.step}</div>
                                <div className="content">
                                    <h4 style={{ color: 'white' }}>{item.title}</h4>
                                    <p style={{ color: '#cbd5e1' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonios */}
            <section className="testimonios section reveal" id="testimonios">
                <div className="container">
                    <div className="text-center mb-5" style={{ marginBottom: '4rem' }}>
                        <h2 className="section-title">Lo Que Dicen Nuestros Clientes</h2>
                        <p className="section-subtitle">Casos reales de transformación digital con impacto positivo.</p>
                    </div>
                    <div className="carousel-container">
                        <div className="carousel-track">
                            <div className="carousel-set">
                                {reviews.map((review) => (
                                    <div key={`set1-${review.id}`} className="carousel-slide">
                                        <div className="testimonio-card">
                                            <div className="stars">★★★★★</div>
                                            <p className="quote">"{review.texto}"</p>
                                            <div className="author">
                                                <div className="avatar">{review.iniciales}</div>
                                                <div style={{ textAlign: 'left' }}>
                                                    <h5 style={{ margin: '0 0 0.25rem 0' }}>{review.autor}</h5>
                                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{review.cargo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="cta-section reveal">
                <div className="container text-center">
<<<<<<< HEAD
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white', fontWeight: '800' }}>¿Listo para Llevar tu Negocio al Siguiente Nivel?</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 3.5rem' }}>Únete a más de 150 empresas que han confiado en nosotros para transformar su presencia digital y multiplicar sus resultados.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <a href="#contacto" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary)', padding: '1.2rem 3.5rem' }}>Comenzar Ahora</a>
                        <a href="#portafolio" className="btn btn-secondary btn-lg">Ver Portafolio</a>
                    </div>
                    <div style={{ marginTop: '2rem', color: '#94a3b8', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                        <span>✓ Consulta gratuita</span>
                        <span>✓ Sin pagos ocultos</span>
                        <span>✓ Garantía de satisfacción</span>
=======
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white', fontWeight: '800' }}>¿Listo para el Siguiente Nivel?</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 3.5rem' }}>Únete a los líderes que ya están dominando el mercado digital con tecnología pro.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <a href="#contacto" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary)', padding: '1.2rem 3.5rem' }}>Empezar Proyecto</a>
                        <Link to="/productos" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white', padding: '1.2rem 3.5rem' }}>Tienda Online</Link>
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
                    </div>
                </div>
            </section>

            {/* Contacto */}
            <section className="contacto section reveal" id="contacto">
                <div className="container">
                    <div className="grid-2" style={{ gap: '5rem', alignItems: 'center' }}>
                        <div>
                            <h2 className="section-title">Hablemos de tu Proyecto</h2>
<<<<<<< HEAD
                            <p className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>Estamos listos para ayudarte a hacer realidad tu visión digital. Contáctanos hoy mismo y comencemos a trabajar juntos.</p>
=======
                            <p className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>Recibe una propuesta estratégica personalizada sin compromiso.</p>
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b

                            <div className="contact-info">
                                <div className="contact-item fade-in">
                                    <span style={{ fontSize: '2rem' }}>📧</span>
                                    <div>
<<<<<<< HEAD
                                        <h5 style={{ margin: 0 }}>Correo Electrónico</h5>
=======
                                        <h5 style={{ margin: 0 }}>Soporte Técnico</h5>
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
                                        <p style={{ opacity: 0.7 }}>soporte@interconectadosweb.es</p>
                                    </div>
                                </div>
                                <div className="contact-item fade-in" style={{ marginTop: '2rem' }}>
                                    <span style={{ fontSize: '2rem' }}>📱</span>
<<<<<<< HEAD
                                    <div>
                                        <h5 style={{ margin: 0 }}>WhatsApp</h5>
                                        <p style={{ opacity: 0.7 }}>+57 301 436 7948</p>
                                    </div>
                                </div>
                                <div className="contact-item fade-in" style={{ marginTop: '2rem' }}>
                                    <span style={{ fontSize: '2rem' }}>📍</span>
                                    <div>
                                        <h5 style={{ margin: 0 }}>Ubicación</h5>
                                        <p style={{ opacity: 0.7 }}>España</p>
                                    </div>
=======

>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-card" style={{ background: 'var(--color-bg-secondary)', padding: '3rem', borderRadius: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xl)' }}>
                            <h3 style={{ marginBottom: '2.5rem', fontSize: '2.2rem' }}>Consultoría Gratis</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <input type="text" placeholder="Nombre Completo" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="form-input" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }} />
                                <input type="email" placeholder="Email Corporativo" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }} />
                                <select value={formData.servicio} onChange={e => setFormData({ ...formData, servicio: e.target.value })} className="form-input" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>
                                    <option value="">¿Cómo podemos ayudarte?</option>
                                    <option value="landing">Desarrollo Landing Page</option>
                                    <option value="ecommerce">Tienda Online E-commerce</option>
                                    <option value="corporativo">Sitio Corporativo / Institucional</option>
                                    <option value="app">Desarrollo de App a Medida</option>
                                </select>
                                <textarea placeholder="Describe brevemente tus objetivos..." rows="4" required value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} className="form-input" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', resize: 'vertical' }}></textarea>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontSize: '1.2rem' }}>Enviar mi Solicitud</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
