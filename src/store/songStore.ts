import { create } from 'zustand';
import { fetchArrSongApi } from '../api/song';
import Video, { OnProgressData, OnLoadData,VideoRef } from 'react-native-video';
import { MutableRefObject } from "react";
import type { DirectEventHandler, Double, Float, Int32, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
// Định nghĩa kiểu dữ liệu cho store
export interface Song {
  id: string;
  name: string;
  artist_name: string;
  image_cover: string;
  file?: string;
  duration:number;
  lyrics?: any[] | null; // Thay thế unknown bằng kiểu dữ liệu thực tế nếu có
  sentences?: any[] | null; // Thay thế unknown bằng kiểu dữ liệu thực tế nếu có
}

interface SongStore {
  songs: Song[];
  play: boolean;
  topsong: Song[];
  tab_id: number;
  isLoading: boolean;
  error: string | null;
  song: Song;
  visible: boolean;
  setPlay: (value:boolean) => void;
  setVisible: (value: boolean) => void;
  setTab: (tab_id: number) => void;
  setSongPlay: (song: Song) => void;
  fetchSongs: () => Promise<void>;
  component:string
  setComponet: (component:string) => void;
  stylesModal:any;
  setStyles: (stylesModal:any) => void;
  viewVisible:number;
  setViewVisible: (viewVisible:number) => void;
  videoRef: MutableRefObject<VideoRef | null>;
  setVideoRef: (ref: MutableRefObject<VideoRef | null>) => void;
  currentTime: Float; // Thời gian hiện tại của video
  setCurrentTime: (currentTime: Float) => void; // Hàm cập nhật thời gian hiện tại
  seek: (time: Float) => void; // Hàm tua đến thời gian cụ thể
  isSliding: boolean; // Trạng thái kéo thanh trượt
  setIsSliding: (isSliding: boolean) => void; // Hàm cập nhật trạng thái kéo thanh trượt
}

// Tạo Zustand store với persist
export const useSongStore = create<SongStore>(
    (set,get) => ({
      songs: [],
      play: false,
      topsong: [],
      tab_id: 1,
      isLoading: true,
      error: null,
      visible: false,
      song: { id: '', name: '', artist_name: '', image_cover: '', file:'', duration:0, lyrics: null,sentences: null },
      setPlay: (value) => {
        set({ play: value});
      },
      setVisible: (value) => set({ visible: value }),
      setTab: (tab_id) => set({ tab_id }),
      setSongPlay: (song) =>{
        set({song:song, play:false})
      },
      
      fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
          const [songsData, zingChartData] = await fetchArrSongApi();
          set({ songs: songsData, isLoading: false, topsong: zingChartData?.topsongs });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
        }
      },
      component:'',
      setComponet: (component) => set({ component }),
      stylesModal:{
        justifyContent: "flex-end", // Đưa modal xuống dưới cùng
        margin: 0, // Loại bỏ khoảng cách xung quanh
      },
      setStyles: (stylesModal) => set({ stylesModal }),
      
      viewVisible: 1,
      setViewVisible: (viewVisible) => set({ viewVisible }),
      videoRef: {current:null}, // Giá trị mặc định của ref
      setVideoRef: (ref) => set({ videoRef: ref }), // Cập nhật ref
      currentTime:0,
      setCurrentTime: (currentTime) => set({ currentTime }), // Hàm cập nhật thời gian hiện tại
      seek: (time) => {
        set({currentTime:time})
      },
      isSliding: false, // Trạng thái kéo thanh trượt
      setIsSliding: (isSliding) => set({ isSliding }), // Hàm cập nhật trạng thái kéo thanh trượt

    }),
    
);
