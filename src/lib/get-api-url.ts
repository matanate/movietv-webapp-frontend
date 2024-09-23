import { getSiteURL } from './get-site-url';

export function getApiURL(): string {
  const siteURL = getSiteURL();
  if (siteURL.includes('localhost')) {
    return 'http://localhost:8000';
  }
  return `${siteURL}backend/`;
}
