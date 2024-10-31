import { DiaryEntry } from '../types';
import Diary from './Diary';

interface DiariesProps {
  diaries: DiaryEntry[];
}

const Diaries = ({ diaries }: DiariesProps) => {
  return (
    <>
      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <Diary key={diary.id} diary={diary} />
      ))}
    </>
  );
};

export default Diaries;
