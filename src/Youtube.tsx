import ListItem from "./ListItem";
import "./Youtube.css";
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";
import { useState, useEffect, useRef, SetStateAction } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
export default function Youtube({checkAuthorization}: {checkAuthorization: Function}) {
    const activeVideo = useRef<string | null>(null);

    const [videos, SetVideos] = useState<SpotifyEpisodeContent[]>([]);
    const [warning, SetWarning] = useState("*make sure to have your spotify playing something so the spotify player is active!");

    useEffect(() => chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.youtubeData) {
            chrome.storage.local.get("youtubeData", (result) => {
                console.log("setting")
                console.log(result);
                const videoList: SpotifyEpisodeContent[] = [];
                result.youtubeData.forEach((element: any) => {
                    videoList.push(new SpotifyEpisodeContent(element.title, element.time, element.img));
                });
                SetVideos(videoList);
            })
        }
    }))

    async function retrieveYoutubeVideosSaved() {
        const youtubeVideos: SpotifyEpisodeContent[] = [];
        chrome.storage.local.get("youtubeData", (result) => {
            if (!result || !result.youtubeData) return;
            result.youtubeData.forEach((element: any) => {
                youtubeVideos.push(new SpotifyEpisodeContent(element.title, element.time, element.img));
            })
            SetVideos(youtubeVideos);
        })
    };

    async function deleteSavedYoutubeVideo(e: any) {
        const tempYoutubeData = await chrome.storage.local.get("youtubeData");
        if (tempYoutubeData.youtubeData) {
            const youtubeDataArr = tempYoutubeData.youtubeData
            youtubeDataArr.pop(activeVideo.current);
            chrome.storage.local.set({ "youtubeData": youtubeDataArr }, ()=>{
                checkAuthorization(); 
            });

        }
    }

    useEffect(() => {
        retrieveYoutubeVideosSaved();
    }, []);
    useEffect(() => {
        if (videos.length == 0) return;
        //add the trash effect 
        document.querySelectorAll(".youtubeListItem").forEach((element) => {
            element.addEventListener("mouseover", (event) => {
                const deleteIcon: SVGElement | null = element.querySelector("svg");
                if (deleteIcon != null) {
                    deleteIcon.style.opacity = "1";
                    //todo set the current active video on whative video is being hovered over
                    activeVideo.current = element.getAttribute("data-video-idx");
                }
            });
            element.addEventListener("mouseout", (event) => {
                const deleteIcon: SVGElement | null = element.querySelector("svg");
                if (deleteIcon != null) deleteIcon.style.opacity = "0";
            })
        });

    }, [videos])


    return (
        <>
            {videos.map((video, idx) =>
                <div data-video-idx={idx} className="youtubeListItem">
                    <DeleteIcon onClick={deleteSavedYoutubeVideo} className="deleteIcon" />
                    <ListItem type={0}videos={videos} videoIdx={idx} key={video.name} time={video.resume_point} title={video.name}/>
                </div>)}
        </>
    )
}