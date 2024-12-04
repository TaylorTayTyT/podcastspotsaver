# Podcast Spot Saver

This is a chrome extension to switch listening from Youtube and Spotify. This only works for podcasts.

## How To Install
I didn't want to create my own backend server. 
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

## How To Use
1. When you open the extension, you will default to the authentication page. You need to authenticate before adding podcasts. Click on the authentication button.
2. You will now be able to access the Youtube and Spotify Tags. To add Youtube videos to the Youtube tab, go on YouTube and click on your desired video. Next to the Youtube
video's navigation tools, there will a plus icon. Click on the plus icon to add the current Youtube video to the Youtube tab.
3. On the Spotify panel, your most recent 5 favorited podcasts on Spotify will show up, along with the timestamps. This is automatic. To update this list, favorite your desired podcasts in Spotify. 

On the Youtube panel, clicking on the play icon will automatically play that podcast on Spotify.
On the Spotify panel, clicking on the play icon will automatically open up that Youtube video at the specified timestamp. 