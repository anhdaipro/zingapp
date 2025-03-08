import { create } from 'zustand';
import { fetchArrSongApi } from '../api/song';
export interface Song {
    id: string;
    name: string;
    artist_name: string;
    image_cover: string;
  }
interface SongStore {
    songs: Song[];
    song:Song;
    isLoading: boolean;
    error: string | null;
    fetchSongs: () => Promise<void>;
    setSongPlay: (song:Song) => void;
    setTab: (tab_id:number) => void;
    tab_id: number;
    topsong:Song[];
    play:boolean;
    setPlay:() => void;
    visible:boolean;
    setVisible: (value:boolean)=>void
  }
export const useSongStore = create<SongStore>((set) => ({
    songs: [],
    play:false,
    topsong:[],
    tab_id:1,
    isLoading: false,
    error: null,
    song:{id:'',name:'',artist_name:'', image_cover:''},
    setPlay: () => set((state) => ({ play: !state.play })), // Toggle play
    visible: false,
    setVisible: (value)=> set((state) =>({visible: value})),
    setTab: (tab_id) => {
      set({tab_id:tab_id})
    },
    setSongPlay: (song) =>{
      set({song:song})
    },
    fetchSongs: async () => {
      set({ isLoading: true, error: null });
      try {
        const [songsData, zingChartData] = await fetchArrSongApi();
        set({ songs:songsData, isLoading: false ,topsong:zingChartData?.topsongs});
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        });
      }
    },
  }));