import { useState } from "react"

export default function SpotifyAuthentication(){
    const [loading, SetLoading] = useState(true);
    const params = new URL(window.location.href).searchParams;
    if(params.has("code")) SetLoading(false);
    return(
        <>
        {loading ? <>loading</> : <>successful</>}
        </>
    )
}