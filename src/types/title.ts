export interface Title {
  id?: number;
  title?: string;
  releaseDate?: Date;
  overview?: string;
  imgUrl?: string;
  movieOrTv?: 'movie' | 'tv' | 'all';
  rating?: number;
  genres?: number[];
  reviews?: number[];
  name?: string;
  firstAirDate?: Date;
  posterPath?: string;
  genreIds?: number[];
}
