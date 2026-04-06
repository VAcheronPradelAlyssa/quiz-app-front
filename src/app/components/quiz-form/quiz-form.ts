import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Question, Quiz } from '../../models';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-quiz-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './quiz-form.html',
  styleUrl: './quiz-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly quizId = signal<number | null>(null);

  protected readonly isEditMode = computed(() => this.quizId() !== null);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    questions: this.fb.array<FormGroup>([]),
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      const parsedId = Number(idParam);
      if (Number.isNaN(parsedId)) {
        this.error.set('Identifiant invalide.');
        return;
      }

      this.quizId.set(parsedId);
      this.loadQuiz(parsedId);
      return;
    }

    this.addQuestion();
  }

  protected get questionsArray(): FormArray<FormGroup> {
    return this.form.get('questions') as FormArray<FormGroup>;
  }

  protected optionsArrayAt(questionIndex: number): FormArray {
    return this.questionsArray.at(questionIndex).get('options') as FormArray;
  }

  protected asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  protected addQuestion(question?: Partial<Question>): void {
    const optionsArray = this.fb.array(
      (question?.options?.length ? question.options : ['', '']).map((option) =>
        this.fb.control(option, [Validators.required, Validators.minLength(1)])
      )
    );

    const questionGroup = this.fb.group({
      text: [question?.text ?? '', [Validators.required, Validators.minLength(3)]],
      answer: [question?.answer ?? '', [Validators.required, Validators.minLength(1)]],
      options: optionsArray,
    });

    this.questionsArray.push(questionGroup);
  }

  protected removeQuestion(index: number): void {
    this.questionsArray.removeAt(index);
  }

  protected addOption(questionIndex: number): void {
    this.optionsArrayAt(questionIndex).push(
      this.fb.control('', [Validators.required, Validators.minLength(1)])
    );
  }

  protected removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.optionsArrayAt(questionIndex);

    if (options.length <= 2) {
      return;
    }

    options.removeAt(optionIndex);
  }

  protected submit(): void {
    if (this.form.invalid || this.questionsArray.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: Omit<Quiz, 'id'> = {
      title: value.title ?? '',
      questions: value.questions.map((q) => ({
        text: q['text'] ?? '',
        options: (Array.isArray(q['options']) ? q['options'] : []).filter(
          (option: unknown): option is string => typeof option === 'string'
        ),
        answer: q['answer'] ?? '',
      })),
    };

    this.saving.set(true);
    this.error.set('');

    const currentQuizId = this.quizId();

    if (this.isEditMode() && currentQuizId !== null) {
      this.quizService.updateQuiz(currentQuizId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.error.set('La mise a jour du quiz a echoue.');
          this.saving.set(false);
        },
      });

      return;
    }

    this.quizService.createQuiz(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.error.set('La creation du quiz a echoue.');
        this.saving.set(false);
      },
    });
  }

  private loadQuiz(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.quizService.getQuiz(id).subscribe({
      next: (quiz) => {
        this.form.patchValue({ title: quiz.title });
        this.questionsArray.clear();

        for (const question of quiz.questions) {
          this.addQuestion(question);
        }

        if (quiz.questions.length === 0) {
          this.addQuestion();
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger le quiz a editer.');
        this.loading.set(false);
      },
    });
  }
}
