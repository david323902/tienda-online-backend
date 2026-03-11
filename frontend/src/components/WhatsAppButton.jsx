import { useState, useEffect } from 'react';
import { whatsappAPI } from '../api/apiClient';

<<<<<<< HEAD
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
=======
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
>>>>>>> 3bf4bb509db8e122835b72127a4523ee94055e5b

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
