import "./ListItem.css";
import { PlayArrow } from "@mui/icons-material";

interface ListItemContent {
    title: String,
    time: number
}

function ListItem({ title, time }: ListItemContent) {

    function formatTime(time: number) {
        const min = Math.floor((time / 1000 / 60) << 0)
        const sec = Math.floor((time / 1000) % 60);
        const ms = ((time / 1000) % 1).toPrecision(2).split('.')[1];
        return [min, sec, ms];
    }

    const [min, sec, ms] = formatTime(time); 
    const formattedTime = `${min}:${sec}:${ms}`;
    return (
        <div className="listItemContainer">
            <div className="content_container">
                <div className="title">{title.substring(0, 20)}</div>
                <div className="time">{formattedTime}</div>
            </div>
            <div className="arrowButton" onClick={() => { }}>
                <PlayArrow />
            </div>
        </div>
    )
}

export default ListItem