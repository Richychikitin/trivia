// Variables globales
let correctAnswer = "", correctScore = askCount = 0, totalQuestion = 10;
let currentQuestionIndex = 0;
let difficulty = ""; // Se establecerá con la dificultad seleccionada

// Escuchar el evento de carga del DOM
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
});

// Obtener elementos del DOM
const _question = document.getElementById('question');
const _options = document.getElementById('quiz-options');
const _correctScore = 0;
const _totalQuestion = 10;
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _questionIndex = document.getElementById('question-index');
const _difficultySelect = document.getElementById('difficulty-select');
const _startQuizBtn = document.getElementById('start-quiz-btn');
const _quizBody = document.getElementById('quiz-body');
const _quizContainer = document.getElementById('quiz-container');
const _DifficultyBody = document.getElementById('difficulty-selection');

// Función para agregar event listeners
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartquiz);
    _startQuizBtn.addEventListener('click', startQuiz);
}

// Función para cargar preguntas desde la API
async function fetchQuestions() {
    const APIUrl = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`;
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

// Función para mostrar la siguiente pregunta
function showNextQuestion() {
    if (currentQuestionIndex < totalQuestion) {
        const question = questionsArray[currentQuestionIndex];
        showQuestion(question);
        updateQuestionIndex();
    } else {
        console.error('No hay más preguntas en el array');
    }
}

// Función para mostrar una pregunta
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

// Función para seleccionar una opción
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
}

// Función para verificar la respuesta
function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class="fa-solid fa-check"></i>Correct Answer!</p>`;
            _checkBtn.style.display = "none";
        } else {
            _result.innerHTML = `<p><i class="fa-solid fa-xmark"></i>Incorrect Answer!!!</p><p><small><b>Correct Answer:</b> ${correctAnswer}</small></p>`;
            _checkBtn.style.display = "none";
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!!</p>`;
        _checkBtn.disabled = false;
    }
}

// Función para decodificar texto HTML
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// Función para verificar el conteo de preguntas
function checkCount() {
    askCount++;
    setCount();
    currentQuestionIndex++;
    if (askCount == totalQuestion) {
        _result.innerHTML += `<p>Your score is ${correctScore * 100}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(() => {
            _result.innerHTML = '';
            showNextQuestion();
            _checkBtn.style.display = "block";
        }, 1500);
    }
}

// Función para actualizar el contador de preguntas
function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

// Función para reiniciar el quiz
function restartquiz() {
    correctScore = askCount = 0;
    currentQuestionIndex = 0;
    _playAgainBtn.style.display = 'none';
    _result.innerHTML = '';
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    fetchQuestions();
}

// Función para actualizar el índice de la pregunta actual   /${totalQuestion}
function updateQuestionIndex() {
    _questionIndex.textContent = `${currentQuestionIndex + 1}/${totalQuestion}`;
}

// Función para comenzar el quiz
function startQuiz() {
    difficulty = _difficultySelect.value;
    _difficultySelect.disabled = true; // Desactivar la selección de dificultad
    _startQuizBtn.disabled = true; // Desactivar el botón de inicio
    _quizBody.style.display="block" // Mostrar el contenedor del cuestionario
    _DifficultyBody.style.display="none"
    fetchQuestions();
}