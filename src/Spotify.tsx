import "./Spotify.css"
import ListItem from "./ListItem"
import { useEffect, useState } from "react";
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";
import ReplayIcon from '@mui/icons-material/Replay';
export default function Spotify({ value }: { value: string }) {
  const [episodes, SetEpisodes] = useState([]);
  const getEpisodes = () => {
    chrome.storage.local.get("access_token", async (result) => {
      const savedEpisodes: any = await fetch("https://api.spotify.com/v1/me/episodes?limit=5", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + result.access_token
        }
      })
        .then((response) => response.json())
        .then((data) => {
          return data.items
        })
        .catch((error) => {
          console.log(error)
        })
      
      if(!savedEpisodes) console.log("could not find a corresponding youtube video")
      let savedEpisodesContentArray = savedEpisodes.map((episode: any) => {
        episode = episode.episode;
        if(episode.name == null) return;
        console.log(episode)
        const img_url = episode.images ? episode.images[0].url : "";
        return new SpotifyEpisodeContent(episode.name, episode.resume_point.resume_position_ms, img_url)
      })
      savedEpisodesContentArray = savedEpisodesContentArray.filter((episode : any) => {return episode != undefined});
      SetEpisodes(savedEpisodesContentArray)
    })
  }


  useEffect(() => {
    if (value == "1") getEpisodes();
  }, [value])

  return (
    <>
    <div className="spotifyHeader">Your 5 Most Recent Saved Spotify Episodes</div>
      {episodes.map((episode: SpotifyEpisodeContent, idx: number) => <ListItem type = {1} time={episode.resume_point} title={episode.name} videos={episodes} videoIdx={idx}/>)}
      <div className="reload" onClick={getEpisodes}>
        <ReplayIcon />
      </div>
    </>
  )
}