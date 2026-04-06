import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { QuizDetail } from './quiz-detail';
import { QuizService } from '../../services/quiz';

class QuizServiceMock {
  getQuiz() {
    return of({
      id: 1,
      title: 'Demo Quiz',
      questions: [
        {
          id: 1,
          text: 'Question 1',
          options: ['A', 'B'],
          answer: 'A',
        },
      ],
    });
  }
}

describe('QuizDetail', () => {
  let component: QuizDetail;
  let fixture: ComponentFixture<QuizDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizDetail],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        {
          provide: QuizService,
          useClass: QuizServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
