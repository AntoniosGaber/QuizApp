// ///////////////////////////////// start app /////////////////////////////////
import { Quiz } from './quiz.js';
import { Question } from './question.js';

const categoryMenu      = document.getElementById('categoryMenu');
const difficultyOptions = document.getElementById('difficultyOptions');
const questionsNumber   = document.getElementById('questionsNumber');
const startQuiz         = document.getElementById('startQuiz');
const quizOptions       = document.getElementById('quizOptions');

export let allQuestion;
export let quiz;

startQuiz.addEventListener('click', async function () {
  
  quizOptions.classList.add('d-none');

  
  const amount = Math.max(1, Math.min(50, Number(questionsNumber.value) || 10));


  quiz = new Quiz(
    categoryMenu.value,
    difficultyOptions.value,
    amount
  );

  allQuestion = await quiz.getQuizQuestions();
  console.log('questions:', allQuestion);

  if (!Array.isArray(allQuestion) || allQuestion.length === 0) {
    alert('No questions returned. Try different options.');
    quizOptions.classList.remove('d-none');
    return;
  }

  
  const question = new Question(0);
  question.displayQuestion();
});
