import type { GithubCardProps } from '../../types';

const findAndReplace = (string: string, word: string) => {
  const stringLimit = 300;
  const regex = new RegExp(word, 'gi');
  const newString = string.replace(regex, `<span class='text-[#F800AE] text-lg font-bold'>${word}</span>`);
  if (newString.length > stringLimit) {
    return `${newString.substring(0, stringLimit)}...`;
  }
  return newString;
}

const GithubCard: React.FC<GithubCardProps> = (props) => {
  const { commit, searchQuery } = props;
  const { author, commit: { message, author: { date, name } }, repository, html_url } = commit;
  const formatedMessage = findAndReplace(message, searchQuery);
  const getAvatar = () => {
    if (author) {
      return author.avatar_url;
    }
    const hash = Math.random().toString(36).substring(5);
    return `https://gravatar.com/avatar/${hash}?s=200&d=robohash&r=x`;
  }
  return (
    <div
      className="flex flex-row max-sm:flex-col items-center rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <img
        className="h-auto w-40 max-sm:w-30 max-xs:w-20 rounded-t-lg object-cover md:h-auto md:!rounded-none md:!rounded-l-lg"
        src={getAvatar()}
        alt="The avatar of an user" />
      <div className="w-full flex flex-col justify-start p-6">
        <h3
          className="text-xl font-medium text-neutral-800 dark:text-neutral-50">
          Author: {name}
        </h3>
        <div
          className="mb-4 break-words text-sm text-ellipsis text-wrap font-medium text-neutral-700 dark:text-neutral-200">
            Repository: <a target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline" href={repository.html_url}>
            {repository.name}</a>, {repository.description || 'No description'}
        </div>
        <p 
          className="mb-4 break-words text-base text-neutral-600 dark:text-neutral-200"
          dangerouslySetInnerHTML={{ __html: formatedMessage}}
        >
        </p>
        <p className="text-xs text-right text-neutral-500 dark:text-neutral-300">
          <a href={html_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline">
            {new Date(date).toLocaleDateString()}
          </a>
        </p>
      </div>
    </div>
  )
}

export default GithubCard;