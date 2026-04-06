import { Routes } from '@angular/router';
import { QuizList } from './components/quiz-list/quiz-list';
import { QuizDetail } from './components/quiz-detail/quiz-detail';
import { QuizForm } from './components/quiz-form/quiz-form';
import { QuestionForm } from './components/question-form/question-form';

export const routes: Routes = [
	{
		path: '',
		component: QuizList,
	},
	{
		path: 'quiz/new',
		component: QuizForm,
	},
	{
		path: 'quiz/:id/edit',
		component: QuizForm,
	},
	{
		path: 'quiz/:id',
		component: QuizDetail,
	},
	{
		path: 'quiz/:quizId/questions/new',
		component: QuestionForm,
	},
	{
		path: 'quiz/:quizId/questions/:questionId/edit',
		component: QuestionForm,
	},
];
