import { PlayerInterface } from 'interfaces/player';
import { TrainingSessionInterface } from 'interfaces/training-session';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AcademyInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  player?: PlayerInterface[];
  training_session?: TrainingSessionInterface[];
  user?: UserInterface;
  _count?: {
    player?: number;
    training_session?: number;
  };
}

export interface AcademyGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
