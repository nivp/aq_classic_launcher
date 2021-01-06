const isDev = require("electron-is-dev");

class AQTabGroup {
  constructor(container) {
    this.container = container;
    this.multiscreen = false;
    this.tabs = new Map();
    this.getGameVer()
      .then((version) => (this.version = version))
      .then(() => this.addTab())
      .then(() =>
        this.container.removeChild(
          this.container.getElementsByClassName("loading")[0]
        )
      )
      .then(() => {
        let closeButton = document.getElementsByClassName("tabCloseButton")[0];
        closeButton.classList.add("invisible");
      });
  }

  get length() {
    return this.tabs.size;
  }

  // get game version
  getGameVer() {
    let url = "https://aq.battleon.com/game/web";
    let gamever = fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        return parser.parseFromString(html, "text/html");
      })
      .then((html) => {
        let object = html.querySelector("param[name='movie']");
        let version = object.getAttribute("value").split("/").pop();

        return version;
      });
    return gamever;
  }

  // add tab
  addTab() {
    if (this.length >= 6) {
      return;
    }
    let id = 0;
    for (let i = 0; i <= this.length; i++) {
      if (!this.tabs.has(i)) {
        id = i;
      }
    }
    let tab = new AQTab(id, this.version, this);
    this.tabs.set(id, tab);
    this.container.appendChild(tab.node);
    this.resize();
  }

  removeTab(id) {
    if (this.length <= 1) {
      return;
    }
    this.tabs.get(id).removeTab();
    this.tabs.delete(id);

    this.resize();
  }

  resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (this.length <= 0) {
      return;
    }

    let columnCount = 1;
    let rowCount = 1;

    let max_width = 0;
    let max_height = 0;

    // maximize cell size through column search
    for (let i = 1; i <= this.length; i++) {
      let temp_height = height / Math.ceil(this.length / i);
      let temp_width = (temp_height * 4.0) / 3.0;
      if (temp_width * i > (width * i) / (i + 1) && temp_width * i <= width) {
        max_width = temp_width;
        max_height = temp_height;
        columnCount = i;
        rowCount = Math.ceil(this.length / columnCount);
      }
    }

    // maximize cell size through row search
    for (let i = 1; i <= this.length; i++) {
      let temp_width = width / Math.ceil(this.length / i);
      let temp_height = (temp_width * 3.0) / 4.0;
      if (
        temp_height * i > (height * i) / (i + 1) &&
        temp_height * i <= height
      ) {
        max_width = temp_width;
        max_height = temp_height;
        rowCount = i;
        columnCount = Math.ceil(this.length / rowCount);
      }
    }

    let tab_width = max_width;
    let tab_height = max_height;

    this.tabs.forEach((element) => {
      try {
        resizeContent(element.node, tab_height, tab_width);
      } catch {
        console.log(element);
      }
    });
  }
}

class AQTab {
  constructor(id, version, tabgroup) {
    this.id = id;
    this.node = this.createAQObject(id, version);
    this.tabgroup = tabgroup;
  }

  createAQObject(id, version) {
    // create the object
    let object = document.createElement("object");

    // set its attributes
    let attr = {
      classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      id: "aqgameflash1",
      codebase:
        "https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0",
      class: "fullscreen",
    };

    for (const property in attr) {
      object.setAttribute(property, attr[property]);
    }

    // add its parameters
    let params = {
      movie: `https://aq.battleon.com/game/flash/${version}`,
      base: "https://aq.battleon.com/game/flash/",
      FlashVars: "test=1",
      allowScriptAccess: "sameDomain",
      loop: "false",
      menu: "false",
      quality: "High",
      bgcolor: "#333333",
    };

    for (const param in params) {
      let newParam = document.createElement("param");
      newParam.setAttribute(param, params[param]);
      if (param == "movie") {
        newParam.setAttribute("id", `object_${this.id}`);
      }
      object.appendChild(newParam);
    }

    // create the embed
    let embed = document.createElement("embed");

    let embedattr = {
      class: "fullscreen",
      src: `https://aq.battleon.com/game/flash/${version}`,
      FlashVars: "test=1",
      loop: "false",
      menu: "false",
      name: "aqgameflash1",
      swLiveConnect: "true",
      bgcolor: "#333333",
      allowScriptAccess: "sameDomain",
      base: "https://aq.battleon.com/game/flash/",
      type: "application/x-shockwave-flash",
      pluginspage: "https://www.macromedia.com/go/getflashplayer",
      id: "embed_1",
    };

    for (const property in embedattr) {
      embed.setAttribute(property, embedattr[property]);
    }

    // insert the embed into the object
    object.appendChild(embed);

    // create a tab div
    let tab = document.createElement("div");
    tab.classList.add("tabContainer");

    // insert the object into the tab
    tab.appendChild(object);

    // create close button
    let closeButton = document.createElement("input");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("value", "x");
    closeButton.classList.add("tabCloseButton");
    closeButton.onclick = () => {
      global.aqtabs.removeTab(id);
    };
    tab.appendChild(closeButton);

    return tab;
  }

