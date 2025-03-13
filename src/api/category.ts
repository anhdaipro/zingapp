import axios from "axios"
import {api} from './url'
export const genresURL=`${api}/v1/genres`
export const genreURL=`${api}/v1/genre`

export const fetchListGenreApi = async () =>{
    const res = await axios.get(genresURL)
    return res.data;
}
export const fetchGenreApi = async (slug:string) =>{
    const res = await axios.get(`${genreURL}/${slug}`)
    return res.data;
}