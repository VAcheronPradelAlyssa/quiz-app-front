import { Question } from './question.model';

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number; // en secondes
  passingScore?: number; // pourcentage
}
