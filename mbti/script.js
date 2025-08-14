const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const scaleContainer = document.getElementById("scale-container");
const scaleLevels = ["کەم", "مامناوەند", "زۆر", "زیاد لە پێویست"];

let currentIndex = 0;
const answers = new Array(mbtiQuestions.length).fill(null);
const functionScores = { Ti: 0, Te: 0, Fi: 0, Fe: 0, Ni: 0, Ne: 0, Si: 0, Se: 0 };

// Render the scale buttons
function renderScale(func, callback) {
  scaleContainer.innerHTML = "";
  scaleLevels.forEach((level, idx) => {
    const btn = document.createElement("div");
    btn.className = "scale-btn";
    btn.textContent = level;
    btn.onclick = () => {
      // mark selected visually
      scaleContainer.querySelectorAll(".scale-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      callback(idx); // send value back (0=کەم , 1=مامناوەند , 2=زۆر, 3=زیاتر لە زۆر)
    };
    scaleContainer.appendChild(btn);
  });
}

// Render current question and choices
function renderQuestion() {
  const q = mbtiQuestions[currentIndex];
  questionText.textContent = q.question;

  choicesContainer.innerHTML = "";
  scaleContainer.innerHTML = ""; // clear scale until a choice is clicked

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("div");
    btn.className = "choice-btn";
    btn.textContent = opt;

    if (answers[currentIndex] && answers[currentIndex].choiceIdx === idx) {
      btn.classList.add("selected");
      if (answers[currentIndex].scaleValue != null) {
        renderScale(q.functions[idx], () => {}); // keep scale visible if already chosen
      }
    }

    btn.onclick = () => {
      // When a choice is clicked, show scale buttons
      renderScale(q.functions[idx], (scaleValue) => {
        // Record the choice + scale value
        answers[currentIndex] = { choiceIdx: idx, scaleValue: scaleValue };
        functionScores[q.functions[idx]] += scaleValue; // add scale score
        updateSelection();
        nextBtn.disabled = false;
      });
    };

    choicesContainer.appendChild(btn);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === mbtiQuestions.length - 1 ? "کۆتایی" : "دواتر";
  nextBtn.disabled = !answers[currentIndex] || answers[currentIndex].scaleValue == null;
}

// Highlight selected choice
function updateSelection() {
  const buttons = choicesContainer.querySelectorAll(".choice-btn");
  buttons.forEach((btn, idx) => {
    btn.classList.toggle(
      "selected",
      answers[currentIndex] && answers[currentIndex].choiceIdx === idx
    );
  });
}

// Navigation
nextBtn.onclick = () => {
  if (!answers[currentIndex] || answers[currentIndex].scaleValue == null) {
    alert("Please select a choice and scale level.");
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

// Calculate MBTI type
function calculateResult() {
  // Sort functions by score
  const sortedFunctions = Object.entries(functionScores)
    .sort((a, b) => b[1] - a[1])
    .map(([fn]) => fn);

  const maxRank = sortedFunctions.length;

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

  for (const [type, stack] of Object.entries(mbtiTypes)) {
    let score = 0;
    for (let i = 0; i < stack.length; i++) {
      let rank = sortedFunctions.indexOf(stack[i]);
      if (rank === -1) rank = maxRank;
      score += Math.abs(rank - i);
    }
    if (score < bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  window.location.href = `result.html?type=${bestType}`;
}

// Initial render
renderQuestion();
