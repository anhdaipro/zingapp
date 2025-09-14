import { useQuery } from "@tanstack/react-query"
import { fetchArtistInfo } from "../../api/artist"

export const useArtist = (name:string) =>{
    return useQuery({
        queryKey:['artist',name],
        queryFn:async() => {
            const res = await fetchArtistInfo(name)
            return res
        },
        staleTime:1000*6,
        
    })
}