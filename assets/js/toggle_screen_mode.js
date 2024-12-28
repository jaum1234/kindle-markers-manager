const SCREEN_MODE = {
    DARK: "dark",
    LIGHT: "light"
}

const darken = () => {
    document.querySelector("body").style.background = "black";
    document.querySelector("body").style.color = "white";
}

const lighten = () => {
    document.querySelector("body").style.background = "white";
    document.querySelector("body").style.color = "black";
}

document.querySelector("#light-mode").addEventListener("click", e => {
    document.querySelector("#dark-mode").removeAttribute("hidden");
    e.target.setAttribute("hidden", "");

    localStorage.setItem("screenMode", SCREEN_MODE.DARK);

    darken();   
});

document.querySelector("#dark-mode").addEventListener("click", e => {
    document.querySelector("#light-mode").removeAttribute("hidden");
    e.target.setAttribute("hidden", "");

    localStorage.setItem("screenMode", SCREEN_MODE.LIGHT);

    lighten();
});

(() => {
    const screenMode = localStorage.getItem("screenMode");

    if (screenMode === null) {
        return document.querySelector("#light-mode").removeAttribute("hidden");
    }

    if (screenMode === SCREEN_MODE.DARK) {
        darken();
        document.querySelector("#dark-mode").removeAttribute("hidden");
    } else {
        lighten();
        document.querySelector("#light-mode").removeAttribute("hidden");
    }
})();

