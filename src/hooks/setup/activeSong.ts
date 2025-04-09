import { useSongStore } from "../../store/songStore";
import { Song } from "../../types/song";
import { useStreaming } from "../queries/useSong";

export const useSongActive = (song: Song) => {
    const { data: streaming } = useStreaming(song.id);
    const {setSongPlay} = useSongStore()
    const setSongActive = () => {
      if (!streaming) return;
      const songUpdate = { ...song, file: streaming.file };
      setSongPlay(songUpdate);
    };
  
    return { setSongActive };
  };