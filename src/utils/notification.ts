// src/utils/notification.ts
// import { notification } from 'antd';

// type NotificationType = 'success' | 'info' | 'warning' | 'error';

// export const Notification = (
//   type: NotificationType, 
//   message: string, 
//   description?: string
// ) => {
//   notification[type]({
//     message,
//     description,
//     placement: 'topRight', 
//     duration: 2,
//     showProgress:true,
//   });
// };

import { message } from "antd"

type MessageType = "success" | "info" | "warning" | "error"

export const Notification = (type: MessageType, content: string, duration: number = 2) => {
  message.open({
    type,
    content,
    duration,
  })
}

