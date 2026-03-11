import { useState, useEffect } from 'react';
import { whatsappAPI } from '../api/apiClient';

// Es una buena práctica usar variables de entorno para valores de fallback.
// Puedes definirlas en un archivo .env en la raíz de tu proyecto de frontend.
// VITE_FALLBACK_WHATSAPP_NUMBER=+573014367948
// VITE_DEFAULT_WHATSAPP_MESSAGE=Hola, me encantaría recibir asesoría para mi proyecto web.

const FALLBACK_PHONE = import.meta.env.VITE_FALLBACK_WHATSAPP_NUMBER || '+573014367948';
const DEFAULT_MESSAGE = import.meta.env.VITE_DEFAULT_WHATSAPP_MESSAGE || 'Hola, me encantaría recibir asesoría para mi proyecto web.';

export default function WhatsAppButton() {
    const [contactInfo, setContactInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        whatsappAPI.getContactInfo()
            .then(res => setContactInfo(res.data))
            .catch((err) => {
                console.error("No se pudo obtener la info de WhatsApp, usando valores por defecto.", err);
                // En caso de error, usamos los valores de fallback.
                setContactInfo({
                    phone: FALLBACK_PHONE,
                    message: DEFAULT_MESSAGE
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // No renderizar nada mientras carga para evitar parpadeos.
    if (isLoading) {
        return null;
    }

    // Se determina el teléfono y el mensaje a usar, con fallbacks.
    // Se usa una expresión regular más segura que conserva el signo '+' si existe.
    const phone = (contactInfo?.phone || FALLBACK_PHONE).replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(contactInfo?.message || DEFAULT_MESSAGE);
    
    // La URL de WhatsApp no debe llevar el '+', por eso se reemplaza aquí.
    const url = `https://wa.me/${phone.replace('+', '')}?text=${message}`;

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
