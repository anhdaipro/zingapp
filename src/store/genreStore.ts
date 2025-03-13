import { create } from 'zustand';
import { Genre,GenreDetail } from '../types/genre';
import { fetchGenreApi, fetchListGenreApi } from '../api/category';
interface GenreStore{
    genres: Genre[];
    genre: GenreDetail | null;
    isLoading: boolean;
    fetchGenres:() => void;
    fetchGenre:(slug:string) => void
}
export const useGenreStore = create<GenreStore>((set) => ({
    genres:[],
    genre: null,
    isLoading:false,
    fetchGenres: async () => {
        set({ isLoading: true });
        try {
            const aGenres = await fetchListGenreApi();
            set({ genres:aGenres, isLoading: false});
        }catch (error) {
            set({
                isLoading: false,
            });
        }
    },
    fetchGenre:async(slug) => {
        set({ isLoading: true });
        try {
            const genre = await fetchGenreApi(slug);
            set({ genre:genre, isLoading: false});
        }catch (error) {
            set({
                isLoading: false,
            });
        }
    }
}))