let incorrectAudio, correctAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
let totalCount = 0;
let correctCount = 0;
let answerPos = 0;
let problems = [];
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function changeLang() {
  const langObj = document.getElementById("lang");
  const lang = langObj.options[langObj.selectedIndex].value;
  location.href = `/flags-quiz/${lang}/`;
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("/flags-quiz/mp3/incorrect1.mp3"),
    loadAudio("/flags-quiz/mp3/correct3.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    incorrectAudio = audioBuffers[0];
    correctAudio = audioBuffers[1];
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array) {
  for (i = array.length; 1 < i; i--) {
    k = Math.floor(Math.random() * i);
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
        playAudio(correctAudio);
        choices.forEach((c) => {
          c.classList.remove("text-danger");
        });
        totalCount += 1;
        if (choices.every((c) => !c.textContent.startsWith("×"))) {
          correctCount += 1;
        }
        scoring();
        nextProblem();
      } else {
        playAudio(incorrectAudio);
        choice.classList.add("text-danger");
        choice.textContent = "×" + choice.textContent;
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
      "transparentBackground": false,
      "autoRotation": false,
      "rotationRatio": 1
    },
    "color": {
      "surface": 16777215,
      "selected": 2141154,
      "in": 16777215,
      "out": 2141154,
      "halo": 2141154,
      "background": 0
    },
    "brightness": {
      "ocean": 1.0,
      "mentioned": 0.5,
      "related": 0.5
    }
  };
  const gio = new GIO.Controller(obj, config);
  gio.onCountryPicked((selectedCountry, _relatedCountries) => {
    const answerId = problems[answerPos][1];
    const selectedId = selectedCountry.ISOCode;
    if (answerId != selectedId) {
      const target = problems.find(x => x[1] == selectedId);
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
      const toast = bootstrap.Toast.getOrCreateInstance(countryInfo);
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
  fontFace.load().then(function () {
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
