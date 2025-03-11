import { Song, SongGenre } from "./song";

export interface Genre {
    id: string;
    name: string;
    slug: string;
    songs: SongGenre[];
}