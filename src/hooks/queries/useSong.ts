import { useQuery } from "@tanstack/react-query";
import { fetchArrSongApi, fetchSongsApi,fetchStreamingApi,fetchTopSongApi } from "../../api/song";
export const useSongs = () =>{
    return useQuery({
        queryKey:['songs'],
        queryFn: fetchSongsApi,
        staleTime:1000*60,
        
    })
}
export const useTopSongs = () =>{
    return useQuery({
        queryKey:['topsongs'],
        queryFn: fetchTopSongApi,
        staleTime:1000*60,
        
    })
}
export const useStreaming = (id:string) =>{
    return useQuery({
        queryKey:['streaming', id],
        queryFn: async () => {
            const res = await fetchStreamingApi(id)
            return res
        },
        staleTime:1000*60*60,
    })
}