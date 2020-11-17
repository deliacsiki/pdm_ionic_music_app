export interface Song {
    _id?: string;
    name: string;
    artist: string;
    releaseDate: Date;
    downloaded: boolean;
}