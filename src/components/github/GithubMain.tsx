
import { useState } from 'react';
import GithubSearch from './GithubSearch';
import GithubCardList from './GithubCardList';
import GithubWorkflow from './GithubWorkflow';
import type { githubCommitType } from '../../types';

export const GithubMain = () => {
  const [commits, setCommits] = useState<githubCommitType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  return (
    <div className='flex flex-col items-center'>
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
      <GithubWorkflow />
    </div>
  )
}

export default GithubMain;