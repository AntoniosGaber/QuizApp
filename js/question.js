import { allQuestion } from './index.js';
import { quiz } from './index.js';


function decodeHTML(str = '') {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}


function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export class Question {
  constructor(index) {
    this.index = index;

    const row = allQuestion[this.index];

    this.category         = decodeHTML(row.category);
    this.QuestionLength   = allQuestion.length;
    this.question         = decodeHTML(row.question);
    this.incorrectAnswers = (row.incorrect_answers || []).map(decodeHTML);
    this.correctAnswer    = decodeHTML(row.correct_answer);
    this.answered         = false;

    this.allChoices = shuffle([this.correctAnswer, ...this.incorrectAnswers]);

    
    this.container = document.getElementById('question-container');
  }

  renderTemplate() {
    return `
      <div class="question shadow-lg col-lg-12 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions">${this.index + 1} of ${this.QuestionLength}</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap gap-2 text-center">
          ${this.allChoices
            .map(
              (choice) => `
              <li class="flex-fill">
                <button type="button" class="btn btn-outline-primary w-100">${choice}</button>
              </li>`
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  displayQuestion() {
    if (!this.container) {
      console.error('Missing #question-container');
      return;
    }
    
    this.container.innerHTML = this.renderTemplate();

    
    const buttons = this.container.querySelectorAll('.choices button');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => this.checkAnswer(e.currentTarget));
    });
  }

  checkAnswer(userBtn) {
    if (this.answered) return;

    const userAnswer = userBtn.textContent;
    if (userAnswer === this.correctAnswer) {
      userBtn.classList.remove('btn-outline-primary');
      userBtn.classList.add('btn-success');
      quiz.score++;
    } else {
      userBtn.classList.remove('btn-outline-primary');
      userBtn.classList.add('btn-danger');

      
      const correctBtn = this.container.querySelector(
        `.choices button:not(.btn-danger)`
      );
      this.container.querySelectorAll('.choices button').forEach((b) => {
        if (b.textContent === this.correctAnswer) {
          b.classList.remove('btn-outline-primary');
          b.classList.add('btn-success');
        }
      });
    }

    this.answered = true;

    
    this.animateQuestion(userBtn);

  
    setTimeout(() => this.nextQuestion(), 900);
  }

  animateQuestion(element) {
    const card = element.closest('.question');
    if (!card) return;
    card.classList.remove('animate__bounceIn');
    card.classList.add('animate__backOutLeft');
  }

  nextQuestion() {
    const nextIndex = this.index + 1;
    if (nextIndex < allQuestion.length) {
      const newQuestion = new Question(nextIndex);
      newQuestion.displayQuestion();
    } else {
      this.finish();
    }
  }

  finish() {
    this.container.innerHTML = `
      <div id="tryAgainContainer" class="text-center text-white animate__animated animate__bounceIn">
        <h1 class="mb-3">Your Score is <span class="badge bg-success">${quiz.score}</span> / ${allQuestion.length}</h1>
        <button class="btn btn-danger" id="tryAgainBtn">Try Again</button>
      </div>
    `;
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    tryAgainBtn.addEventListener('click', () => window.location.reload());
  }
}

