function getCurrentTimeStamp() {
    //haha this needs to be in the service worker
    let currTime = document.querySelector(".ytp-time-current");
    if (currTime) {
        currTime = currTime.innerText;
        console.log(currTime);
    }
}
const editorExtensionId = "hcojcpcaccjamndobapdoihkmjdmcpll";
const url = window.location.href;

function addVideoSpot(){
    const currTime = document.querySelector(".html5-main-video").currentTime;
    const title = document.querySelector("h1.style-scope.ytd-watch-metadata").children[0].innerText;
    const img = document.querySelector("#avatar.style-scope.ytd-video-owner-renderer.no-transition").querySelector("img").src
    chrome.runtime.sendMessage(editorExtensionId, { type: "time",  time: currTime, title: title, img: img },
    function (response) {
        if (!response.success)
            console.log("error");
    });
}

try {
    const newButton = document.createElement("button");
    newButton.innerHTML = `<svg height="100%" viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22Zm0-13.75a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25V15a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h2.25V9a.75.75 0 0 1 .75-.75Z" fill="#FFCCCC"></path></svg>`;
    newButton.id = "get-current-time";
    console.log(newButton);
    newButton.classList.add("ytp-fullscreen-button");
    newButton.classList.add("ytp-button");
    newButton.addEventListener("click", addVideoSpot);
    document.querySelector(".ytp-right-controls").prepend(newButton);
} catch (e) {
    console.log(e);
}