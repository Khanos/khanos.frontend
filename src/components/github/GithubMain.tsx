
import { useState } from 'react';
import GithubSearch from './GithubSearch';
import GithubCardList from './GithubCardList';
import GithubWorkflow from './GithubWorkflow';
import type { githubCommitType } from '../../types';

export const GithubMain = () => {
  const [commits, setCommits] = useState<githubCommitType[]>([]);
  const [searchQuery, setSearchQuery] = useState('cheese');
  const [loading, setLoading] = useState(false);
  
  return (
    <>
      <GithubWorkflow />
      <GithubSearch 
        setLoading={setLoading}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        commits={commits} 
        setCommits={setCommits} 
      />
      <GithubCardList 
        loading={loading} 
        commits={commits} 
        searchQuery={searchQuery}
      />
    </>
  )
}

export default GithubMain;