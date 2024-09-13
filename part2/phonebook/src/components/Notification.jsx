const Notification = ({ message }) => {
  const success = {
    background: "grey",
    border: "4px solid green",
    borderRadius: "8px",
    color: "green",
    fontSize: "32px",
    padding: "8px",
    margin: "8px 0",
  };

  if (message === null) return null;
  return <div style={success}>{message}</div>;
};

export default Notification;
