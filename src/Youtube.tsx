import ListItem from "./ListItem";
import "./Youtube.css";
import AddIcon from '@mui/icons-material/Add';
export default function Youtube() {
    function addYoutubeSpot(){
        chrome.runtime.sendMessage({ type: "addYoutube", payload: "Hello, background!" });
    }
    return (
        <>
            <ListItem time={1} title={"Youtube Title"} />
            <div className="addButton" onClick={addYoutubeSpot}>
                <AddIcon />
            </div>
        </>
    )
}