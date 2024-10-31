import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';
const baseUrl = '/api/diaries';

const get = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

const create = async (newDiary: NewDiaryEntry) => {
  const response = await axios.post<DiaryEntry>(baseUrl, newDiary);
  return response.data;
};

export default { get, create };
