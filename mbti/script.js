const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

let currentIndex = 0;
const answers = new Array(mbtiQuestions.length).fill(null);

function renderQuestion() {
  const q = mbtiQuestions[currentIndex];
  questionText.textContent = q.question;

  choicesContainer.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("div");
    btn.className = "choice-btn";
    btn.textContent = opt;
    if (answers[currentIndex] === idx) btn.classList.add("selected");
    btn.onclick = () => {
      answers[currentIndex] = idx;
      updateSelection();
      nextBtn.disabled = false;
    };
    choicesContainer.appendChild(btn);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === mbtiQuestions.length - 1 ? "کۆتایی" : "دواتر";
  nextBtn.disabled = answers[currentIndex] === null;
}

function updateSelection() {
  const buttons = choicesContainer.querySelectorAll(".choice-btn");
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("selected", answers[currentIndex] === idx);
  });
}

nextBtn.onclick = () => {
  if (answers[currentIndex] === null) {
    alert("Please select one option.");
    return;
  }

  if (currentIndex < mbtiQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    calculateResult();
  }
};

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

function calculateResult() {
  const functionScores = { Ti: 0, Te: 0, Fi: 0, Fe: 0, Ni: 0, Ne: 0, Si: 0, Se: 0 };

  // Weighted scoring: later questions count more (optional)
  answers.forEach((choiceIdx, qIdx) => {
    const func = mbtiQuestions[qIdx].functions[choiceIdx];
    if (func) {
      // Weight by question index (can tweak weight formula)
      functionScores[func] += 1 + qIdx * 0.1;
    }
  });

  // Sort functions by descending score
  const sortedFunctions = Object.entries(functionScores)
    .sort((a, b) => b[1] - a[1])
    .map(([fn]) => fn);

  const maxRank = sortedFunctions.length;

  // MBTI types mapped to cognitive function stacks
  const mbtiTypes = {
    INTP: ["Ti", "Ne", "Si", "Fe"],
    ISTP: ["Ti", "Se", "Ni", "Fe"],
    ENTP: ["Ne", "Ti", "Fe", "Si"],
    ENFP: ["Ne", "Fi", "Te", "Si"],
    ISFP: ["Fi", "Se", "Ni", "Te"],
    INFP: ["Fi", "Ne", "Si", "Te"],
    INTJ: ["Ni", "Te", "Fi", "Se"],
    INFJ: ["Ni", "Fe", "Ti", "Se"],
    ESTJ: ["Te", "Si", "Ne", "Fi"],
    ENTJ: ["Te", "Ni", "Se", "Fi"],
    ESFJ: ["Fe", "Si", "Ne", "Ti"],
    ENFJ: ["Fe", "Ni", "Se", "Ti"],
    ISTJ: ["Si", "Te", "Fi", "Ne"],
    ISFJ: ["Si", "Fe", "Ti", "Ne"],
    ESTP: ["Se", "Ti", "Fe", "Ni"],
    ESFP: ["Se", "Fi", "Te", "Ni"],
  };

  let bestType = null;
  let bestScore = Infinity;

  // Compare each MBTI type to your sorted function ranks
  for (const [type, stack] of Object.entries(mbtiTypes)) {
    let score = 0;
    for (let i = 0; i < stack.length; i++) {
      let rank = sortedFunctions.indexOf(stack[i]);
      if (rank === -1) rank = maxRank; // Penalize missing functions
      score += Math.abs(rank - i);
    }
    if (score < bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  // Redirect to results page with MBTI type in query string
  window.location.href = `result.html?type=${bestType}`;
}

renderQuestion();
