import axios from 'axios';
import queryString from 'query-string';
import { TrainingSessionInterface, TrainingSessionGetQueryInterface } from 'interfaces/training-session';
import { GetQueryInterface } from '../../interfaces';

export const getTrainingSessions = async (query?: TrainingSessionGetQueryInterface) => {
  const response = await axios.get(`/api/training-sessions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTrainingSession = async (trainingSession: TrainingSessionInterface) => {
  const response = await axios.post('/api/training-sessions', trainingSession);
  return response.data;
};

export const updateTrainingSessionById = async (id: string, trainingSession: TrainingSessionInterface) => {
  const response = await axios.put(`/api/training-sessions/${id}`, trainingSession);
  return response.data;
};

export const getTrainingSessionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/training-sessions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTrainingSessionById = async (id: string) => {
  const response = await axios.delete(`/api/training-sessions/${id}`);
  return response.data;
};
