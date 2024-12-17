import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token 
          ? (
            <>
              <button onClick={() => setPage("add")}>add book</button>
              <button onClick={() => setPage("recommended")}>recommended</button>
              <button onClick={() => {
                setToken(null)
                setPage('authors')
              }}>
                logout
              </button>
            </>
          ) : <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <LoginForm
        setToken={setToken}
        show={page === "login"}
        setPage={setPage}
        setFavoriteGenre={setFavoriteGenre}
      />

      <Recommended 
        show={page === "recommended"}
        favoriteGenre={favoriteGenre}
      />
    </div>
  );
};

export default App;
