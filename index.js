const { ipcRenderer, session } = require("electron");
const isDev = require("electron-is-dev");
const TabGroup = require("electron-tabs");
const dragula = require("dragula");

// class FoatingContainer {
//   constructor(id, generateContent) {
//     this.id = id;
//     this.content = generateContent();
//     this.style = generateStyle();
//     this.container = this.createFloatingObject();
//     this.container.appendChild(generateContent);
//   }

//   createFloatingObject(id) {
//     let container = document.createElement("div");
//     container.id = id;

//     let closeContainer = document.createElement("div");
//     closeContainer.id = id + "Header";
//     closeContainer.classList.add("closeIcon");
//     closeContainer.style.display = "flexbox";
//     closeContainer.style.justifyContent = "flex-end";
//     closeContainer.style.width = "inherit";

//     let closeButton = document.createElement("a");
//     closeButton.setAttribute("href", "#");
//     closeButton.innerHTML = "[X]";
//     closeButton.addEventListener("click", () => {
//       container.parentNode.removeChild(container);
//     });

//     closeContainer.appendChild(closeButton);
//     container.appendChild(closeContainer);

//     // add the loading element
//     let loadingContainer = document.createElement("div");
//     loadingContainer.id = "loading";
//     loadingContainer.classList.add("loading");

//     let rotating = document.createElement("div");
//     rotating.classList.add("lds-dual-ring");

//     loadingContainer.appendChild(rotating);
//     container.appendChild(loadingContainer);
//     container.classList.add("windowPopup");

//     document.body.appendChild(container);
//     dragElement(container);

//     return container;
//   }
// }

function dragElement(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(element.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// When the user clicks on div, open the popup
function togglePopup() {
  let popupButton = document.getElementById("menuPopup");
  if (popupButton.getAttribute("visibility") == "true") {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");

    let button = document.getElementById("menuIcon");
    button.classList.toggle("kc_fab_main_btn_focused");

    let hideButton = document.getElementById("hideMenuIcon");
    hideButton.classList.toggle("kc_fab_sec_btn_focused");
    hideButton.onclick = toggleMenuVisibility;
  } else {
    popupButton.classList.toggle("menuPopup_hidden");
    popupButton.setAttribute("visibility", "true");
  }
}

function toggleMenuVisibility() {
  let popupButton = document.getElementById("menuPopup");
  popupButton.classList.toggle("menuPopup_hidden");
  popupButton.setAttribute("visibility", "false");

  let popup = document.getElementById("myPopup");
  popup.classList.remove("show");

  let button = document.getElementById("menuIcon");
  button.classList.toggle("kc_fab_main_btn_focused");

  let hideButton = document.getElementById("hideMenuIcon");
  hideButton.classList.toggle("kc_fab_sec_btn_focused");
  hideButton.onclick = {};
}

function getTitle(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const title = doc.querySelectorAll("title")[0];
      return title.innerText;
    });
}

function navigate(tab) {
  webview = tab.webview;
  function navigation(e) {
    let title = getTitle(e.url).then(function (title) {
      tabGroup.addTab({
        title: title,
        src: e.url,
        active: true,
        plugins: true,
        ready: navigate,
      });
    });
  }

  webview.addEventListener("new-window", navigation);
  webview.addEventListener("will-navigate", navigation);
}

function copyURL(url, type) {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  if (type == "url") {
    textArea.value = url;
  } else {
    textArea.value = url.split("=")[1];
  }
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    if (isDev) {
      console.log("Copying text command was " + msg);
      console.log("Url: " + textArea.value);
    }
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  document.body.removeChild(textArea);
}

function openInfoTab(name, url, option = null, render = null) {
  if (!url.includes("aq-char-info")) {
    togglePopup();
  }

  if (render == null) {
    if (option != null) {
      url += option;
    }
    let title = getTitle(url).then(function (title) {
      tabGroup.addTab({
        title: name ? name : title,
        src: url,
        active: true,
        plugins: true,
        closable: true,
        ready: navigate,
      });
    });
  } else {
    if (option == null) {
      render(url);
    } else {
      render(url, option);
    }
  }
}

