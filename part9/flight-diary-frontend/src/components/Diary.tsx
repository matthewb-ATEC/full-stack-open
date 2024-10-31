import { DiaryEntry } from '../types';

interface DiaryProps {
  diary: DiaryEntry;
}

const Diary = ({ diary }: DiaryProps) => {
  return (
    <>
      <div>
        <h3>Date: {diary.date}</h3>
        <div>Weather: {diary.weather}</div>
        <div>Visibility: {diary.visibility}</div>
      </div>
      <br />
    </>
  );
};

export default Diary;
