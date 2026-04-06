import { Routes } from '@angular/router';
import { QuizList } from './components/quiz-list/quiz-list';
import { QuizDetail } from './components/quiz-detail/quiz-detail';

export const routes: Routes = [
	{
		path: '',
		component: QuizList,
	},
	{
		path: 'quiz/:id',
		component: QuizDetail,
	},
];
