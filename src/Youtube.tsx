import ListItem from "./ListItem";
import "./Youtube.css";
import AddIcon from '@mui/icons-material/Add';
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";
import { useState, useEffect, useRef } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
export default function Youtube() {
    const activeVideo = useRef<number | null>(null);

    const [videos, SetVideos] = useState<SpotifyEpisodeContent[]>([]);

    useEffect(() => chrome.storage.onChanged.addListener((changes, areaName) => {
        console.log("changed")
        if (areaName === 'local' && changes.youtubeData) {
            const youtubeData = changes.youtubeData.newValue;
            videos.push(new SpotifyEpisodeContent(youtubeData.title, youtubeData.time, youtubeData.img));
            chrome.storage.local.remove("youtubeData");
        }
    }))

    async function retrieveYoutubeVideosSaved(){
        const youtubeVideos : SpotifyEpisodeContent[] = [];
        chrome.storage.local.get("youtubeData", (result) => {
            result.youtubeData.forEach((element: any) => {
                youtubeVideos.push(new SpotifyEpisodeContent(element.title, element.time, element.img));
            })
            SetVideos(youtubeVideos);
        })
    };

    function deleteSavedYoutubeVideo(e: any){
        console.log(e)
        console.log(e.key)
    }

    useEffect(() => {
        retrieveYoutubeVideosSaved();
    }, []);
    useEffect(() =>{
        document.querySelectorAll(".youtubeListItem").forEach((element) => {
            element.addEventListener("mouseover", (event) => {
                const deleteIcon : SVGElement | null = element.querySelector("svg");
                if(deleteIcon != null) {
                    deleteIcon.style.opacity = "1";
                    //todo set the current active video on whative video is being hovered over
                    activeVideo.current = element.data-video-idx; 
                }
            });
            element.addEventListener("mouseout", (event) => {
                const deleteIcon : SVGElement | null = element.querySelector("svg");
                if(deleteIcon != null) deleteIcon.style.opacity = "0";
            })
        })
    }, [videos])


    return (
        <>
            {videos.map((video, idx) => <div data-video-idx = {idx} className="youtubeListItem"><DeleteIcon onClick={deleteSavedYoutubeVideo} className="deleteIcon"/><ListItem key={video.name} time={video.resume_point} title={video.name} /></div>)}
        </>
    )
}