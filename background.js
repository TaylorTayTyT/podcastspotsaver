chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.type === "greet") {
        // Perform some action
        console.log("Hello from the popup!");
        chrome.action.setPopup({popup: "js/callback.html"})
        sendResponse({ status: "success", data: "Redirecting to callback" });
    }
});