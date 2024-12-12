import "./ListItem.css";
import { PlayArrow } from "@mui/icons-material";
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";
import config from "../config.json";

interface ListItemContent {
    title: string,
    time: number,
    videos: SpotifyEpisodeContent[],
    videoIdx: number,
    type: number, //0 for youtube, 1 for spotify
    setWarning?: Function
}

function ListItem({type, title, time, videos, videoIdx, setWarning}: ListItemContent) {
    //for youtube need to retirve from spoitfy whic video it is
    function formatTime(time: number) {
        const hrs = Math.floor(time / 1000 / 60 / 60);
        const min = Math.floor((time / 1000 / 60)) - hrs * 60;
        const sec = Math.floor((time / 1000) % 60);
        const ms = ((time / 1000) % 1).toPrecision(2).split('.')[1];
        return [hrs, min, sec, ms];
    }



    async function redirectToDifferentPlatform(){
        if(!type){
            //coming from youtube, switch to spotify
            const access_token = await chrome.storage.local.get("access_token");

            if(!access_token){
                return false; 
            };

            const episodes = await fetch("https://api.spotify.com/v1/search?" + new URLSearchParams({q: title}).toString() + "&type=episode&limit=5", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + access_token.access_token,
                }
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                return data.episodes.items
            })
            .catch((error) => {
                if(setWarning){
                    setWarning("We couldn't find an episode for this on Spotify. Sorry!")
                }
            })
            if(!episodes){
                return;
            }

            //episodes has 5 items, but for now we will just redirect to the first one
            console.log(episodes);
            const episode = episodes[0];
            console.log(episode);

            const body = {
                uris: [episode.uri],
                position_ms: time >> 0 
            }
            
            //currently requires an active player
            fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + access_token.access_token
                },
                body: JSON.stringify(body)
            }).then((response) => response.json()).then((data) => {
                console.log("daflskfksajfjsd");
                console.log(data);
                if(data && data.error && data.error.reason === "NO_ACTIVE_DEVICE" && setWarning){
                    setWarning("Something went wrong.Try opening up Spotify on any device and playing anything. This will mark the device as active and we can then play the episode.");
                }
                else if(data && !data.error && setWarning){
                    setWarning(""); 
                }
            })
            .catch((error) => {
                console.log("errr")
                console.log(error)
                if(error.error.reason === "NO_ACTIVE_DEVICE" && setWarning){
                    setWarning("Try opening up Spotify on any device and playing anything. This will mark the device as active and we can then play the episode.");
                }
            })
        }
        else{
            //coming from spotify, switch to youtube
            const params = {
                part: 'snippet',
                q: title,
                type: 'video',
                maxResults: "5",
                key: config.YOUTUBE_API
            }

            const videos = await fetch("https://youtube.googleapis.com/youtube/v3/search?" + new URLSearchParams(params).toString())
            .then((response) => response.json())
            .then((data) => {
                return data.items;
            })
            if(videos.length == 0) {
                alert("Sorry, couldn't find a corresponding Youtube video!")
                return;
            } 
            const videoIds = videos.map((video: any) => {
                return video.id.videoId;
            });

            const firstVideo = videoIds[0];
            

            chrome.runtime.sendMessage({ type: "redirect", videoId: firstVideo, videoTime: (time / 1000).toString() });
            
        }
    }

    const [hrs, min, sec, ms] = formatTime(time); 
    const formattedTime = `${hrs}:${min}:${sec}`;
    return (
        <div className="listItemContainer">
            <div className="content_container">
                <div className="title">{title.substring(0, 15)}...</div>
                <div className="time"><b>{formattedTime}</b></div>
            </div>
            <div className="arrowButton" onClick={redirectToDifferentPlatform}>
                <PlayArrow />
            </div>
        </div>
    )
}

export default ListItem