let question = [];
let answeredQuestion = {};
let questionIndex = 0;
let score = 0;
let questionsAnswered = 0;
let totalQuestions = 0;
let incorrectAnswers = 0;
let correctAnswers = 0;

clearRadiosInput();

function createCardQuestions(question, questionIndex) {
  const section = document.getElementById("mainQuestions");
  if (!section) {
    console.error("No existe el elemento con id 'mainQuestions' en el DOM");
    return;
  }
  section.innerHTML = "";

  const main = document.createElement("div");
  main.className = "container-fluid container-main";
  main.id = "mainContainer";
  main.innerHTML = `
  <div class="card" style="width: 100%">
          <div
            class="card-body p-4"
            style="background-color: rgba(187, 199, 209, 0.781)"
          >
            <h5 class="card-title p-1" style="display: inline">Question</h5>
            <h5 style="display: inline" id="questionNumber">#</h5>
            <h2 class="p-2" id="questionDescription">Question</h2>
            <div class="row">
              <div class="col-sm-5 col-md-6">
                <div class="form-check">
                  <input
                    class="btn-check"
                    type="radio"
                    name="answer"
                    id="answer_a"
                    value="answer_a"
                  />
                  <label
                    class="btn btn-outline-secondary text-start"
                    for="answer_a"
                    id="answer1Label"
                    style="width: 100%"
                  >
                    <p style="display: inline">A)</p>
                    <p id ="answer1Text"style="display: inline"></p>
                  </label>
                </div>
              </div>
              <div class="col-sm-5 col-md-6">
                <div class="form-check">
                  <input
                    class="btn-check"
                    type="radio"
                    name="answer"
                    id="answer_b"
                    value="answer_b"
                  />
                  <label
                    class="btn btn-outline-secondary text-start"
                    for="answer_b"
                    id="answer2Label"
                    style="width: 100%"
                  >
                    <p style="display: inline">B)</p>
                    <p id ="answer2Text" style="display: inline"></p>
                  </label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-5 col-md-6">
                <div class="form-check">
                  <input
                    class="btn-check"
                    type="radio"
                    name="answer"
                    id="answer_c"
                    value="answer_c"
                  />
                  <label
                    class="btn btn-outline-secondary text-start"
                    for="answer_c"
                    id="answer3Label"
                    style="width: 100%"
                  >
                    <p style="display: inline">C)</p>
                    <p id ="answer3Text" style="display: inline"></p>
                  </label>
                </div>
              </div>
              <div class="col-sm-5 col-md-6">
                <div class="form-check">
                  <input
                    class="btn-check"
                    type="radio"
                    name="answer"
                    id="answer_d"
                    value="answer_d"
                  />
                  <label
                    class="btn btn-outline-secondary text-start"
                    for="answer_d"
                    id="answer4Label"
                    style="width: 100%"
                  >
                    <p style="display: inline">D)</p>
                    <p id ="answer4Text" style="display: inline"></p>
                  </label>
                </div>
              </div>
            </div>
            <div class="text-center pt-4">
              <button id="checkBtn" class="btn btn-primary">Check</button>
            </div>
          </div>
        </div>`;
  section.appendChild(main);

  const questionNumber = document.getElementById("questionNumber");
  questionNumber.textContent = Number(questionIndex) + 1;

  const questionDescription = document.getElementById("questionDescription");

  const answer1 = document.getElementById("answer1Text");

  const answer2 = document.getElementById("answer2Text");

  const answer3 = document.getElementById("answer3Text");

  const answer4 = document.getElementById("answer4Text");

  questionDescription.textContent = decodeHtmlEntities(question.question);
  answer1.textContent = decodeHtmlEntities(question.answers.answer_a || "");
  answer2.textContent = decodeHtmlEntities(question.answers.answer_b || "");
  answer3.textContent = decodeHtmlEntities(question.answers.answer_c || "");
  answer4.textContent = decodeHtmlEntities(question.answers.answer_d || "");

  const checkBtn = document.getElementById("checkBtn");

  const selectedAnswer = answeredQuestion[questionIndex];
  if (selectedAnswer) {
    const valueToCheck = selectedAnswer.selected || selectedAnswer;
    const radioToCheck = document.querySelector(
      `input[value="${valueToCheck}"]`
    );
    if (radioToCheck) {
      radioToCheck.checked = true;
    }

    if (selectedAnswer.checked) {
      // Ya chequeada → deshabilitar botones y mostrar estilos
      const correctValue = question.correct_answer;
      const allAnswers = ["answer_a", "answer_b", "answer_c", "answer_d"];
      allAnswers.forEach((ansKey) => {
        const label = document.querySelector(`label[for=${ansKey}]`);
        if (!label) return;
        label.classList.remove("correct-answer", "incorrect-answer");
        if (ansKey === correctValue) {
          label.classList.add("correct-answer");
        } else {
          label.classList.add("incorrect-answer");
        }
      });

      const radios = document.querySelectorAll('input[name="answer"]');
      radios.forEach((radio) => (radio.disabled = true));

      if (checkBtn) checkBtn.disabled = true;
    } else {
      // Si está seleccionada pero no chequeada → habilitar botón Check
      if (checkBtn) checkBtn.disabled = false;
    }
  } else {
    // No hay respuesta seleccionada → deshabilitar botón Check
    if (checkBtn) checkBtn.disabled = true;
  }

  // Obtiene todos los radios
  const radios = document.querySelectorAll('input[name="answer"]');

  // Agrega evento para habilitar el botón cuando se selecciona una respuesta
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      answeredQuestion[questionIndex] = {
        selected: radio.value,
        checked: false, // no está chequeada aún
      };
      const nextBtn = document.getElementById("nextBtn");
      if (nextBtn) {
        nextBtn.disabled = false;
      }
      if (checkBtn) {
        checkBtn.disabled = false; // ahora sí habilitamos el botón cuando hay selección
      }
    });
  });

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      const selectedRadio = document.querySelector(
        "input[name=answer]:checked"
      );

      if (!selectedRadio) return;
      const selectedValue = selectedRadio.value;
      const correctValue = question.correct_answer;

      // Actualiza conteo de respuestas contestadas
      questionsAnswered++;

      // Actualiza conteo de respuestas correctas / incorrectas
      if (selectedValue === correctValue) {
        correctAnswers++;
        score = Math.round((correctAnswers / questionsAnswered) * 100);
      } else {
        incorrectAnswers++;
        score = Math.round((correctAnswers / questionsAnswered) * 100);
      }

      // Actualiza los números en el footer (los elementos HTML)
      document.getElementById("score").textContent = score;
      document.getElementById("questionsAnsweredNumber").textContent =
        questionsAnswered;
      document.getElementById("questionsLess").textContent = totalQuestions;
      document.getElementById("incorrectAnswerNumber").textContent =
        incorrectAnswers;
      document.getElementById("correctAnswerNumber").textContent =
        correctAnswers;

      //Marcar respuesta correcta
      answeredQuestion[questionIndex] = {
        selected: selectedValue,
        checked: true,
      };
      const correctLabel = document.querySelector(
        `label[for = ${correctValue}]`
      );
      if (correctLabel) {
        correctLabel.classList.add("correct-answer");
      }

      //Marcar respuestas incorrectas
      const allAnswers = ["answer_a", "answer_b", "answer_c", "answer_d"];
      allAnswers.forEach((ansKey) => {
        if (ansKey !== correctValue) {
          const label = document.querySelector(`label[for=${ansKey}]`);
          if (label) {
            label.classList.add("incorrect-answer");
          }
        }
      });
      checkBtn.disabled = true;

      const radios = document.querySelectorAll(`input[name='answer']`);
      radios.forEach((radio) => {
        radio.disabled = true;
      });
    });
  }
}

