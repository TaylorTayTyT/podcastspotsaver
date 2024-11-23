chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.type === "greet") {
        // Perform some action

        const env = await fetch("config.json").then((response) => response.json());

        console.log("Hello from the popup!");

        const state = Math.random().toString(36).substring(2, 15);
        const scope = 'user-read-private user-read-email';

        const body = {
            response_type: "code",
            client_id: env.CLIENT_ID,
            redirect_uri: env.REDIRECT_URI,
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
                console.log("ahhh")
                const urlParams = new URL(redirect_url).searchParams;
                const code = urlParams.get('code');
                const state = urlParams.get('state');

                console.log('Authorization Code:', code);
                console.log('State:', state);
            });
        //sendResponse({ status: "success", data: "Redirecting to callback" });
    }
});
