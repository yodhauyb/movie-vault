export interface Movie {
  id: number;
  title: string;
  year: number;
  category: string;
  rating: number;
  duration: string;
  poster: string;
  description: string;
}


export const movies: Movie[] = [
  {
    id: 1,
    title: "The Great Adventure",
    year: 1935,
    category: "Adventure",
    rating: 8.2,
    duration: "2h 10min",
    poster: "/posters/movie1.jpg",
    description:
      "A classic adventure movie from the golden era of cinema."
  },

  {
    id: 2,
    title: "Classic Mystery",
    year: 1940,
    category: "Mystery",
    rating: 7.8,
    duration: "1h 45min",
    poster: "/posters/movie2.jpg",
    description:
      "A mysterious story full of suspense and drama."
  },

  {
    id: 3,
    title: "Lost World",
    year: 1930,
    category: "Fantasy",
    rating: 8.5,
    duration: "1h 50min",
    poster: "/posters/movie3.jpg",
    description:
      "An unforgettable journey into an unknown world."
  }
];