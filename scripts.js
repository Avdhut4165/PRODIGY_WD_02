const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapsList = document.getElementById("lapsList");
const lapCount = document.getElementById("lapCount");
const emptyState = document.getElementById("emptyState");

let startTime = 0;
let elapsedTime = 0;
let timerId = null;
let lapNumber = 0;

function formatTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const centiseconds = Math.floor((time % 1000) / 10);

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":") + "." + String(centiseconds).padStart(2, "0");
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function updateLapMeta() {
  const totalLaps = lapsList.children.length;
  lapCount.textContent = `${totalLaps} ${totalLaps === 1 ? "lap" : "laps"}`;
  emptyState.hidden = totalLaps > 0;
}

function startStopwatch() {
  if (timerId !== null) {
    return;
  }

  startTime = Date.now() - elapsedTime;
  timerId = window.setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
}

function pauseStopwatch() {
  if (timerId === null) {
    return;
  }

  window.clearInterval(timerId);
  timerId = null;
}

function resetStopwatch() {
  pauseStopwatch();
  elapsedTime = 0;
  lapNumber = 0;
  lapsList.innerHTML = "";
  updateDisplay();
  updateLapMeta();
}

function recordLap() {
  if (elapsedTime === 0) {
    return;
  }

  lapNumber += 1;

  const lapItem = document.createElement("li");
  lapItem.className = "lap-item";

  const lapLabel = document.createElement("span");
  lapLabel.className = "lap-label";
  lapLabel.textContent = `Lap ${lapNumber}`;

  const lapTime = document.createElement("span");
  lapTime.className = "lap-time";
  lapTime.textContent = formatTime(elapsedTime);

  lapItem.append(lapLabel, lapTime);
  lapsList.prepend(lapItem);
  updateLapMeta();
}

startBtn.addEventListener("click", startStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
resetBtn.addEventListener("click", resetStopwatch);
lapBtn.addEventListener("click", recordLap);

updateDisplay();
updateLapMeta();
