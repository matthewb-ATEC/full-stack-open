import { useState } from 'react';
import { NewDiaryEntry, Visibility, Weather } from '../types';

interface DiaryFormProps {
  addDiary: (newDiary: NewDiaryEntry) => Promise<void>;
}

const DiaryForm = ({ addDiary }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary: NewDiaryEntry = {
      date: date,
      visibility: visibility,
      weather: weather,
      comment: comment,
    };
    addDiary(newDiary);
    setDate('');
    setVisibility(Visibility.Great);
    setWeather(Weather.Sunny);
    setComment('');
  };
  return (
    <>
      <h2>Add new entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />
        </div>
        <div>
          visibility
          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          >
            {Object.values(Visibility).map((vis) => (
              <option key={vis} value={vis}>
                {vis}
              </option>
            ))}
          </select>
        </div>
        <div>
          weather
          <select
            value={weather}
            onChange={(event) => setWeather(event.target.value as Weather)}
          >
            {Object.values(Weather).map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div>
          comment
          <input
            type="text"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </>
  );
};

export default DiaryForm;
