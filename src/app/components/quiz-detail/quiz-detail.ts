import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-quiz-detail',
  imports: [],
  templateUrl: './quiz-detail.html',
  styleUrl: './quiz-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);

  protected readonly quiz = signal<Quiz | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly currentIndex = signal(0);
  protected readonly selectedAnswers = signal<Record<number, string>>({});
  protected readonly finished = signal(false);

  protected readonly totalQuestions = computed(() => this.quiz()?.questions.length ?? 0);

  protected readonly currentQuestion = computed(() => {
    const currentQuiz = this.quiz();
    const index = this.currentIndex();

    if (!currentQuiz || currentQuiz.questions.length === 0) {
      return null;
    }

    return currentQuiz.questions[index] ?? null;
  });

  protected readonly answeredCount = computed(() => {
    const answers = this.selectedAnswers();
    return Object.keys(answers).length;
  });

  protected readonly score = computed(() => {
    const currentQuiz = this.quiz();
    if (!currentQuiz) {
      return 0;
    }

    const answers = this.selectedAnswers();
    let correct = 0;

    for (const question of currentQuiz.questions) {
      if (question.id === undefined) {
        continue;
      }

      if (answers[question.id] === question.answer) {
        correct += 1;
      }
    }

    return correct;
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const quizId = Number(idParam);

    if (!idParam || Number.isNaN(quizId)) {
      this.error.set('Identifiant du quiz invalide.');
      return;
    }

    this.loadQuiz(quizId);
  }

  protected selectOption(questionId: number | undefined, option: string): void {
    if (questionId === undefined || this.finished()) {
      return;
    }

    this.selectedAnswers.update((answers) => ({
      ...answers,
      [questionId]: option,
    }));
  }

  protected nextQuestion(): void {
    if (this.currentIndex() < this.totalQuestions() - 1) {
      this.currentIndex.update((index) => index + 1);
    }
  }

  protected previousQuestion(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((index) => index - 1);
    }
  }

  protected submitQuiz(): void {
    if (this.totalQuestions() === 0) {
      return;
    }

    this.finished.set(true);
  }

  protected restartQuiz(): void {
    this.currentIndex.set(0);
    this.selectedAnswers.set({});
    this.finished.set(false);
  }

  protected backToList(): void {
    this.router.navigateByUrl('/');
  }

  private loadQuiz(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.quizService.getQuiz(id).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Quiz introuvable ou backend inaccessible.');
        this.loading.set(false);
      },
    });
  }
}
