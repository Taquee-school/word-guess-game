import { createElement } from "./utils/UI/utils.js";
import "./app/account-tab.js";

const attemptPanel = document.getElementById("attempt-panel");

//#region creating box
const wordLength = 5;
const totalAttempts = 6;

function createAttemptPanel() {
  attemptPanel.innerHTML = "";
  
  for (let row = 1; row <= totalAttempts; row++) {
    const attemptRow = createElement("div", {
      id: `row-${row}`,
      className: "attempt-row"
    });
    attemptPanel.appendChild(attemptRow);
    
    for (let column = 1; column <= wordLength; column++) {
      const attemptBox = createElement("div", {
        id: `box-${column}`,
        className: "attempt-box"
      }, [createElement("p")]);
      attemptRow.appendChild(attemptBox);
    }
  }
  
  selectedBox = attemptPanel.querySelector(`#row-${currentBoxFocus[0]} #box-${currentBoxFocus[1]}`);
  selectedBox.classList.add("selected");
}
//#endregion creating box

//#region filling boxes
let currentBoxFocus = [1,1];
let selectedBox;
let allowGoingBackward = false;

function fillBox(letter) {
  if (win || lose) return;
  
  if (selectedBox && selectedBox.textContent.length > 0) return;
  selectedBox.querySelector("p").textContent = letter;
  
  moveFocus("forward");
}

function f_delete() {
  if (win || lose) return;
  
  if (selectedBox.textContent.length < 1) { moveFocus("backward") }
  selectedBox.querySelector("p").textContent = "";
}

/** changes the focused element @param {('forward'|'backward')} direction  */
function moveFocus(direction) {
  selectedBox.classList.remove("selected");
  
  if (direction == "forward") {
    if (currentBoxFocus[1] < wordLength) {
      currentBoxFocus[1]++;
    }
    else if (currentBoxFocus[0] < totalAttempts) {
      f_enter(currentBoxFocus[0]);
      currentBoxFocus[0]++;
      currentBoxFocus[1] = 1;
    }
  }
  
  else {
    if (currentBoxFocus[1] > 1) {
      currentBoxFocus[1]--;
    }
    else if (currentBoxFocus[0] > 1) {
      if (allowGoingBackward) {
        currentBoxFocus[0]--;
        currentBoxFocus[1] = wordLength;
      }
    }
  }

  selectedBox = attemptPanel.querySelector(`#row-${currentBoxFocus[0]} #box-${currentBoxFocus[1]}`);
  selectedBox.classList.add("selected");
}

const bn_delete = document.getElementById("delete-btn");
bn_delete.addEventListener("click", f_delete);

const bn_enter = document.getElementById("enter-btn");
bn_enter.addEventListener("click", f_enter);

//#endregion filling boxes


let targetWord = "place";
let currentAttemptWord = "";

let win = false;
let lose = false;


function makeWord(row) {
  let newWord = "";
  attemptPanel.querySelectorAll(`#row-${row} .attempt-box`).forEach(box => {
    newWord += box.textContent;
  });

  return newWord;
}

function showResult() {
  const resultPanel = createElement("div", { id: "resultPanel" });
  attemptPanel.appendChild(resultPanel);
  
  const resultMessage = createElement("p", { id: "resultMessage" });
  resultPanel.appendChild(resultMessage);
  
  resultMessage.textContent = win ? "GOOD JOB!" : `ATTEMPTS OVER!\nthe answer is\n ${targetWord}`;
}

function f_enter(row) {
  const attemptRow = attemptPanel.querySelector(`#row-${row}`);

  if (!attemptRow) return;
  
  for (let i = 1; i <= wordLength; i++) {
    const box = attemptRow.querySelector(`#box-${i}`);
    
    if (!box) continue;
    
    const boxText = box.textContent;
    const key = keyboard.querySelector(`#${boxText.toLowerCase()}`);
    
    if (targetWord[i-1] == boxText) {
      box.classList.add("correct");
      if (key) key.classList.add("correct");
    }
    else if (targetWord.includes(boxText)) {
      box.classList.add("present");
      if (key && !key.classList.contains("correct")) key.classList.add("present");
    }
    else {
      box.classList.add("wrong");
      if (key) key.classList.add("wrong");
    }
  }
}

//#region keyboard

const keyboard = document.getElementById("keyboard")
keyboard.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => fillBox(key.id));
});

function resetKeyboard() {
  keyboard.querySelectorAll(".key").forEach(key => {
    key.className = "key";
  });
}

document.addEventListener("keydown", (event) => {
  if (win || lose) return;
  
  const keypress = event.key.toLowerCase();
  if (keypress.length == 1 && keypress >= "a" && keypress <= "z") {
    fillBox(keypress);
  } else if (event.key === "Backspace") {
    f_delete();
  } else if (event.key === "Enter") {
    f_enter();
  }
});
//#endregion keyboard

window.addEventListener("DOMContentLoaded", () => {
  createAttemptPanel();
});