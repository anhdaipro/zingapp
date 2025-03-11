import { create } from 'zustand';
import { Genre } from '../types/genre';
import { fetchListGenreApi } from '../api/category';
interface GenreStore{
    genres: Genre[];
    genre: Genre | null;
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
    fetchGenre:(slug) => {

    }
}))