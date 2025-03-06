import axios from "axios"
export const api='https://zingmp3server.vercel.app/api'
export const originURL='https://zingmp3server.vercel.app'
export const listsongURL=`${api}/v1/songs`
export const zingchartURL = `${api}/v2/zingchart`


export const fetchArrSongApi = async () =>{
    const [songsRes, zingChartRes] = await axios.all([
        axios.get(listsongURL),
        axios.get(zingchartURL)
    ])
    console.log(zingChartRes.data)
    return [songsRes.data, zingChartRes.data];
    
}