import { Link } from "react-router-dom";
import { ENDPOINT } from "../urls";
import "./Navbar.css";
import logo from "../assets/logo-no-background.png";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  //TODO shows old results without contenxt on coming back to the page
  const handleSearchInput = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const debounceSearch = useDebouncedCallback(async (value) => {
    setSearching(true);
    const res = await fetch(`${ENDPOINT}/videos/search?s=${value}`);
    const data = await res.json();
    setSearchResult(data);
    console.log(data);
    setSearching(false);
  }, 1000);

  return (
    <nav>
      <ul>
        <li>
          <Link className="logo" to="/">
            <img src={logo} />
          </Link>
        </li>
        <li className="search">
          <input
            className="search-input"
            type="search"
            onChange={handleSearchInput}
            value={searchTerm}
            placeholder="Search"
          />
          {searchTerm && (
            <div className="search-result">
              {searching
                ? "Loading..."
                : searchResult.map((item, i) => (
                    <SearchResultItem key={i} video={item} />
                  ))}
            </div>
          )}
        </li>
        <li>
          <pre>Development Version</pre>
        </li>
      </ul>
    </nav>
  );
}

function SearchResultItem({ video }) {
  return (
    <Link to={video.id} onClick={() => setSearchTerm("")}>
      <div className="search-result-item">
        <img src={video.thumbnail} />
        <p>{video.title}</p>
      </div>
    </Link>
  );
}
