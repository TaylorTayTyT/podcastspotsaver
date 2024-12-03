function getCurrentTimeStamp() {
    //haha this needs to be in the service worker
    let currTime = document.querySelector(".ytp-time-current");
    if (currTime) {
        currTime = currTime.innerText;
        console.log(currTime);
    }
}
let editorExtensionId = "hcojcpcaccjamndobapdoihkmjdmcpll";
const url = window.location.href;
console.log("execute")

function addVideoSpot() {
    const currTime = document.querySelector(".html5-main-video").currentTime;
    const title = document.querySelector("h1.style-scope.ytd-watch-metadata").children[0].innerText;
    const img = document.querySelector("#avatar.style-scope.ytd-video-owner-renderer.no-transition").querySelector("img").src
    chrome.runtime.sendMessage(editorExtensionId, { type: "time", time: currTime, title: title, img: img },
        function (response) {
            if (!response.success)
                console.log("error");
        });
}

try {
    if (!document.getElementById("get-current-time")) {
        const newButton = document.createElement("button");
        newButton.innerHTML = `<svg width="25" height="75%" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25"><rect x=".5" y=".5" width="24" height="24" rx="4.5" stroke="#fff"/></mask><g mask="url(#a)"><rect width="25" height="25" rx="5" fill="url(#b)"/></g><rect x="13.184" y="6" width="13" height="1.368" rx=".684" transform="rotate(90 13.184 6)" fill="#fff"/><rect x="19" y="13.184" width="13" height="1.368" rx=".684" transform="rotate(-180 19 13.184)" fill="#fff"/><defs><linearGradient id="b" x1="-10.5" y1="35.5" x2="38.5" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="red"/><stop offset="1" stop-color="#1ED760"/></linearGradient></defs></svg>`;
        newButton.id = "get-current-time";
        console.log(newButton);
        newButton.classList.add("ytp-fullscreen-button");
        newButton.classList.add("ytp-button");
        newButton.addEventListener("click", addVideoSpot);
        document.querySelector(".ytp-right-controls").prepend(newButton);
    }
} catch (e) {
    console.log("podcastspotsaver")
    console.log(e);
}