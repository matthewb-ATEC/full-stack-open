interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps) => {
  if (!message) return null;
  return <div>{message}</div>;
};

export default Notification;
