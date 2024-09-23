import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

// Define an array of navigation items
export const navItems: NavItemConfig[] = [
  // Home navigation item
  { key: 'overview', title: 'Home', href: paths.dashboard.overview, icon: 'home' },
  // Movies navigation item
  {
    key: 'movies',
    title: 'Movies',
    href: paths.dashboard.movies.main,
    matcher: { href: paths.dashboard.movies.main, type: 'startsWith' },
    icon: 'movie',
  },
  // TV Shows navigation item
  {
    key: 'tv-shows',
    title: 'Tv Shows',
    href: paths.dashboard.tvShows.main,
    matcher: { href: paths.dashboard.tvShows.main, type: 'startsWith' },
    icon: 'tv',
  },
  // Account navigation item
  {
    key: 'account',
    title: 'Account',
    href: paths.account,
    icon: 'user',
    
  },
];