function getQuestionsLocal() {
  document.getElementById("score").textContent = score;
  document.getElementById("questionsAnsweredNumber").textContent =
    questionsAnswered;

  document.getElementById("incorrectAnswerNumber").textContent =
    incorrectAnswers;
  document.getElementById("correctAnswerNumber").textContent = correctAnswers;
  questionIndex = 0;
  createCardQuestions(question[questionIndex], questionIndex);
}

function nextQuestion() {
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (questionIndex < question.length - 1) {
        questionIndex++;
        createCardQuestions(question[questionIndex], questionIndex);
        updateButtons();
      } else {
        alert("Ya no hay más preguntas.");
      }
    });
  }
}

function prevQuestion() {
  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (questionIndex > 0) {
        questionIndex--;
        createCardQuestions(question[questionIndex], questionIndex);
        updateButtons();
      }
    });
  }
}

function updateButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = questionIndex === 0;
  nextBtn.disabled = questionIndex === question.length - 1;
}

function createQuestionDocument() {
  document.addEventListener("DOMContentLoaded", () => {
    createCardQuestions();
  });
}

function clearRadiosInput() {
  window.addEventListener("load", () => {
    const radios = document.querySelectorAll('input[name="answer"]');
    radios.forEach((radio) => (radio.checked = false));
  });
}

function init() {
  getQuestionsFromOpenTDB();
  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) prevBtn.disabled = questionIndex === 0;
  updateButtons();
  nextQuestion();
  prevQuestion();
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  const reloadBtn = document.getElementById("reloadBtn");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", () => {
      location.reload();
    });
  }
});
function getQuestionsFromOpenTDB() {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "block"; // mostrar loading
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then((res) => res.json())
    .then((data) => {
      if (!data || !Array.isArray(data.results)) {
        alert("Error getting questions, please CLick on Restar Quiz");
        throw new Error("API response inválida: no se encontraron preguntas");
      }

      console.log("Datos recibidos de la API:", data);
      // Adaptar la estructura
      question = data.results.map((q) => {
        const answers = [...q.incorrect_answers, q.correct_answer];
        // Barajar respuestas
        answers.sort(() => Math.random() - 0.5);

        const answerMap = {
          answer_a: answers[0],
          answer_b: answers[1],
          answer_c: answers[2],
          answer_d: answers[3],
        };

        const correctIndex = Object.entries(answerMap).find(
          ([_, val]) => val === q.correct_answer
        )[0];

        return {
          question: q.question,
          answers: answerMap,
          correct_answer: correctIndex,
        };
      });

      questionIndex = 0;

      totalQuestions = question.length;
      document.getElementById("questionsLess").textContent = totalQuestions;
      createCardQuestions(question[questionIndex], questionIndex);
    })
    .catch((err) => {
      console.error("Error loading OpenTDB questions:", err);
    })
    .finally(() => {
      if (loading) loading.style.display = "none";
    });
}
