import { PerformanceEvaluationInterface } from 'interfaces/performance-evaluation';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface PlayerInterface {
  id?: string;
  user_id: string;
  academy_id: string;
  position: string;
  skills: string;
  created_at?: any;
  updated_at?: any;
  performance_evaluation?: PerformanceEvaluationInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {
    performance_evaluation?: number;
  };
}

export interface PlayerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  academy_id?: string;
  position?: string;
  skills?: string;
}
