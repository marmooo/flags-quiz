let incorrectAudio,correctAudio;loadAudios();const AudioContext=window.AudioContext||window.webkitAudioContext,audioContext=new AudioContext;let totalCount=0,correctCount=0,answerPos=0;const problems=[];loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function changeLang(){const a=document.getElementById("lang"),b=a.options[a.selectedIndex].value;location.href=`/flags-quiz/${b}/`}function playAudio(c,b){const a=audioContext.createBufferSource();if(a.buffer=c,b){const c=audioContext.createGain();c.gain.value=b,c.connect(audioContext.destination),a.connect(c),a.start()}else a.connect(audioContext.destination),a.start()}function unlockAudio(){audioContext.resume()}function loadAudio(a){return fetch(a).then(a=>a.arrayBuffer()).then(a=>new Promise((b,c)=>{audioContext.decodeAudioData(a,a=>{b(a)},a=>{c(a)})}))}function loadAudios(){promises=[loadAudio("/flags-quiz/mp3/incorrect1.mp3"),loadAudio("/flags-quiz/mp3/correct3.mp3")],Promise.all(promises).then(a=>{incorrectAudio=a[0],correctAudio=a[1]})}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function shuffle(a){for(let b=a.length;1<b;b--){const c=Math.floor(Math.random()*b);[a[c],a[b-1]]=[a[b-1],a[c]]}return a}function nextProblem(){const a=totalCount%problems.length;a==0&&shuffle(problems),answerPos=getRandomInt(0,4);const b=problems[a][0];document.getElementById("flag").textContent=b;const c=[...document.getElementById("choices").children];c.forEach((c,d)=>{if(d==answerPos)c.textContent=problems[a][2];else{let a;do a=getRandomInt(0,problems.length);while(problems[a][0]==b)c.textContent=problems[a][2]}}),gio.switchCountry(problems[a][1])}function scoring(){document.getElementById("score").textContent=correctCount,document.getElementById("total").textContent=totalCount}function loadProblems(){const a=document.documentElement.lang;fetch(`/flags-quiz/data/${a}.csv`).then(a=>a.text()).then(a=>{a.trim().split("\n").forEach(a=>{const[b,c,d]=a.split(",");problems.push([b,c,d])}),shuffle(problems)})}function initProblems(){const a=[...document.getElementById("choices").children];a.forEach((b,c)=>{b.onclick=()=>{c==answerPos?(playAudio(correctAudio),a.forEach(a=>{a.classList.remove("text-danger")}),totalCount+=1,a.every(a=>!a.textContent.startsWith("×"))&&(correctCount+=1),scoring(),nextProblem()):(playAudio(incorrectAudio),b.classList.add("text-danger"),b.textContent="×"+b.textContent)}})}function initGlobe(){const b=document.getElementById("globe"),c={control:{stats:!1,disableUnmentioned:!1,lightenMentioned:!0,inOnly:!1,outOnly:!1,initCountry:"JP",halo:!0,transparentBackground:!1,autoRotation:!1,rotationRatio:1},color:{surface:16777215,selected:2141154,in:16777215,out:2141154,halo:2141154,background:0},brightness:{ocean:1,mentioned:.5,related:.5}},a=new GIO.Controller(b,c);return a.onCountryPicked((d,e)=>{const b=totalCount==0?"JP":problems[totalCount][1],c=d.ISOCode;if(b!=c){const d=problems.find(a=>a[1]==c),e=document.getElementById("countryName");d?e.textContent=d[2]:e.textContent="The country is not registered.";const f=document.getElementById("countryInfo");f.addEventListener("hidden.bs.toast",()=>{a.switchCountry(b)});const g=bootstrap.Toast.getOrCreateInstance(f);g.show()}}),a.init(),a}if(navigator.userAgent.indexOf("Windows")!=-1){const a=new FontFace("flags","url(/flags-quiz/flags.woff2)");a.load().then(function(){document.fonts.add(a),document.getElementById("flag").style.fontFamily="flags"})}initProblems(),loadProblems();const gio=initGlobe();document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("startButton").onclick=nextProblem,document.getElementById("lang").onchange=changeLang,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})