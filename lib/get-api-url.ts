import { getSiteURL } from './get-site-url';

export function getApiURL(): string {
  const siteURL = getSiteURL();
  if (siteURL.includes('localhost')) {
    return 'http://localhost:8000';
  }
  // Split the URL into the protocol and the domain part
  const [protocol, domain] = siteURL.split('://');

  // Modify the domain part as before
  const modifiedDomain = domain
    .split('.')
    .map((part, index) => (index === 0 ? `api-${part}` : part))
    .join('.');

  // Recombine the protocol with the modified domain
  return `${protocol}://${modifiedDomain}`;
}
