import type { githubCommitType, urlShortenerType, urlListType } from '../types';

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

export const gerUrlList = () => {
  const apiUrl = new URL(urlShortenerEndPoint);
  return fetch(apiUrl)
    .then((response) => response.json() as Promise<urlListType>)
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
};

export const addShortUrl = (url: string) => {
  const apiUrl = new URL(urlShortenerEndPoint + 'create');
  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ original_url: url })
  })
    .then((response) => response.json() as Promise<urlShortenerType>)
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
};

export const deleteShortUrl = (urlId: string) => {
  const apiUrl = new URL(urlShortenerEndPoint + `delete/${urlId}`);
  return fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json() as Promise<urlShortenerType>)
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
};