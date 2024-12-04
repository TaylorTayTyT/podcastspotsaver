# Podcast Spot Saver

This is a chrome extension to switch listening from Youtube and Spotify. This only works for podcasts.

## How To Use
You will need your own Spotify API key, Spotify Secret, and Youtube API Key. Create a config.json file in the dist root directory that looks the following:

file name: config.json
```
{
    "CLIENT_SECRET": "[spotify client secret]",
    "CLIENT_ID": "[spotify client id]",
    "REDIRECT_URI": "https://.chromiumapp.org/",
    "YOUTUBE_API": "[youtube api key]"
}

```

1. Go to your extensions tag, and then click on "Manage Extensions". 
2. Click on load unpacked. 
3. Upload the dist folder.
4. Done!
