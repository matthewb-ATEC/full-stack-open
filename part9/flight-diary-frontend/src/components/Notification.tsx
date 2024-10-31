import { RootState } from '../store';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification: string = useSelector(
    (state: RootState) => state.notification.message
  );
  const isError: boolean = useSelector(
    (state: RootState) => state.notification.isError
  );

  const defaultStyle = {
    color: 'green',
  };

  const errorStyle = {
    color: 'red',
  };

  if (!notification) return null;
  return <div style={isError ? errorStyle : defaultStyle}>{notification}</div>;
};

export default Notification;
