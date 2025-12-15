'use client';

import { useNotifications } from '../hooks/useNotifications';

export default function NotificationListener() {
    useNotifications();
    return null; // Render nothing, just run logic
}
