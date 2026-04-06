import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, Question } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/quizzes';

  // Quiz endpoints
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }

  getQuiz(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  createQuiz(quiz: Omit<Quiz, 'id'>): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz);
  }

  updateQuiz(id: number, quiz: Omit<Quiz, 'id'>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Questions in Quiz endpoints
  getQuizQuestions(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${quizId}/questions`);
  }

  addQuestion(quizId: number, question: Omit<Question, 'id'>): Observable<Quiz> {
    return this.http.post<Quiz>(
      `${this.apiUrl}/${quizId}/questions`,
      question
    );
  }

  deleteQuestionFromQuiz(quizId: number, questionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${quizId}/questions/${questionId}`
    );
  }

  // Standalone Question endpoints
  getQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${id}`);
  }

  updateQuestion(id: number, question: Omit<Question, 'id'>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}`);
  }
}
