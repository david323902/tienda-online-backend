import { useState, useEffect } from 'react';

const projectsData = [
    {
        id: 'faciltrueque',
        title: "FacilTrueque",
        enfoque: "Economía Colaborativa y Marketplace.",
        desc: "Plataforma moderna de intercambio y trueque digital. Desarrollada con un enfoque en la facilidad de uso (UX), permitiendo a los usuarios gestionar activos y servicios de forma ágil y segura.",
        highlight: "Arquitectura escalable y gestión de flujo de usuarios en tiempo real.",
        url: "https://faciltrueque.interconectadosweb.es",
        
    },
    {
        id: 'doctor-repair',
        title: "Doctor Repair",
        enfoque: "Servicio Técnico y Logística.",
        desc: "Solución digital integral para servicios de reparación técnica. Incluye una estructura optimizada para la conversión de leads y gestión de solicitudes de soporte especializado.",
        highlight: "Interfaz intuitiva y optimización de SEO local para captación de clientes.",
        url: "https://doctor-repair.interconectadosweb.es",
        
    },
    {
        id: 'biomagnetismo',
        title: "Biomagnetismo",
        enfoque: "Salud y Bienestar.",
        desc: "Sitio especializado para servicios de terapias alternativas. Diseñado con una estética limpia y profesional que transmite confianza, orientado a la reserva de citas y educación del paciente.",
        highlight: "Optimización de tiempos de carga (Web Vitals) y diseño 100% responsive.",
        url: "https://biomagnetismo.interconectadosweb.es",
        
    },
    {
        id: 'jetxperience',
        title: "JetXperience",
        enfoque: "Turismo y Experiencias Premium.",
        desc: "Landing page de alto impacto visual para la promoción de servicios turísticos exclusivos. Enfocada en el storytelling visual para maximizar el deseo de compra del usuario.",
        highlight: "Integración de elementos multimedia de alta calidad sin sacrificar el rendimiento del sitio.",
        url: "https://jetxperience.interconectadosweb.es",
        
    },
    {
        id: 'casa-restauracion',
        title: "Casa de Restauración",
        enfoque: "Institucional / Social.",
        desc: "Plataforma de presencia digital para organizaciones de apoyo social. Estructura clara para la difusión de eventos, programas de ayuda y contacto directo con la comunidad.",
        highlight: "Organización de contenido jerárquica para facilitar la navegación en dispositivos móviles.",
        url: "https://casaderestauracion.interconectadosweb.es",
        
    },
    {
        id: 'interconectados',
        title: "Interconectados Web",
        enfoque: "Agencia de Desarrollo y Consultoría.",
        desc: "El centro de operaciones donde se demuestra la capacidad técnica en SEO, rendimiento y auditoría de código. Es la vitrina de servicios de automatización y desarrollo a medida.",
        highlight: "Puntuaciones de 100% en PageSpeed Insights y arquitectura de microservicios.",
        url: "https://www.interconectadosweb.es",
        img: "img/image_25ea76.png"
    }
];

export default function PortfolioPremium() {
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedProject]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedProject(null);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            {/* Sección principal usando clases de landing.css */}
            <section
                className="portfolio-premium section"
                id="portafolio"
                style={{ padding: '6rem 0' }}
            >
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <span className="section-badge">Portafolio</span>
                        <h2 className="section-title" style={{ color: 'white', marginTop: '0.5rem' }}>
                            Proyectos Destacados
                        </h2>
                        <p className="section-subtitle" style={{ color: '#94a3b8' }}>
                            Desarrollo avanzado, rendimiento optimizado y arquitectura orientada a la conversión.
                        </p>
                    </div>

                    <div className="projects-grid-premium">
                        {projectsData.map((project) => (
                            <article
                                key={project.id}
                                className="card-premium"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div>
                                    <h3 className="card-premium-title">{project.title}</h3>
                                    <span className="card-premium-focus">{project.enfoque}</span>
                                    <p className="card-premium-desc">
                                        {project.desc.substring(0, 90)}...
                                    </p>
                                </div>
                                <button className="btn-premium-view">Ver Detalles</button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal usando clases de landing.css */}
            {selectedProject && (
                <div
                    className="modal-overlay-premium"
                    onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}
                >
                    <div className="modal-content-premium" role="dialog" aria-modal="true">
                        <button
                            className="modal-close-premium"
                            onClick={() => setSelectedProject(null)}
                            aria-label="Cerrar modal"
                        >
                            &times;
                        </button>
                        <div className="modal-body-premium">
                            <div className="modal-image-container">
                                <img
                                    src={selectedProject.img}
                                    alt={`Vista previa de ${selectedProject.title}`}
                                    className="modal-image"
                                />
                            </div>
                            <h2 className="modal-info-title">{selectedProject.title}</h2>
                            <div className="modal-info-focus">Enfoque: {selectedProject.enfoque}</div>
                            <p className="modal-desc">{selectedProject.desc}</p>
                            <div className="modal-highlight">
                                <strong>Highlight Técnico:</strong>
                                {selectedProject.highlight}
                            </div>
                            <a
                                href={selectedProject.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-link-premium"
                            >
                                Visitar Proyecto Oficial
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}