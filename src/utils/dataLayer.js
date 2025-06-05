let gaInitialized = false;

// Utility function to safely push events to dataLayer
export function pushToDataLayer(eventObject) {
    if (typeof window.dataLayer !== 'undefined' && window.dataLayer instanceof Array) {
        window.dataLayer.push(eventObject);
    }
}

// Initialize Google Analytics with tracking ID
export function initializeGoogleAnalytics(trackingId) {
    if (!trackingId) return;
    if (window.gtag) {
        window.gtag('config', trackingId);
        gaInitialized = true;
        return;
    }
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);
    script.onload = () => {
        window.gtag('js', new Date());
        window.gtag('config', trackingId);
        gaInitialized = true;
    };
}

export function sendGAEvent(eventName, params = {}) {
    if (window.gtag) {
        window.gtag('event', eventName, params);
    }
}

// Event names as constants to avoid typos
export const CHAT_EVENTS = {
    SESSION_STARTED: 'chat_session_started',
    WIDGET_OPENED: 'chat_widget_opened',
    WIDGET_CLOSED: 'chat_widget_closed',
    MESSAGE_SENT: 'chat_message_sent'
}; 