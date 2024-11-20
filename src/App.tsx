import "./App.css"
import ListItem from "./ListItem";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function App() {
  return (
    <>
      <div className="App">
        Podcast Spot Saver
        <Tabs aria-label="disabled tabs example">
          <Tab label="Active" />
          <Tab label="Disabled" disabled />
          <Tab label="Active" />
        </Tabs>
      </div>

    </>
  );
}

export default App;
