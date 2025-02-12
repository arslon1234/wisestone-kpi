import { message } from "antd"

type MessageType = "success" | "info" | "warning" | "error"

export const Notification = (type: MessageType, content: string, duration: number = 2) => {
  message.open({
    type,
    content,
    duration,
  })
}

