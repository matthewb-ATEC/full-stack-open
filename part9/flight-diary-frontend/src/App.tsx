import { useEffect, useState } from 'react';
import Diaries from './components/Diaries';
import { DiaryEntry } from './types';
import diaryService from './services/diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaryService
      .get()
      .then((diaries: DiaryEntry[]) => {
        setDiaries(diaries);
      })
      .catch((error: unknown) => console.log(error));
  }, []);

  if (diaries.length === 0) return <div>Loading...</div>;

  return (
    <>
      <h1>Ilari's Flight Diaries</h1>
      <Diaries diaries={diaries} />
    </>
  );
};

export default App;
