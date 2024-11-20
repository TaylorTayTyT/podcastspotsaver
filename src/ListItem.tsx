import "./ListItem.css"

interface ListItemContent{
    title: String, 
    time: String
}

function ListItem({title, time}: ListItemContent){
    return(
    <div className="listItemContainer">
        <div className="textContent">{title}</div>
        <div>{time}</div>
        <img className="redirectButton"></img>
    </div>
    )
}

export default ListItem