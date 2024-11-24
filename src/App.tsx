import "./App.css"
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useEffect, useState } from "react";
import { TabPanel } from "@mui/lab";
import Spotify from "./Spotify";
import Youtube from "./Youtube";
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";


function App() {
  const [value, SetValue] = useState("2");
  const [authorized, SetAuthorized] = useState(false);
  chrome.storage.local.onChanged.addListener((e) => {
    console.log("changed")
    if(e.access_token){
      SetAuthorized(true)
    }
    else{
      SetAuthorized(false);
    }
  })
  const onChange = (e: any, value: string) => {
    SetValue(value)
  }

  useEffect(() => {
    chrome.storage.local.get("access_token", (result) => {
      if(result.access_token){
        SetAuthorized(true)
      }
    })
  }, [])
  useEffect(() => {
    console.log("Authorized:", authorized);
  }, [authorized])
  return (
    <>
      <div className="App">
        Podcast Spot Saver
        <TabContext value={value}>
          <TabList aria-label="navigate media" onChange={onChange}>
            <Tab label="Auth" value="2" />
            <Tab id = "youtubeTab" label="Youtube" value="0" disabled = {!authorized}/>
            <Tab id="spotifyTab" label="Spotify" value="1" disabled = {!authorized}/>

          </TabList>
          <TabPanel value="2">
            <button onClick={() => {
              // redirect to the spoitfy authentication page
              chrome.runtime.sendMessage({ type: "greet", payload: "Hello, background!" }, (response: any) => {
                //console.log("Response from background:", response);
              });
            }}>Authenticate</button>
          </TabPanel>
          <TabPanel value="0">
            <Youtube />
          </TabPanel>
          <TabPanel value="1">
            <Spotify value={value} />
          </TabPanel>
        </TabContext>
      </div >

    </>
  );
}

export default App;
