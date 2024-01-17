import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
        <h1>Please log in to be able to use the Book Finder</h1>
        <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
};

export default LoginButton;