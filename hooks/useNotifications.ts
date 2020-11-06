import { useEffect } from 'react';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function useNotifications() {
  useEffect(() => {
    async function setNotifications() {
      const settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      // if allowed
      const isAllowed = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log(notifications)
      if (isAllowed && notifications.length === 0) {
        Notifications.scheduleNotificationAsync({
          identifier: 'dailyReminder',
          content: {
            title: 'Debe taze çıkmış olabilir 🙃'
          },
          trigger: {
            hour: 7,
            minute: 0,
            repeats: true
          },
        });
      }
    }
    setNotifications();
  }, []);
}