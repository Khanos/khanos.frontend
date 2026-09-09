import type { githubCommitType, urlShortenerType, urlListType } from '../types';

const githubEndPoint = "https://khanos-backend.herokuapp.com/api/github/getCommits/";
const urlShortenerEndPoint = "https://khanos-backend.herokuapp.com/api/url/";

export const searchGithubCommits = async (search: string) => {
  const response = await fetch(`${githubEndPoint}${search}`)
  const data = await response.json() as Promise<{ items: githubCommitType[]; total_count: number; }>
  return data;
}

export const getUrlData = async ( urlId: string ) => {
  const apiUrl = new URL(urlShortenerEndPoint + urlId);
  const response = await fetch(apiUrl);
  const data = await response.json() as Promise<urlShortenerType>;
  return data;
}

export const gerUrlList = async () => {
  const apiUrl = new URL(urlShortenerEndPoint);
  const response = await fetch(apiUrl);
  const data = await response.json() as Promise<urlListType>;
  return data;
}

export const addShortUrl = async (url: string) => {
  const apiUrl = new URL(urlShortenerEndPoint + 'create');
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ original_url: url })
  });
  const data = await response.json() as Promise<urlShortenerType>;
  return data;
}

export const deleteShortUrl = async (urlId: string) => {
  const apiUrl = new URL(urlShortenerEndPoint + `delete/${urlId}`);
  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json() as Promise<urlShortenerType>;
  return data;
}