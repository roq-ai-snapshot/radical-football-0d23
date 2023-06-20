import { PerformanceEvaluationInterface } from 'interfaces/performance-evaluation';
import { AcademyInterface } from 'interfaces/academy';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TrainingSessionInterface {
  id?: string;
  academy_id: string;
  coach_id: string;
  date: any;
  duration: number;
  location: string;
  created_at?: any;
  updated_at?: any;
  performance_evaluation?: PerformanceEvaluationInterface[];
  academy?: AcademyInterface;
  user?: UserInterface;
  _count?: {
    performance_evaluation?: number;
  };
}

export interface TrainingSessionGetQueryInterface extends GetQueryInterface {
  id?: string;
  academy_id?: string;
  coach_id?: string;
  location?: string;
}
