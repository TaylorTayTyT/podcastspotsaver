chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Received message:", message);
    function setAccessAndRefreshTokens(data) {
        chrome.storage.local.set({ "access_token": data.access_token, "refresh_token": data.refresh_token }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving data:", chrome.runtime.lastError);
            } else {
                console.log("Access and refresh tokens saved successfully!");
            }
        });
        sendResponse({ message: "Success" });
    }

    if (message.type === "time") {
        console.log("time: ", message);
        const tempYoutubeData = await chrome.storage.local.get("youtubeData");
        if (!tempYoutubeData.youtubeData) tempYoutubeData.youtubeData = [];
        if(tempYoutubeData.youtubeData.length >= 5) {
            sendResponse({ error: "Limit Reached" });
        }
        else tempYoutubeData.youtubeData.forEach((element, idx) => {
            if (element.title === message.title) {
                tempYoutubeData.youtubeData.pop(idx);
            }
        });
        console.log("adding");
        console.log({ time: message.time * 1000, title: message.title, img: message.img })
        tempYoutubeData.youtubeData.push({ time: message.time * 1000, title: message.title, img: message.img });
        chrome.storage.local.set(tempYoutubeData);
        sendResponse({ message: "Success" });
    }

    if (message.type === "auth") {
        // Perform some action
        const env = await fetch("config.json").then((response) => response.json());

        function authProcess() {
            const state = Math.random().toString(36).substring(2, 15);
            const scope = 'user-library-read user-read-playback-position user-modify-playback-state';

            const body = {
                response_type: "code",
                client_id: env.CLIENT_ID,
                redirect_uri: chrome.identity.getRedirectURL(),
                state: state,
                scope: scope
            };

            const params = new URLSearchParams(body);

            const auth_url = 'https://accounts.spotify.com/authorize?' + params.toString();
            chrome.identity.launchWebAuthFlow({
                url: auth_url,
                interactive: true
            },
                (redirect_url) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                        return;
                    }
                    const urlParams = new URL(redirect_url).searchParams;
                    const code = urlParams.get('code');
                    const state = urlParams.get('state');

                    fetch('https://accounts.spotify.com/api/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + btoa(env.CLIENT_ID + ':' + env.CLIENT_SECRET)
                        },
                        body: 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + chrome.identity.getRedirectURL()
                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            setAccessAndRefreshTokens(data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
        }

        const refresh_token = await chrome.storage.local.get("refresh_token");
        if(Object.keys(refresh_token).length == 0) {
            console.log('no refresh')
            authProcess();
            return;
        };
        console.log(refresh_token)
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(env.CLIENT_ID + ':' + env.CLIENT_SECRET)
            },
            body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh_token.refresh_token, client_id: env.CLIENT_ID }).toString()
        }).then(response => response.json()).then(data => {
            setAccessAndRefreshTokens(data);
        })
            .catch((error) => {
                authProcess();
            });

    }

    if (message.type === "redirect") {

        const params = {
            v: message.videoId,
            t: message.videoTime
        }
        if(!(params.v && params.t)) return; 
        console.log(params)
        const youtubeBaseUrl = "https://www.youtube.com/watch?";

        console.log(youtubeBaseUrl + new URLSearchParams(params).toString())

        chrome.tabs.create({ url: youtubeBaseUrl + new URLSearchParams(params).toString() });

    }
});

chrome.runtime.onInstalled.addListener(async () => {
    if (await chrome.storage.local.get("youtubeData")) //means the user has storage with this same key
        chrome.storage.local.set({ "youtubeData": [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.url.includes("youtube.com/watch") && tab.status === "complete") {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content-script.js"]
        })
    }
});