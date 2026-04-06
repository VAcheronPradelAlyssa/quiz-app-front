import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { QuizForm } from './quiz-form';
import { QuizService } from '../../services/quiz';

class QuizServiceMock {
  getQuiz() {
    return of({ id: 1, title: 'Quiz', questions: [] });
  }

  createQuiz() {
    return of({ id: 1, title: 'Quiz', questions: [] });
  }

  updateQuiz() {
    return of({ id: 1, title: 'Quiz', questions: [] });
  }
}

describe('QuizForm', () => {
  let component: QuizForm;
  let fixture: ComponentFixture<QuizForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizForm],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
        {
          provide: QuizService,
          useClass: QuizServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
