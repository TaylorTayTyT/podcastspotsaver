import "./App.css"
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useEffect, useState } from "react";
import { TabPanel } from "@mui/lab";
import Spotify from "./Spotify";
import Youtube from "./Youtube";
import { Button } from "@mui/material";


function App() {
  const [value, SetValue] = useState("2");
  const [authorized, SetAuthorized] = useState(false);
  chrome.storage.local.onChanged.addListener((e) => {
    if(e.access_token){
      SetAuthorized(true)
    }
    else{
      SetAuthorized(false);
    }
  });

  function checkAuthorization(){
    chrome.storage.local.get("access_token", (result) => {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          "Authorization": "Bearer " + result.access_token
        }
      })
      .then((response) => {
        if(response.status != 200) SetAuthorized(false);
        else SetAuthorized(true);
      })
      .catch((error) => SetAuthorized(false))
})}

  useEffect(() => {
    checkAuthorization(); 
  }, [])

  useEffect(() => {
    console.log("Authorized:", authorized);
  }, [authorized])
  return (
    <>
      <div className="App">
        Podcast Spot Saver
        <TabContext value={value}>
          <TabList aria-label="navigate media" onChange={(e: any, value: string) => {SetValue(value)}}>
            <Tab label="Auth" value="2" />
            <Tab id = "youtubeTab" label="Youtube" value="0" disabled = {!authorized}/>
            <Tab id="spotifyTab" label="Spotify" value="1" disabled = {!authorized}/>

          </TabList>
          <TabPanel value="2">
            <Button onClick={() => {
              // redirect to the spoitfy authentication page
              chrome.runtime.sendMessage({ type: "auth", payload: "Hello, background!" });
            }}>Authenticate</Button>
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
