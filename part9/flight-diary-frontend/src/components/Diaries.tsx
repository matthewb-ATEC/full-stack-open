import { DiaryEntry } from '../types';
import Diary from './Diary';

interface DiariesProps {
  diaries: DiaryEntry[];
}

const Diaries = ({ diaries }: DiariesProps) => {
  return (
    <>
      {diaries.map((diary) => (
        <Diary key={diary.id} diary={diary} />
      ))}
    </>
  );
};

export default Diaries;
