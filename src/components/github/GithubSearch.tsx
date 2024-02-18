import { useEffect, useCallback, useState } from 'react';

export default function GithubSearch() {
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    if(!target.search) {
      return;
    }
    getCommitsData(target.search.value);
  };

  const getCommitsData = useCallback((searchWord: string ) => {
    if(searchWord.length < 4) return;
    fetch(`https://khanos-backend.herokuapp.com/api/github/getCommits/${searchWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.total_count > 0) {
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        console.log('test')
      });
  }, []);

  useEffect(() => {
  }, []);

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col justify-center items-center"> 
        <img className="w-40 h-40 mb-3 rounded-full shadow-lg" src="/img/github.png" alt="Bonnie image"/>
        <div className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
          <h2><span className="">G</span>itHub API</h2>
          <h2><span className="">D</span>emo</h2>
        </div>
        <input 
          className="w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          type="text" 
          id="search" 
          aria-describedby="helper-text-explanation" 
          placeholder="e.g. cheese">
        </input>
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">{`Let's search for some FUN words in the most recent commits for public repositories on GitHub`}</div>
        <button type="submit" className="max-w-60 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">Search</button>
      </div>
    </div>

    // <> 
    //   <div className="github-img">
    //     <h1>Image</h1>
    //   </div>
    //   <div className="">
    //     <h2><span className="">G</span>itHub API</h2>
    //     <h2><span className="">D</span>emo</h2>
    //   </div>
    //   <div className="">
    //     <form onSubmit={handleSubmit}>
    //       <div className="">
    //         {`Let's search for some FUN words in the most recent commits for public repositories on GitHub`}
    //       </div>
    //       <input
    //         className=""
    //         type="text"
    //         placeholder="e.g. cheese"
    //         name='search'
    //         onKeyUp={(e) => {
    //           if (e.key === "Enter") getCommitsData(e.currentTarget.value);
    //         }}
    //       ></input>
    //       <div className="">
    //         {`The use of Inappropriate language is at your own discretion; it's pretty fun, though.`}
    //       </div>
    //       <button className="" type="submit">
    //         SEARCH
    //       </button>
    //     </form>
    //   </div>
    //   <div className="">
    //     <p>
    //       This will initiate an HTTP request to the backend server, where all the magic happens, and then return a JSON response.
    //     </p>
    //     <p>This will render those cards on the right side.</p>
    //     <p>Check it Out:</p>
    //     <ol>
    //       <li>
    //         BackEnd api.
    //         <a href="https://khanos-backend.herokuapp.com/" target="_blank">
    //             HERE
    //         </a>
    //       </li>
    //       <li>
    //         BackEnd Source Code.
    //         <a
    //             href="https://github.com/Khanos/khanos.backend"
    //             target="_blank"
    //             >
    //           HERE
    //         </a>
    //       </li>
    //     </ol>
    //   </div>
    // </>
  )
}
