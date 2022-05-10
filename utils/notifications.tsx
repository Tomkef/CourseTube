import { X, Check } from "tabler-icons-react";

export const showErrorNotification = ({
  notifications,
  title,
  message,
  duration = 5000,
}: {
  notifications: any;
  title?: string;
  message: string;
  duration?: number;
}) => {
  notifications.showNotification({
    autoClose: duration,
    title: title,
    message: message,
    color: "red",
    icon: <X size={18} />,
  });
};

export const showSuccessNotification = ({
  notifications,
  title,
  message,
  duration = 5000,
}: {
  notifications: any;
  title?: string;
  message: string;
  duration?: number;
}) => {
  notifications.showNotification({
    autoClose: duration,
    title: title,
    message: message,
    color: "green",
    icon: <Check size={18} />,
  });
};
