export const normalizeUrl = (url: string) => url.startsWith('/entry/') ? `https://www.eksisozluk.com${url}` : url;