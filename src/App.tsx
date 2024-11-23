import "./App.css"
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useState } from "react";
import { TabPanel } from "@mui/lab";
import Spotify from "./Spotify";
import Youtube from "./Youtube";
import SpotifyEpisodeContent from "./SpotifyEpisodeContent";


function App() {
  const [value, SetValue] = useState("0");
  const onChange = (e: any, value: string) => {
    SetValue(value)
  }
  return (
    <>
      <div className="App">
        Podcast Spot Saver
        <TabContext value={value}>
          <TabList aria-label="navigate media" onChange={onChange}>
            <Tab label="Youtube" value="0" />
            <Tab label="Spotify" value="1" />
          </TabList>
          <TabPanel value="0">
            <Youtube />
          </TabPanel>
          <TabPanel value="1">
            <Spotify value = {value}/>
          </TabPanel>
        </TabContext>
        <button onClick={() => {
          // redirect to the spoitfy authentication page
          chrome.runtime.sendMessage({ type: "greet", payload: "Hello, background!" }, (response: any) => {
            console.log("Response from background:", response);
          });
        }}>redirect</button>
      </div >

    </>
  );
}

export default App;
