import { PlayerInterface } from 'interfaces/player';
import { UserInterface } from 'interfaces/user';
import { TrainingSessionInterface } from 'interfaces/training-session';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceEvaluationInterface {
  id?: string;
  player_id: string;
  coach_id: string;
  training_session_id: string;
  rating: number;
  comments?: string;
  created_at?: any;
  updated_at?: any;

  player?: PlayerInterface;
  user?: UserInterface;
  training_session?: TrainingSessionInterface;
  _count?: {};
}

export interface PerformanceEvaluationGetQueryInterface extends GetQueryInterface {
  id?: string;
  player_id?: string;
  coach_id?: string;
  training_session_id?: string;
  comments?: string;
}
