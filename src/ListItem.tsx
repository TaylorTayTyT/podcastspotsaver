import "./ListItem.css"

interface ListItemContent {
    title: String,
    time: number
}

function ListItem({ title, time }: ListItemContent) {
    return (
        <div className="listItemContainer">
            <div className="content_container">
                <div className="title">{title}</div>
                <div className="time">{time}</div>
            </div>
            <img className="redirectButton"></img>
        </div>
    )
}

export default ListItem