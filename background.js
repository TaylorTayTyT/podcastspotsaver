chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.type === "greet") {
        // Perform some action

        const env = await fetch("config.json").then((response) => response.json());

        console.log("Hello from the popup!");

        const state = Math.random().toString(36).substring(2, 15);
        const scope = 'user-library-read user-read-playback-position';

        const body = {
            response_type: "code",
            client_id: env.CLIENT_ID,
            redirect_uri: chrome.identity.getRedirectURL(),
            state: state,
            scope: scope
        };

        const params = new URLSearchParams(body);

        const auth_url = 'https://accounts.spotify.com/authorize?' + params.toString();
        // i think i have to change the redirect uri to chromiumapp https://developer.chrome.com/docs/extensions/reference/api/identity#type-WebAuthFlowDetails
        console.log(auth_url)
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

                console.log('Authorization Code:', code);
                console.log('State:', state);
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
                    console.log(data)
                    chrome.storage.local.set({ "access_token": data.access_token, "refresh_token": data.refresh_token }, () => {
                        if (chrome.runtime.lastError) {
                          console.error("Error saving data:", chrome.runtime.lastError);
                        } else {
                          console.log("Access and refresh tokens saved successfully!");
                        }
                      });
                })
                .catch((error) => {
                    console.error(error);
                });
            });
    }
});
