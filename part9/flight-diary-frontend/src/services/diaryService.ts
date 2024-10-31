import axios from 'axios';
import { DiaryEntry } from '../types';
const baseUrl = '/api/diaries';

const get = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export default { get };
