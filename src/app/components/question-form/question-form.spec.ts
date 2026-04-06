import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { QuestionForm } from './question-form';
import { QuizService } from '../../services/quiz';

class QuizServiceMock {
  getQuestion() {
    return of({
      id: 10,
      text: 'Question',
      options: ['A', 'B'],
      answer: 'A',
    });
  }

  updateQuestion() {
    return of({
      id: 10,
      text: 'Question',
      options: ['A', 'B'],
      answer: 'A',
    });
  }

  addQuestion() {
    return of({
      id: 1,
      title: 'Quiz',
      questions: [],
    });
  }
}

describe('QuestionForm', () => {
  let component: QuestionForm;
  let fixture: ComponentFixture<QuestionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionForm],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ quizId: '1' }),
            },
          },
        },
        {
          provide: QuizService,
          useClass: QuizServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
