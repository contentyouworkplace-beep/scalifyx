// Browser Web Push Notifications
import { apiFetch } from './api';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
}

export async function registerAdminForNotifications(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Browser does not support service workers or push notifications');
    return false;
  }

  try {
    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return false;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js');

    // Get VAPID public key from backend
    const vapidResponse = await apiFetch('/notifications/vapid-public-key');
    if (!vapidResponse.key) {
      throw new Error('Failed to get VAPID public key');
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidResponse.key) as BufferSource,
    });

    // Send subscription to backend
    const saveResponse = await apiFetch('/notifications/subscribe-web', {
      method: 'POST',
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    });

    return saveResponse.success || false;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    return false;
  }
}

export async function unsubscribeFromNotifications(endpoint: string): Promise<boolean> {
  try {
    const response = await apiFetch('/notifications/unsubscribe-web', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint }),
    });
    return response.success || false;
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    return false;
  }
}

// Helper function to convert VAPID public key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if notifications are supported and enabled
export function notificationsSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

export function notificationsEnabled(): boolean {
  return notificationsSupported() && Notification.permission === 'granted';
}
