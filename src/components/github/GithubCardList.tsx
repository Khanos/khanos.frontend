import GithubCard from './GithubCard';

export const GithubCardList = () => {
  return (
    <div className="w-full grid grid-cols-2 gap-x-12 gap-y-12 max-md:grid-cols-1 max-sm:gap-y-14">
      {[1, 2, 3, 4, 5].map((_, index) => <GithubCard key={index} />)}
    </div>
  )
}

export default GithubCardList;