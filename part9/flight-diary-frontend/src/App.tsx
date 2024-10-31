import { useEffect, useState } from 'react';
import Diaries from './components/Diaries';
import { DiaryEntry, NewDiaryEntry } from './types';
import diaryService from './services/diaryService';
import DiaryForm from './components/DiaryForm';
import Notification from './components/Notification';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState<string>('');

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
        diaries.concat(result);
        setNotification('Diary addded successfully.');
        setTimeout(() => {
          setNotification('');
        }, 5000);
      }
    } catch (error: unknown) {
      let errorMessage = 'Something bad happened.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      console.log(errorMessage);

      setNotification('Failed to add diary.');
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
  };

  if (diaries.length === 0) return <div>Loading...</div>;

  return (
    <>
      <h1>Ilari's Flight Diaries</h1>
      <Notification message={notification} />
      <DiaryForm addDiary={addDiary} />
      <Diaries diaries={diaries} />
    </>
  );
};

export default App;
