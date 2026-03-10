import { useState, useEffect } from 'react';
import { whatsappAPI } from '../api/apiClient';

export default function WhatsAppButton() {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        whatsappAPI.getContactInfo()
            .then(res => setInfo(res.data))
            .catch(() => {
                // Default fallback for InterConectadosWeb
                setInfo({
                    phone: '+573014367948',
                    message: 'Hola, me encantaría recibir más información sobre sus servicios de desarrollo web.'
                });
            });
    }, []);

    if (!info) return null;

    // Use specific landing page info by default if backend doesn't provide it
    const phone = ((info.phone?.includes('573014367948') ? info.phone : '+573014367948') || '').replace(/[^0-9]/g, '');
    const defaultMsg = 'Hola, me encantaría recibir asesoría para mi proyecto web.';
    const message = encodeURIComponent(defaultMsg);
    const url = `https://wa.me/${phone}?text=${message}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            title="Contáctanos por WhatsApp"
            aria-label="WhatsApp"
        >
            💬
        </a>
    );
}
