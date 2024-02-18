import GithubCard from './GithubCard';
import type { GithubCardListProps } from '../../types';

const GithubCardList: React.FC<GithubCardListProps> = (props) => {
  const { loading, commits, searchQuery } = props;

  if(loading) {
    return (
      <div className="flex justify-center items-center mb-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-x-12 gap-y-12 max-sm:gap-y-14 mb-4">
      {commits && commits.map((commit, index) => <GithubCard commit={commit} searchQuery={searchQuery} key={index} />)}
    </div>
  )
}

export default GithubCardList;