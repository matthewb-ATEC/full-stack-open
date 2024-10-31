import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { Notification } from '../types';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', isError: false },
  reducers: {
    setNotification(state, action: PayloadAction<Notification>) {
      return action.payload;
    },
    removeNotification(state) {
      return { ...state, message: '' };
    },
  },
});

export const { setNotification, removeNotification } =
  notificationSlice.actions;

let timeoutId: number;
export const notifyWithTimeout = (
  message: string,
  timeInSeconds: number = 5,
  isError: boolean
) => {
  return (dispatch: AppDispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(setNotification({ message, isError }));

    timeoutId = setTimeout(() => {
      dispatch(removeNotification());
    }, timeInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
