import { DiaryEntry } from '../types';

interface DiaryProps {
  diary: DiaryEntry;
}

const Diary = ({ diary }: DiaryProps) => {
  return (
    <>
      <div>
        <div>Date: {diary.date}</div>
        <div>Weather: {diary.weather}</div>
        <div>Visibility: {diary.visibility}</div>
      </div>
      <br />
    </>
  );
};

export default Diary;
