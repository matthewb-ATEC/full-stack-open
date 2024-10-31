import { useEffect, useState } from 'react';
import Diaries from './components/Diaries';
import { DiaryEntry, NewDiaryEntry } from './types';
import diaryService from './services/diaryService';
import DiaryForm from './components/DiaryForm';
import Notification from './components/Notification';
import { useDispatch } from 'react-redux';
import { notifyWithTimeout } from './reducers/notificationReducer';
import { AppDispatch } from './store';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    diaryService
      .get()
      .then((diaries: DiaryEntry[]) => {
        setDiaries(diaries);
      })
      .catch((error: unknown) => console.log(error));
  }, []);

  const addDiary = async (newDiary: NewDiaryEntry) => {
    try {
      const result = await diaryService.create(newDiary);
      if (result) {
        setDiaries(diaries.concat(result));
        dispatch(notifyWithTimeout('Diary added successfully', 5, false));
      }
    } catch (error: unknown) {
      let errorMessage = 'Something bad happened.';
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data || 'An unknown error occurred';
        errorMessage = serverMessage;
      } else if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message; // Fallback for general errors
      }
      dispatch(notifyWithTimeout(errorMessage, 5, true));
    }
  };

  if (diaries.length === 0) return <div>Loading...</div>;

  return (
    <>
      <h1>Ilari's Flight Diaries</h1>
      <Notification />
      <DiaryForm addDiary={addDiary} />
      <Diaries diaries={diaries} />
    </>
  );
};

export default App;
