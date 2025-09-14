import axios from "axios"
import { lyricsongURL, streamingURL } from "./url"
export const api='https://zingmp3server.vercel.app/api'
export const originURL='https://zingmp3server.vercel.app'
export const listsongURL=`${api}/v1/songs`
export const zingchartURL = `${api}/v2/zingchart`


export const fetchArrSongApi = async () =>{
    const [songsRes, zingChartRes] = await axios.all([
        axios.get(listsongURL),
        axios.get(zingchartURL)
    ])
    return [songsRes.data,zingChartRes.data];
    
}
export const fetchSongsApi = async () =>{
    const res = await axios.get(`${listsongURL}`)
 
    return res.data
}
export const fetchTopSongApi = async () =>{
    const res = await axios.get(`${zingchartURL}`)
    return res.data
}
export const fetchStreamingApi = async (id: string) =>{
    const res = await axios.get(`${streamingURL}/${id}`)
    return res.data
}
export const fetchLyricApi = async (id: string) =>{
    const res = await axios.get(`${lyricsongURL}?id=${id}`)
    return res.data
}