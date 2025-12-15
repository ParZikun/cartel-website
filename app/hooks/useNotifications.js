'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export function useNotifications() {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Only run if authenticated and user settings allow it
        if (!isAuthenticated || !user) return;

        // Note: In a real app, we should check user.settings.push_enabled here.
        // For now, we'll assume if they granted browser permission, they want them.

        // 1. Request Browser Permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // 2. Connect to SSE
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/events`);

        eventSource.onopen = () => {
            console.log("SSE: Connected to Notification Stream");
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Data comes in as a list of deals: [ { name: "", price_amount: ... }, ... ]

                // Identify "New" items (Simple logic: If list is sent, notify about the top 1 if it's high tier)
                // A better logic requires client-side tracking of "seen" IDs.
                // For Alpha: Just toast/notify generically or the first item.

                if (Array.isArray(data) && data.length > 0) {
                    const topDeal = data[0];

                    // Only notify if it's a "Great Deal" (Gold/AutoBuy)
                    if (topDeal.cartel_category === 'AUTOBUY' || topDeal.cartel_category === 'GOOD') {
                        triggerNotification(topDeal);
                    }
                }

            } catch (e) {
                console.error("SSE Parse Error:", e);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [isAuthenticated, user]);
}

// Uses the user-provided "Pikachu" sound
const playNotificationSound = () => {
    try {
        const audio = new Audio('/pikachu_cute.mp3');
        audio.volume = 0.6; // Slightly louder for Pikachu
        audio.play().catch(e => console.warn("Audio play prevented:", e));
    } catch (e) {
        console.error("Audio error:", e);
    }
};

function triggerNotification(deal) {
    playNotificationSound();
    const title = `🔥 Snipe Alert: ${deal.name}`;
    const options = {
        body: `Found ${deal.grade || ''} @ ${deal.price_amount} SOL\nval: ${deal.alt_value} SOL`,
        icon: deal.img_url || '/icon-192x192.png', // Ensure this exists or use remote
        badge: '/icon-192x192.png'
    };

    // 1. Browser Native Notification (Background)
    if (Notification.permission === 'granted') {
        new Notification(title, options);
    }
    // 2. In-App Toast (Foreground)
    else {
        toast.success(title, { description: options.body });
    }
}