function createFirebaseInfo(url) {
  let floatingContainer = createFloatingObject("firebaseApp");
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      return JSON.parse(text);
    })
    .then((json) => {
      let container = document.createElement("div");
      container.classList.add("popupContent");
      container.style.color = "#fff";
      let info = generateInfo(json);

      container.innerHTML = info;

      // add a link for additional info
      let id = url.split("=")[1];
      let p = document.createElement("p");
      let moreinfo_link = document.createElement("a");
      moreinfo_link.href = "#";
      moreinfo_link.onclick = () => {
        openInfoTab(
          "AQ Char Info",
          `https://aq-char-info.firebaseapp.com/?id=${id}`
        );
      };
      moreinfo_link.innerText = " More Info";
      p.appendChild(moreinfo_link);
      container.appendChild(p);

      floatingContainer.removeChild(
        floatingContainer.getElementsByClassName("loading")[0]
      );
      floatingContainer.appendChild(container);

      return 0;
    });
}

function createWarzoneInfo(url) {
  if (document.getElementById("warzone")) {
    document
      .getElementById("warzone")
      .parentNode.removeChild(document.getElementById("warzone"));
    return;
  }
  let floatingContainer = createFloatingObject("warzone");
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      return parser.parseFromString(text, "text/html");
    })
    .then((html) => {
      let table = html.getElementsByTagName("table")[1];
      table.setAttribute("width", "300");
      table.style.width = "300px";
      table.style.wordWrap = "break-word";

      let header = table.getElementsByTagName("h3")[0];
      header.style.color = "#FF6600";

      let legend = table.getElementsByClassName("top10Heading");
      for (let i = 0; i < legend.length; i++) {
        legend[i].style.color = "#FFF";
      }

      let links = table.getElementsByTagName("a");
      while (links.length > 0) {
        links[0].parentNode.innerText = links[0].innerText;
      }

      let container = document.createElement("div");
      container.classList.add("popupContent");

      container.appendChild(table);

      floatingContainer.removeChild(
        floatingContainer.getElementsByClassName("loading")[0]
      );
      floatingContainer.appendChild(container);

      return 0;
    });
}

function createElfInfo(url, name) {
  if (document.getElementById(name)) {
    document
      .getElementById(name)
      .parentNode.removeChild(document.getElementById(name));
    return;
  }
  let floatingContainer = createFloatingObject(name);
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      return parser.parseFromString(text, "text/html");
    })
    .then((html) => {
      let table = html.getElementsByTagName("table")[1];
      table.setAttribute("width", "300");
      table.style.tableLayout = "fixed";

      let legend = table.getElementsByClassName("top10Heading");
      for (let i = 0; i < legend.length; i++) {
        legend[i].style.color = "#FFF";
      }

      let rows = table.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        rows[i].getElementsByTagName("td")[0].style.width = "30px";
        rows[i].removeChild(rows[i].getElementsByTagName("td")[2]);
      }

      let links = table.getElementsByTagName("a");
      while (links.length > 0) {
        links[0].parentNode.innerText = links[0].innerText;
      }

      let container = document.createElement("div");
      container.classList.add("popupContent");

      container.appendChild(table);

      floatingContainer.removeChild(
        floatingContainer.getElementsByClassName("loading")[0]
      );
      floatingContainer.appendChild(container);

      return 0;
    });
}

function createFloatingObject(id) {
  let container = document.createElement("div");
  container.id = id;

  let closeContainer = document.createElement("div");
  closeContainer.id = id + "Header";
  closeContainer.classList.add("closeIcon");
  closeContainer.style.display = "flexbox";
  closeContainer.style.justifyContent = "flex-end";
  closeContainer.style.width = "inherit";

  let closeButton = document.createElement("a");
  closeButton.setAttribute("href", "#");
  closeButton.innerHTML = "[X]";
  closeButton.addEventListener("click", () => {
    container.parentNode.removeChild(container);
  });

  closeContainer.appendChild(closeButton);
  container.appendChild(closeContainer);

  // add the loading element
  let loadingContainer = document.createElement("div");
  loadingContainer.id = "loading";
  loadingContainer.classList.add("loading");

  let rotating = document.createElement("div");
  rotating.classList.add("lds-dual-ring");

  loadingContainer.appendChild(rotating);
  container.appendChild(loadingContainer);
  container.classList.add("windowPopup");

  document.body.appendChild(container);
  dragElement(container);

  return container;
}

