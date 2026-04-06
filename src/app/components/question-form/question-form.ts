import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Question } from '../../models';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-question-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './question-form.html',
  styleUrl: './question-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly quizId = signal<number | null>(null);
  protected readonly questionId = signal<number | null>(null);

  protected readonly isEditMode = computed(() => this.questionId() !== null);

  protected readonly form = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(3)]],
    answer: ['', [Validators.required, Validators.minLength(1)]],
    options: this.fb.array([
      this.fb.control('', [Validators.required, Validators.minLength(1)]),
      this.fb.control('', [Validators.required, Validators.minLength(1)]),
    ]),
  });

  ngOnInit(): void {
    const quizIdParam = this.route.snapshot.paramMap.get('quizId');
    const questionIdParam = this.route.snapshot.paramMap.get('questionId');

    if (quizIdParam !== null) {
      const parsedQuizId = Number(quizIdParam);
      if (!Number.isNaN(parsedQuizId)) {
        this.quizId.set(parsedQuizId);
      }
    }

    if (questionIdParam !== null) {
      const parsedQuestionId = Number(questionIdParam);
      if (Number.isNaN(parsedQuestionId)) {
        this.error.set('Identifiant de question invalide.');
        return;
      }

      this.questionId.set(parsedQuestionId);
      this.loadQuestion(parsedQuestionId);
      return;
    }

    if (this.quizId() === null) {
      this.error.set('Impossible d\'ajouter une question sans quiz cible.');
    }
  }

  protected get optionsArray(): FormArray {
    return this.form.get('options') as FormArray;
  }

  protected addOption(): void {
    this.optionsArray.push(this.fb.control('', [Validators.required, Validators.minLength(1)]));
  }

  protected removeOption(index: number): void {
    if (this.optionsArray.length <= 2) {
      return;
    }

    this.optionsArray.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const options = (Array.isArray(value.options) ? value.options : []).filter(
      (option: unknown): option is string => typeof option === 'string' && option.trim().length > 0
    );

    const payload: Omit<Question, 'id'> = {
      text: value.text ?? '',
      answer: value.answer ?? '',
      options,
    };

    if (!payload.options.includes(payload.answer)) {
      this.error.set('La bonne reponse doit correspondre a une option.');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const currentQuestionId = this.questionId();
    const currentQuizId = this.quizId();

    if (currentQuestionId !== null) {
      this.quizService.updateQuestion(currentQuestionId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.navigateAfterSave();
        },
        error: () => {
          this.error.set('La mise a jour de la question a echoue.');
          this.saving.set(false);
        },
      });
      return;
    }

    if (currentQuizId === null) {
      this.error.set('Quiz cible manquant pour ajouter la question.');
      this.saving.set(false);
      return;
    }

    this.quizService.addQuestion(currentQuizId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.navigateAfterSave();
      },
      error: () => {
        this.error.set('L\'ajout de la question a echoue.');
        this.saving.set(false);
      },
    });
  }

  private loadQuestion(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.quizService.getQuestion(id).subscribe({
      next: (question) => {
        this.form.patchValue({
          text: question.text,
          answer: question.answer,
        });

        this.optionsArray.clear();
        const options = question.options.length > 0 ? question.options : ['', ''];
        for (const option of options) {
          this.optionsArray.push(this.fb.control(option, [Validators.required, Validators.minLength(1)]));
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger la question.');
        this.loading.set(false);
      },
    });
  }

  private navigateAfterSave(): void {
    const currentQuizId = this.quizId();
    if (currentQuizId !== null) {
      this.router.navigateByUrl(`/quiz/${currentQuizId}`);
      return;
    }

    this.router.navigateByUrl('/');
  }
}