  removeTab() {
    let tab = this.node;
    tab.parentNode.removeChild(tab);
  }
}

function resizeContent(obj, height, width) {
  emb = obj.getElementsByTagName("embed")[0];
  obj.style.height = height;
  obj.style.width = width;
  emb.style.height = height;
  emb.style.width = width;
}

function createAQObject(container, version) {
  // create the object
  let object = document.createElement("object");

  // set its attributes
  let attr = {
    classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    id: "aqgameflash1",
    codebase:
      "https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0",
    class: "fullscreen",
  };

  for (const property in attr) {
    object.setAttribute(property, attr[property]);
  }

  // add its parameters
  let params = {
    movie: `https://aq.battleon.com/game/flash/${version}`,
    base: "https://aq.battleon.com/game/flash/",
    FlashVars: "test=1",
    allowScriptAccess: "sameDomain",
    loop: "false",
    menu: "false",
    quality: "High",
    bgcolor: "#333333",
  };

  for (const param in params) {
    let newParam = document.createElement("param");
    newParam.setAttribute(param, params[param]);
    if (param == "movie") {
      newParam.setAttribute("id", "object_1");
    }
    object.appendChild(newParam);
  }

  // create the embed
  let embed = document.createElement("embed");

  let embedattr = {
    class: "fullscreen",
    src: `https://aq.battleon.com/game/flash/${version}`,
    FlashVars: "test=1",
    loop: "false",
    menu: "false",
    name: "aqgameflash1",
    swLiveConnect: "true",
    bgcolor: "#333333",
    allowScriptAccess: "sameDomain",
    base: "https://aq.battleon.com/game/flash/",
    type: "application/x-shockwave-flash",
    pluginspage: "https://www.macromedia.com/go/getflashplayer",
    id: "embed_1",
  };

  for (const property in embedattr) {
    embed.setAttribute(property, embedattr[property]);
  }

  // insert the embed into the object
  object.appendChild(embed);

  // insert the object into the container
  container.appendChild(object);

  // add onresize to body
  // document.body.onresize = resizeContent;
}

function reduceScreenCount(e) {
  let aqtabs = global.aqtabs;
  aqtabs.removeTab(aqtabs.length - 1);
}

function increaseScreenCount(e) {
  let aqtabs = global.aqtabs;
  aqtabs.addTab();
}

function localToggleMultiscreen() {
  let multiscreenButton = document.getElementsByClassName(
    "multiscreenPopup"
  )[0];
  if (multiscreenButton.classList.contains("invisible")) {
    multiscreenButton.classList.remove("invisible");

    let closeButton = document.getElementsByClassName("tabCloseButton")[0];
    closeButton.classList.remove("invisible");
  } else {
    multiscreenButton.classList.add("invisible");
    while (global.aqtabs.length > 1) {
      aqtabs.removeTab(global.aqtabs.length - 1);
    }

    let closeButton = document.getElementsByClassName("tabCloseButton")[0];
    closeButton.classList.add("invisible");
  }
}

document.body.onload = () => {
  let container = document.getElementById("container");
  global.aqtabs = new AQTabGroup(container);
};
