// Utility function to safely push events to dataLayer
export function pushToDataLayer(eventObject) {
    if (typeof window.dataLayer !== 'undefined' && window.dataLayer instanceof Array) {
        window.dataLayer.push(eventObject);
    }
}

// Initialize Google Analytics with tracking ID
export function initializeGoogleAnalytics(trackingId) {
    if (!trackingId) return;
    
    // Create dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Initialize gtag
    window.gtag = function() {
        window.dataLayer.push(arguments);
    }
    
    // Configure gtag
    window.gtag('js', new Date());
    window.gtag('config', trackingId);
}

// Event names as constants to avoid typos
export const CHAT_EVENTS = {
    SESSION_STARTED: 'chat_session_started',
    WIDGET_OPENED: 'chat_widget_opened',
    WIDGET_CLOSED: 'chat_widget_closed',
    MESSAGE_SENT: 'chat_message_sent'
}; 