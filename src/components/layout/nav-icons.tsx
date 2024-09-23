import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { FilmSlate } from '@phosphor-icons/react/dist/ssr/FilmSlate';
import { House as HouseIcon } from '@phosphor-icons/react/dist/ssr/House';
import { TelevisionSimple } from '@phosphor-icons/react/dist/ssr/TelevisionSimple';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export const navIcons = {
  home: HouseIcon,
  movie: FilmSlate,
  tv: TelevisionSimple,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
