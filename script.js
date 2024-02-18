let correctAnswer = "", correctScore = askCount = 0, totalQuestion = 10;
let currentQuestionIndex = 0; // Índice de la pregunta actual

document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
    fetchQuestions();
});

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = 0;
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _questionIndex = document.getElementById('question-index'); // Elemento para mostrar el índice de la pregunta

function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartquiz);
}

async function fetchQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10';
    try {
        const result = await fetch(APIUrl);
        if (result.ok) {
            const data = await result.json();
            questionsArray = data.results;
            showNextQuestion();
        } else {
            console.error('Error al cargar las preguntas: ' + result.status);
        }
    } catch (error) {
        console.error('Error al cargar las preguntas:', error);
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < totalQuestion) {
        const question = questionsArray[currentQuestionIndex];
        showQuestion(question);
        updateQuestionIndex(); // Actualizar el índice de la pregunta
    } else {
        console.error('No hay más preguntas en el array');
    }
}

function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = optionsList.map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`).join('');
    selectOption();
}

function selectOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if (_options.querySelector('.selected')) {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
    console.log(correctAnswer);
}

function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class="fa-solid fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class="fa-solid fa-xmark"></i>Incorrect Answer!!!</p><p><small><b>Correct Answer:</b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!!</p>`;
        _checkBtn.disabled = false;
    }
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount() {
    askCount++;
    setCount();
    currentQuestionIndex++; // Incrementar el índice de la pregunta
    if (askCount == totalQuestion) {
        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(() => {
            _result.innerHTML = ''; // Limpiar el mensaje después de un tiempo determinado
            showNextQuestion();
        }, 1500); // Ocultar el mensaje después de 1.5 segundos
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartquiz() {
    correctScore = askCount = 0;
    currentQuestionIndex = 0; // Reiniciar el índice de la pregunta
    _playAgainBtn.style.display = 'none';
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    fetchQuestions();
    _result.innerHTML = '';
}

function updateQuestionIndex() {
    _questionIndex.textContent = `${currentQuestionIndex + 1}`; // Actualizar el texto del índice de la pregunta
}