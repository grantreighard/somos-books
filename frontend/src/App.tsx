import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && isAuthenticated) {
      navigate("/search");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="App">
      {!isLoading && isAuthenticated ? <p>Welcome, {user?.name}</p> : null}
      {!isLoading && isAuthenticated ? (
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </button>
      ) : null}
    </div>
  );
}

export default App;
