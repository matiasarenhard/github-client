import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    await fetch(`https://api.github.com/search/users?q=${query}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.items);
      });
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
    <section className='repos'>Repositories</section>
  </main >);
}

export default App;
