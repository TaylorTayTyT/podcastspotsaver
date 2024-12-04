import "./App.css"
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useEffect, useState } from "react";
import { TabPanel } from "@mui/lab";
import Spotify from "./Spotify";
import Youtube from "./Youtube";
import { Button } from "@mui/material";
import animation from "./authGIF.json";
import Lottie from "lottie-react";
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
          <TabPanel id="authPanel" value="2">
            <Button id="authButton" onClick={() => {
              // redirect to the spoitfy authentication page
              chrome.runtime.sendMessage({ type: "auth", payload: "Hello, background!" });
            }}>Authenticate</Button>
            <Lottie animationData={animation} loop autoplay />
            <span style={{ fontSize: "0.5rem" }}>credit to: <a>https://lottiefiles.com/irfanmunawar</a></span>
          </TabPanel>
          <TabPanel value="0">
            <Youtube checkAuthorization={checkAuthorization} />
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
