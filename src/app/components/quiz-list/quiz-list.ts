import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Quiz } from '../../models';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-quiz-list',
  imports: [RouterLink],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizList implements OnInit {
  private readonly quizService = inject(QuizService);

  protected readonly quizzes = signal<Quiz[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.loadQuizzes();
  }

  protected loadQuizzes(): void {
    this.loading.set(true);
    this.error.set('');

    this.quizService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes.set(quizzes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les quiz. Vérifiez que le backend est bien démarré.');
        this.loading.set(false);
      },
    });
  }
}
