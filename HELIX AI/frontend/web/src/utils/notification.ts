export const requestNotificationPermission = async () => {
   if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return false;
   }

   if (Notification.permission === "granted") {
      return true;
   }

   const permission = await Notification.requestPermission();
   return permission === "granted";
};

export const sendNotification = (title: string, body: string, icon?: string) => {
   if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
   }

   const notification = new Notification(title, {
      body,
      icon: icon || '/logo192.png', // Fallback to a default icon
   });

   notification.onclick = () => {
      window.focus();
      // Redirect to chat with a proactive flag
      window.location.href = '/chat?checkin=true';
   };
};
