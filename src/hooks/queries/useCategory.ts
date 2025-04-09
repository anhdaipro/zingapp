import { useQuery } from "@tanstack/react-query";
import { fetchArrSongApi, fetchSongsApi,fetchTopSongApi } from "../../api/song";
import { fetchGenreApi, fetchListGenreApi } from "../../api/category";
export const useGenres = () =>{
    return useQuery({
        queryKey:['genres'],
        queryFn: fetchListGenreApi,
        staleTime:1000*6,
        
    })
}
export const useGenre = (slug:string) =>{
    return useQuery({
        queryKey:['genre',slug],
        queryFn:async() => {
            const res = await fetchGenreApi(slug)
            return res
        },
        staleTime:1000*6,
        
    })
}