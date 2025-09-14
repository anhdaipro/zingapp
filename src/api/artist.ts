import axios from "axios"
import { artistInfohURL } from "./url"

export const fetchArtistInfo = async (name:string) =>{
    const res = await axios.get(`${artistInfohURL}?name=${name}`)
    return res.data
}