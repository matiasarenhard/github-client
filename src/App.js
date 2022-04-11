import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!username) return;

    fetch(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`)
      .then((response) => response.json())
      .then((data) => {
        const result = data.sort((a, b) => (a.stargazers_count < b.stargazers_count ? 1 : -1));
        setRepos(data);
      });
  }, [username]);
  
  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    await fetch(`https://api.github.com/search/users?q=${query}`)
      .then(response => response.json())
      .then((data) => setSearchResults(data.items));
    setIsLoading(false);
  }

  return( <main>
    <section className='search'>
      <input type="search"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
        placeholder='Username' />
      
      <button onClick={handleSearch} disabled={ isLoading }>
        { isLoading ? "Searching..." : "Search"}
      </button>

      {!!searchResults.length && (<>
        <h1>Results :</h1>
        <ul>
          {searchResults.map((user) => (
            <li key={user.id}>
              <img src={user.avatar_url} alt={`Photo of ${user.login}`} />
              {user.login}
              {username === user.login ? " ✓" : (
                <button onClick={() => setUsername(user.login)}>Select</button>  
              )}
            </li>
          ))} 
        </ul>
      </>)}
    </section>
    <section className='repos'>
      {username ? (
        <>
          <h1>Repositories of {username} : </h1>

          { repos.length ? (
            <ul>
              {repos.map((repo) =>
         
                <li key={repo.id}>{repo.name} ({repo.stargazers_count})</li>
              )}
            </ul>
          ) : (
            "Building"
          )}
        </>
      ) : (
        <p>Search  for username </p>
      )}
    </section>
  </main >);
}

export default App;
