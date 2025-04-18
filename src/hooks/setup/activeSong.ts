import { useSongStore } from "../../store/songStore";
import { Song } from "../../types/song";
import { useLyrics, useStreaming } from "../queries/useSong";

export const useSongActive = (song: Song) => {
    const { data: streaming } = useStreaming(song.id);
    const {data:res} = useLyrics(song.id)
    const {setSongPlay} = useSongStore()
    const setSongActive = () => {
      if (!streaming) return;
      const songUpdate = { ...song, file: streaming.file };
      console.log(songUpdate)
      setSongPlay(songUpdate);
    };
    const setLyrics = () => {
        if (!res.lyrics && res.sentences) return;    
        const songUpdate = { ...song, lyrics: res.lyrics,sentences:res.sentences };
        console.log(songUpdate)
        setSongPlay(songUpdate);
    }
    return { setSongActive,setLyrics };
  };