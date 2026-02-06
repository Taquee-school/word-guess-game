
/**
 * Creates an element and returns it
 * @template {keyof HTMLElementTagNameMap} K 
 * @param {K} elementName 
 * @param {Partial<HTMLElementTagNameMap[K]>} properties 
 * @param {Node[]} children 
 * @param {object.<string, Function[]>} eventListeners 
 */
export function createElement(elementName, properties = {}, children = [], eventListeners = {}) {
  const element = document.createElement(elementName);
  Object.assign(element, properties);
  children.forEach(child => { if (child) element.appendChild(child) });
  Object.keys(eventListeners).forEach(eventType => {
    eventListeners[eventType].forEach(func => {
      element.addEventListener(eventType, func);
    });
  });
  return element;
}

//#region helper functions
/**
 * This functions adds a script element at the end of body
 * @param {string} id
 * @param {string} src path to js file (eg: "./main/public/script.js")
 * @param {('module')} type
 * @returns {HTMLScriptElement}
 */
export function addScript(id, src, type = null) {
  if (document.getElementById(id)) return document.getElementById(id);

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  if (type) { script.type = type }
  document.body.appendChild(script);
  return script;
}

/**
 * This function adds a link element on the head
 * @param {string} id
 * @param {string} href
 * @param {('stylesheet'|'icon'|'manifest')} rel
 * @returns {HTMLLinkElement}
 */
export function addLink(id, href, rel = "stylesheet") {
  if (document.getElementById(id)) return document.getElementById(id);

  const newStyle = document.createElement("link");
  newStyle.id = id;
  newStyle.rel = rel;
  newStyle.href = href;
  document.head.appendChild(newStyle);
  return newStyle;
}


/**
 * Creates a dialogue box for confirmation, query selector -> `.confirmation-panel`
 * @param {string} header title for confirmation, query selector -> `.confirmation-panel-header`
 * @param {string} content confirmation message, query selector -> `.confirmation-panel-content`
 * @param {('Confirm'|'Yes'|'Delete'|'Clear'|'Log out')} btnText 
 * @param {function} btnFunction query selector for positive button -> `.confirmation-panel-btn.confirm`
 * @param {function} cancelFunction query selector for negative button -> `.confirmation-panel-btn.cancel`
 * @returns {HTMLDivElement}
 */
export function createConfirmationPanel(header, content, btnText, btnFunction, cancelFunction) {
  const overlay = createElement("div", { className: "overlay" });
  
  const div = createElement("div", {
    className: "confirmation-panel"
  }, [
    createElement("p", {
      className: "confirmation-panel-header",
      textContent: header
    }),
    createElement("p", {
      className: "confirmation-panel-content",
      textContent: content
    }),
    createElement("button", {
      className: "confirmation-panel-btn confirm",
      onclick: btnFunction
    }, [ createElement("p", { textContent: btnText }) ]),
    createElement("button", {
      className: "confirmation-panel-btn cancel",
      onclick: cancelFunction
    }, [ createElement("p", { textContent: "Cancel" }) ])
  ]);
  overlay.appendChild(div);

  return overlay;
}
/**
 * Creates radio buttons that are open means they don't appear after any interaction
 * @param {string} id 
 * @param {string} headerText 
 * @param {Array<Object.property>} radioOptions 
 * @returns {HTMLDivElement} 
 * @example createRadioOpen( "theme-selection", "Choose Theme",[ {id:"light-input", text: "Light", clickFunction: () => { app.dataset.theme = "light" }}, {id:"dark-input", text:"Dark", clickFunction: () => { app.dataset.theme = "dark" }} ])
 */
export function createRadioOpen(id, headerText, radioOptions) {
  const div = createElement("div", { id: id, className: "radio-open" });

  const topDiv = createElement("div", { className: "radio-open-top" });
  div.appendChild(topDiv);

  const headerTextp = createElement("p", { textContent: headerText, className: "radio-open-header-text" });
  topDiv.appendChild(headerTextp);


  const radioDiv = createElement("div", { className: "radio-open-container" });
  div.appendChild(radioDiv);

  for (let i of radioOptions) {
    const option = createElement("div", { className: "radio-open-option", id: `option-${i.id}` });

    const icon = createElement("i");
    if (i.selected) {
      icon.classList.add("ph-fill");
      icon.classList.add("ph-radio-button");
      option.classList.add("selected");
    } else {
      icon.classList.add("ph-bold");
      icon.classList.add("ph-circle");
    }
    icon.id = `radio-open-icon-${i.id}`;
    option.appendChild(icon);

    const text = createElement("p", { textContent: i.text, className: "radio-open-option-label" });
    option.appendChild(text);

    option.addEventListener("click", () => {
      const icon = option.querySelector(`#radio-open-icon-${i.id}`);

      // check if the selected option is already applied
      if (icon.classList.contains("ph-radio-button")) return;

      // remove the selected icon from previously selected input
      let selectedOptionIcon = div.querySelector(`.ph-radio-button`);
      if (selectedOptionIcon) {
        selectedOptionIcon.classList.replace("ph-radio-button", "ph-circle");
        selectedOptionIcon.classList.replace("ph-fill", "ph-bold");
      }

      radioDiv.querySelector(".selected").classList.remove("selected");
      option.classList.add("selected");

      // add the selected icon to the selected input
      icon.classList.replace("ph-bold", "ph-fill");
      icon.classList.replace("ph-circle", "ph-radio-button");

      // call the click function
      i.clickFunction();
    });

    radioDiv.appendChild(option);
  }


  return div;
}
