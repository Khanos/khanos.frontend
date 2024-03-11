import type { githubCommitType, urlShortenerType } from '../types';

const githubEndPoint = "https://khanos-backend.herokuapp.com/api/github/getCommits/";
const urlShortenerEndPoint = "https://khanos-backend.herokuapp.com/api/url/";

export const searchGithubCommits = (search: string) => {
  return fetch(`${githubEndPoint}${search}`)
    .then((response) => response.json() as Promise<{ items: githubCommitType[]; total_count: number; }>)
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
}

export const getUrlData = ( urlId: string ) => {
  const apiUrl = new URL(urlShortenerEndPoint + urlId);
  return fetch(apiUrl)
    .then((response) => response.json() as Promise<urlShortenerType>)
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
}