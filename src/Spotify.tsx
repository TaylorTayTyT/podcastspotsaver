import "./Spotify.css"
import ListItem from "./ListItem"
import { useState } from "react";
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";
export default function Spotify({value} : {value: string}){
    const [episodes, SetEpisodes] = useState([]);
    const getEpisodes = () => {
        chrome.storage.local.get("access_token", async (result) => {
          console.log(result)
          const savedEpisodes: any = await fetch("https://api.spotify.com/v1/me/episodes?limit=10", {
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
            console.error(error)
          })
    
          const savedEpisodesContentArray = savedEpisodes.map((episode: any) => {
            episode = episode.episode;
            console.log(episode)
            console.log(episode.resume_point)
            return new SpotifyEpisodeContent(episode.name, episode.resume_point.resume_position_ms, episode.images[0].url)
          })
    
          SetEpisodes(savedEpisodesContentArray)
      })}
    if(value == "1") getEpisodes();

    return(
        <>
        {episodes.map((episode: SpotifyEpisodeContent) => <ListItem time={episode.resume_point} title={episode.name}/>)}
        
        </>
    )
}