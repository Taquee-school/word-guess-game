import { createElement } from "../utils/UI/utils.js";
import { app, app_topBar } from "./app.js";

function openAccountPanel() {
  if (accountInfoPanel.style.display == "flex") return;
  
  accountInfoPanel.style.display = "flex";
  accountInfoPanel.classList.add("anim-appear-panel");
  accountInfoPanel.addEventListener("animationend", () => {
    accountInfoPanel.classList.remove("anim-appear-panel");
  }, { once: true });
}

function closeAccountPanel() {
  if (accountInfoPanel.style.display == "none") return;

  accountInfoPanel.classList.add("anim-disappear-panel");
  accountInfoPanel.addEventListener("animationend", () => {
    accountInfoPanel.classList.remove("anim-disappear-panel");
    accountInfoPanel.style.display = "none";
  }, { once: true });
}

export class user {
  constructor () {
    this.name = "";
    this.wins = 0;
    this.attempts = 0;
  }
}

export const currentUser = new user();
currentUser.name = "Noor Taquee";
currentUser.wins = 7;
currentUser.attempts = 10;

const bn_account = createElement("button", {
  title: "Account",
  id: "account-btn",
  className: "toggle"
}, [], {"click": [openAccountPanel]});
app_topBar.appendChild(bn_account);


const accountInfoPanel = createElement("div", { id: "accountInfoPanel" });
accountInfoPanel.style.display = "none";
app.appendChild(accountInfoPanel);

const accountInfoDiv = createElement("div", { id: "accountInfoDiv" });
accountInfoPanel.appendChild(accountInfoDiv);

const accountPic = createElement("p", { id: "accountPic" });
accountInfoDiv.appendChild(accountPic);

const accountName = createElement("p", {
  id: "accountName",
  textContent: currentUser.name 
});
accountInfoDiv.appendChild(accountName);

accountInfoPanel.appendChild(createElement("hr"));

const statsDiv = createElement("div", { id: "statsDiv" });
accountInfoPanel.appendChild(statsDiv);

const winStat = createElement("p", {
  className: "stats-text",
  textContent: "Wins:"
}, [createElement("span", {
  className: "stats-value",
  textContent: currentUser.wins 
})]);
statsDiv.appendChild(winStat);

const attemptStat = createElement("p", {
  className: "stats-text",
  textContent: "Attempts:"
}, [createElement("span", {
  className: "stats-value",
  textContent: currentUser.attempts 
})]);
statsDiv.appendChild(attemptStat);

accountInfoPanel.appendChild(createElement("hr"));

const buttonDiv = createElement("div", { id: "buttonDiv" });
accountInfoPanel.appendChild(buttonDiv);

const bnClose = createElement("button", {
  title: "Close account panel",
  id: "bnClose"
}, [createElement("p", { textContent: "Close" })], {"click": [closeAccountPanel]});
buttonDiv.appendChild(bnClose);
//#endregion account panel