ipcRenderer.on("hotkey", (event, message) => {
  let webview = document.querySelector("webview.visible");
  switch (message) {
    case "reload":
      webview.reload();
      break;
    case "devtools":
      webview.openDevTools();
      break;
  }
});

function generateInfo(charDetails) {
  response = "";
  response += "<p><b>Name: </b>" + charDetails["name"] + "</p>";
  response += "<p><b>Class: </b>" + charDetails["class"] + "</p>";
  response += "<p><b>Subrace: </b>" + charDetails["subrace"] + "</p>";
  response += "<p><b>Clan: </b>" + charDetails["clan"] + "</p>";
  response += "<p><b>Level: </b>" + charDetails["level"] + "</p>";
  response += "<p><b>Exp: </b>" + charDetails["exp"] + "</p>";
  response += "<p><b>Gold: </b>" + charDetails["gold"] + "</p>";
  response += "<p><b>Account Type: </b>" + charDetails["type"] + "</p>";

  var charLevel = charDetails["level"];
  var goldCap =
    (Math["pow"](1.055, charLevel) +
      8 +
      Math["pow"](1.055, Math["floor"](Math["pow"](charLevel, 1.085)))) *
    450;
  if (charDetails["type"] === "X-Guardian") {
    goldCap *= 1.1;
  }
  goldCap = Math["round"](goldCap);
  var expCap = Math["round"](goldCap * 3);
  var expCapPercent =
    Math["floor"]((charDetails["dailyExp"] / expCap) * 10000) / 100;
  var goldCapPercent =
    Math["floor"]((charDetails["dailyGold"] / goldCap) * 10000) / 100;
  response +=
    "<p><b>Daily Exp: </b>" +
    charDetails["dailyExp"] +
    " (" +
    expCapPercent +
    "%)</p>";
  response +=
    "<p><b>Daily Gold: </b>" +
    charDetails["dailyGold"] +
    " (" +
    goldCapPercent +
    "%)</p>";

  var charClasses = charDetails["classes"];
  response += "<hr />";
  response += "<h2><b>Subrace Levels</b></h2>";
  var vampireLevel = parseInt(charClasses["charAt"](5), 36);
  var werewolfLevel = parseInt(charClasses["charAt"](6), 36);
  var dracopyreLevel = parseInt(charClasses["charAt"](33), 36);
  var werepyreLevel = parseInt(charClasses["charAt"](32), 36);
  var dracoType = "";
  if (dracopyreLevel >= 1 && dracopyreLevel <= 11) {
    dracoType = " (GraceFang)";
    dracopyreLevel = dracopyreLevel - 1;
  } else {
    if (dracopyreLevel >= 12 && dracopyreLevel <= 22) {
      dracoType = " (NightReign)";
      dracopyreLevel = dracopyreLevel - 12;
    }
  }
  var _0x49cfx22 = parseInt(charClasses["charAt"](36), 36);
  var nekoLevel = _0x49cfx22 % 16;
  response +=
    "<p><b>Vampire: </b>" +
    (vampireLevel > 10 ? "10 (Advanced)" : vampireLevel) +
    "</p>";
  response +=
    "<p><b>Werewolf: </b>" +
    (werewolfLevel > 10 ? "10 (Advanced)" : werewolfLevel) +
    "</p>";
  response +=
    "<p><b>Neko: </b>" +
    (nekoLevel > 10 ? "10" : nekoLevel) +
    (_0x49cfx22 > 0 ? (_0x49cfx22 >= 16 ? " (Luna)" : " (Sol)") : "") +
    (nekoLevel > 10 ? " (Advanced)" : "") +
    "</p>";
  response +=
    "<p><b>Werepyre: </b>" +
    (werepyreLevel > 10 ? "10 (Advanced)" : werepyreLevel) +
    "</p>";
  response +=
    "<p><b>Dracopyre: </b>" +
    dracopyreLevel +
    (dracopyreLevel > 0 ? dracoType : "") +
    "</p>";

  response += "<hr />";
  response += "<h2><b>Class Levels</b></h2>";
  var AQClasses = [
    ["17", "Dracomancer"],
    ["2", "Dragon Slayer"],
    ["4", "ShadowSlayer/NightHunter"],
    ["8", "Fighter"],
    ["15", "Knight"],
    ["10", "Paladin"],
    ["9", "Necromancer"],
    ["16", "Wizard"],
    ["3", "Mage"],
    ["14", "Rogue"],
    ["12", "Ninja"],
    ["30", "Assassin"],
    ["11", "Beastmaster"],
    ["19", "Berserker"],
    ["20", "Pirate"],
    ["21", "Scholar"],
    ["22", "Martial Artist"],
  ];
  for (var i = 0; i < AQClasses["length"]; i++) {
    var AQClass = AQClasses[i][0];
    if (AQClass == 4) {
      var classLevel = parseInt(charClasses["charAt"](AQClass), 36);
      var classLevelText = classLevel
        ? classLevel <= 10
          ? " (ShadowSlayer)"
          : " (NightHunter)"
        : "";
      classLevel = classLevel ? ((classLevel - 1) % 10) + 1 : 0;
      response +=
        "<p><b>" +
        AQClasses[i][1] +
        ": </b>" +
        classLevel +
        classLevelText +
        "</p>";
    } else {
      if (AQClass == 30) {
        var classLevelTwo = parseInt(charClasses["charAt"](AQClass), 36);
        classLevelTwo = classLevelTwo > 10 ? 10 : classLevelTwo;
        response +=
          "<p><b>" + AQClasses[i][1] + ": </b>" + classLevelTwo + "</p>";
      } else {
        if (AQClass == 15) {
          var classLevelThree = parseInt(charClasses["charAt"](35), 36) % 5;
          var knightFaction = [
            "Training",
            "Rennd",
            "Granemor",
            "Deren",
            "Stormfallen",
          ];
          var knightText = " (" + knightFaction[classLevelThree] + ")";
          response +=
            "<p><b>" +
            AQClasses[i][1] +
            ": </b>" +
            parseInt(charClasses["charAt"](AQClass), 36) +
            (parseInt(charClasses["charAt"](AQClass), 36) >= 6 &&
            classLevelThree > 0
              ? knightText
              : "") +
            "</p>";
        } else {
          response +=
            "<p><b>" +
            AQClasses[i][1] +
            ": </b>" +
            parseInt(charClasses["charAt"](AQClass), 36) +
            "</p>";
        }
      }
    }
  }

  if (
    charDetails["extra"] &&
    charDetails["race"] != "None" &&
    charDetails["clan"] != "AQ Team"
  ) {
    var charExtras = charDetails["extra"];
    response += "<hr />";
    response += "<h2><b>Extra</b></h2>";
    response +=
      "<p><b>No-Drop Element: </b>" + charExtras["nodropelement"] + "</p>";
    response += "<p><b>Alignment: </b>" + charExtras["alignment"] + "</p>";
    response +=
      "<p><b>Lucretia's Potions Progress: </b>" +
      charExtras["lucretia"] +
      "</p>";
    response +=
      "<p><b>Guardian Arena (Stage Completed): </b>" +
      charExtras["guardianarena"] +
      "</p>";
    response +=
      "<p><b>Trescol Reputation: </b>" + charExtras["trescol"] + "</p>";
    response +=
      "<p><b>Kairula Reputation: </b>" + charExtras["kairula"] + "</p>";
    response +=
      "<p><b>Awe Armor/Shield: </b>" + charExtras["awearmor"] + "</p>";
    response +=
      "<p><b>UltraGuardian: </b>" + charExtras["ultraguardian"] + "</p>";
    response += "<p><b>Spellcraft: </b>" + charExtras["spellcraft"] + "</p>";
    response +=
      "<p><b>Encountered Un-Trainer? </b>" +
      (charExtras["untrainer"] == 1 ? "Yes" : "No") +
      "</p>";
    response += "<h3><b>Awe Weapon: </b></h3>";
    response +=
      "<p><b>&nbsp;&nbsp;Awe Progress: </b>" +
      charExtras["aweProgress"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Awe Special Alignment: </b>" +
      charExtras["aweSpecialAlignment"] +
      "</p>";
    response += "<h3><b>Crossroads Star Level: </b></h3>";
    response +=
      "<p><b>&nbsp;&nbsp;Smoke Mountains: </b>" +
      charExtras["smokemountain"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Skraeling Desert: </b>" +
      charExtras["skraelingdesert"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Northlands: </b>" + charExtras["northlands"] + "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Kristall Reef: </b>" +
      charExtras["kristallreef"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Dwarfhold Mountains: </b>" +
      charExtras["dwarfhold"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Greenguard Forest: </b>" +
      charExtras["greenguard"] +
      "</p>";
  }

  return response;
}

function toggleMultiscreen() {
  let button = document.getElementById("multiscreenToggle");
  if (isDev) {
    console.log(button.getAttribute("state"));
  }
  if (button.getAttribute("state") == "Off") {
    button.setAttribute("state", "On");
  } else {
    button.setAttribute("state", "Off");
  }

  let tab = tabGroup.getActiveTab();
  let webview = tab.webview;
  webview.executeJavaScript("localToggleMultiscreen()");
  return;
}

let tabGroup = new TabGroup({
  newTab: {
    title: "AdventureQuest",
    src: "aq.html",
    active: true,
    plugins: true,
    webviewAttributes: {
      nodeintegration: "nodeintegration",
    },
    ready: navigate,
  },
  ready: function (tabGroup) {
    dragula([tabGroup.tabContainer], {
      direction: "horizontal",
    });
  },
});

tabGroup.on("tab-active", (tab, tabGroup) => {
  let clipboard_area = document.getElementById("copyClipboard");
  if (tab.webviewAttributes.src.includes("charview")) {
    clipboard_area.innerHTML = "";
    clipboard_area.setAttribute(
      "style",
      "position: relative; display: block; float: right; z-index: 999 !important; margin: 10px 25px;"
    );
    let copyURLButton = document.createElement("input");
    copyURLButton.type = "button";
    copyURLButton.value = "Copy URL";
    copyURLButton.id = "copyUrl";
    copyURLButton.onclick = () => {
      copyURL(tab.webviewAttributes.src, "url");
    };

    let copyIDButton = document.createElement("input");
    copyIDButton.type = "button";
    copyIDButton.value = "Copy ID";
    copyIDButton.id = "copyId";
    copyIDButton.onclick = () => {
      copyURL(tab.webviewAttributes.src, "id");
    };

    clipboard_area.appendChild(copyIDButton);
    clipboard_area.appendChild(copyURLButton);
  } else {
    clipboard_area.setAttribute(
      "style",
      "position: relative; display: none; margin: 20px;"
    );
    clipboard_area.innerHTML = "";
  }
});

tabGroup.on("tab-removed", (tab, tabGroup) => {
  if (isDev) {
    console.log(tabGroup.getTabs());
  }
  if (tabGroup.getTabs().length == 0) {
    tabGroup.addTab({
      title: "AdventureQuest",
      src: "aq.html",
      active: true,
      plugins: true,
      webviewAttributes: {
        nodeintegration: "nodeintegration",
      },
      closable: true,
      ready: navigate,
    });
  }
});

tabGroup.addTab({
  title: "AdventureQuest",
  src: "aq.html",
  active: true,
  plugins: true,
  webviewAttributes: {
    nodeintegration: "nodeintegration",
  },
  closable: true,
  ready: navigate,
});

if (!isDev) {
  tabGroup.addTab({
    title: "Disclaimer",
    src: "disclaimer.html",
    active: true,
  });
}
