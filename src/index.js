import { Toast } from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/+esm";

let totalCount = 0;
let correctCount = 0;
let answerPos = 0;
const problems = [];
const audioContext = new globalThis.AudioContext();
const audioBufferCache = {};
loadAudio("correct", "/flags-quiz/mp3/correct3.mp3");
loadAudio("incorrect", "/flags-quiz/mp3/incorrect1.mp3");
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function changeLang() {
  const langObj = document.getElementById("lang");
  const lang = langObj.options[langObj.selectedIndex].value;
  location.href = `/flags-quiz/${lang}/`;
}

async function playAudio(name, volume) {
  const audioBuffer = await loadAudio(name, audioBufferCache[name]);
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    sourceNode.connect(gainNode);
    sourceNode.start();
  } else {
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
  }
}

async function loadAudio(name, url) {
  if (audioBufferCache[name]) return audioBufferCache[name];
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioBufferCache[name] = audioBuffer;
  return audioBuffer;
}

function unlockAudio() {
  audioContext.resume();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array) {
  for (let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i - 1]] = [array[i - 1], array[k]];
  }
  return array;
}

function nextProblem() {
  const pos = totalCount % problems.length;
  if (pos == 0) {
    shuffle(problems);
  }
  answerPos = getRandomInt(0, 4);
  const answerFlag = problems[pos][0];
  document.getElementById("flag").textContent = answerFlag;
  const choices = [...document.getElementById("choices").children];
  choices.forEach((choice, i) => {
    if (i == answerPos) {
      choice.textContent = problems[pos][2];
    } else {
      let candidatePos;
      do {
        candidatePos = getRandomInt(0, problems.length);
      } while (problems[candidatePos][0] == answerFlag);
      choice.textContent = problems[candidatePos][2];
    }
  });
  gio.switchCountry(problems[pos][1]);
}

function scoring() {
  document.getElementById("score").textContent = correctCount;
  document.getElementById("total").textContent = totalCount;
}

function loadProblems() {
  const lang = document.documentElement.lang;
  fetch(`/flags-quiz/data/${lang}.csv`)
    .then((response) => response.text())
    .then((csv) => {
      csv.trim().split("\n").forEach((line) => {
        const [flag, id, name] = line.split(",");
        problems.push([flag, id, name]);
      });
      shuffle(problems);
    });
}

function initProblems() {
  const choices = [...document.getElementById("choices").children];
  choices.forEach((choice, i) => {
    choice.onclick = () => {
      if (i == answerPos) {
        playAudio("correct", 0.3);
        choices.forEach((c) => {
          c.classList.remove("text-danger");
        });
        totalCount += 1;
        if (choices.every((c) => !c.textContent.startsWith("❌"))) {
          correctCount += 1;
        }
        scoring();
        nextProblem();
      } else {
        playAudio("incorrect", 0.3);
        choice.classList.add("text-danger");
        if (!choice.textContent.startsWith("❌")) {
          choice.textContent = "❌ " + choice.textContent;
        }
      }
    };
  });
}

function initGlobe() {
  const obj = document.getElementById("globe");
  const config = {
    "control": {
      "stats": false,
      "disableUnmentioned": false,
      "lightenMentioned": true,
      "inOnly": false,
      "outOnly": false,
      "initCountry": "JP",
      "halo": true,
      "transparentBackground": true,
      "autoRotation": false,
      "rotationRatio": 1,
    },
    "color": {
      "surface": 16777215,
      "selected": 2141154,
      "in": 16777215,
      "out": 2141154,
      "halo": 2141154,
      "background": null,
    },
    "brightness": {
      "ocean": 1.0,
      "mentioned": 0.5,
      "related": 0.5,
    },
  };
  const gio = new GIO.Controller(obj, config);
  gio.onCountryPicked((selectedCountry, _relatedCountries) => {
    const answerId = (totalCount == 0) ? "JP" : problems[totalCount][1];
    const selectedId = selectedCountry.ISOCode;
    if (answerId != selectedId) {
      const target = problems.find((x) => x[1] == selectedId);
      const countryName = document.getElementById("countryName");
      if (target) {
        countryName.textContent = target[2];
      } else {
        countryName.textContent = "The country is not registered.";
      }
      const countryInfo = document.getElementById("countryInfo");
      countryInfo.addEventListener("hidden.bs.toast", () => {
        gio.switchCountry(answerId);
      });
      const toast = Toast.getOrCreateInstance(countryInfo);
      toast.show();
    }
  });
  gio.init();
  return gio;
}

// Windows は国旗の絵文字が出ないので専用の絵文字フォントを使用
if (navigator.userAgent.indexOf("Windows") != -1) {
  const fontFace = new FontFace(
    "flags",
    "url(/flags-quiz/flags.woff2)",
  );
  fontFace.load().then(() => {
    document.fonts.add(fontFace);
    document.getElementById("flag").style.fontFamily = "flags";
  });
}
initProblems();
loadProblems();
const gio = initGlobe();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("startButton").onclick = nextProblem;
document.getElementById("lang").onchange = changeLang;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
