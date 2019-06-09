import { PushNotificationIOS } from "react-native";
import reactNativePushNotification from "react-native-push-notification";

reactNativePushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification(notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }
});

export const pushNotification = reactNativePushNotification;
