import type { githubCommitType } from '../types';

const githubEndPoint = "https://khanos-backend.herokuapp.com/api/github/getCommits/";

export const searchGithubCommits = (search: string) => {
  return fetch(`${githubEndPoint}${search}`)
    .then((response) => response.json() as Promise<{ items: githubCommitType[]; total_count: number; }>)
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
}