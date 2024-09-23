export const paths = {
  dashboard: {
    overview: '/',
    movies: { main: '/movies', title: (id: string) => `/movies/${id}` },
    tvShows: { main: '/tv-shows', title: (id: string) => `/tv-shows/${id}` },
    search: '/search',
    addTitle: '/add-title',
    selectTitle: '/select-title',
  },
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  account: '/account',
} as const;
