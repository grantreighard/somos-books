import { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/appContext";
import { AppContextType } from "../@types/context";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import AxiosInstance from "../helpers/api";
import { toast } from "react-toastify";

const Register = () => {
  const LOWERCASE_REGEX = "^(?=.*[a-z])";
  const UPPERCASE_REGEX = "^(?=.*[A-Z])";
  const DIGIT_REGEX = "^(?=.*[0-9])";
  const SPECIAL_REGEX = "^(?=.*[@$!%*?&#])";
  const LENGTH_REGEX = "^[A-Za-z0-9@$!%*?&#]{12,16}";
  const EMAIL_REGEX =
    // eslint-disable-next-line
    useMemo(
      () =>
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      []
    );

  const navigate = useNavigate();
  const { theme, setIsAuthenticated, setIsLoading, setEmail } = useContext(
    AppContext
  ) as AppContextType;
  const [emailField, setEmailField] = useState("");
  const [emailFieldError, setEmailFieldError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (password) {
      if (!password.match(LOWERCASE_REGEX)) {
        setPasswordError("Must have a lowercase letter");
      } else if (!password.match(UPPERCASE_REGEX)) {
        setPasswordError("Must have an uppercase letter");
      } else if (!password.match(DIGIT_REGEX)) {
        setPasswordError("Must have a digit");
      } else if (!password.match(SPECIAL_REGEX)) {
        setPasswordError("Must have a special character");
      } else if (!password.match(LENGTH_REGEX)) {
        setPasswordError("Must be between 12 and 16 characters");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }, [password]);

  useEffect(() => {
    if (emailField) {
      if (!emailField.match(EMAIL_REGEX)) {
        setEmailFieldError("This does not appear to be an email address.");
      } else {
        setEmailFieldError("");
      }
    } else {
      setEmailFieldError("");
    }
  }, [emailField, EMAIL_REGEX]);

  const submitRegistration = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    if (emailField && password && !emailFieldError && !passwordError) {
      setIsLoading(true);
      AxiosInstance.post("/api/users/register", { email: emailField, password })
        .then((res) => {
          setIsAuthenticated(true);
          setIsLoading(false);
          setEmail(res.data.email);
          navigate("/search");
          toast("Registered successfully.", { type: "success", theme });
        })
        .catch((err) => {
          setIsLoading(false);
          toast("There was a problem registering. Please try again.", {
            type: "error",
            theme,
          });
        });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      submitRegistration(e);
    }
  };

  return (
    <div className={`${theme}`}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:text-white dark:bg-black">
        <ThemeSwitcher />
        <h1 className="text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
          Please register to use Book Finder
        </h1>
        <form className="flex flex-col" onSubmit={submitRegistration}>
          <input
            placeholder="Email address"
            value={emailField}
            onChange={(e) => setEmailField(e.target.value)}
            className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 dark:text-white dark:bg-black w-[300px] mr-2"
            onKeyDown={onKeyDown}
          />
          {emailFieldError && (
            <div className="text-red-500">{emailFieldError}</div>
          )}
          <div className="relative">
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[1px] rounded-md border-black dark:border-white p-2 mt-2 dark:text-white dark:bg-black w-[300px] mr-2"
              type={showPassword ? "text" : "password"}
              onKeyDown={onKeyDown}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[30px] top-[15px]"
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>
          {passwordError && <div className="text-red-500">{passwordError}</div>}
          <button
            type="submit"
            className="border-[1px] border-black dark:border-white p-2 rounded-md mt-2 bg-green-100 dark:bg-green-800"
            disabled={!!passwordError || !!emailFieldError}
          >
            Register
          </button>
        </form>
        <Link to="/login" className="text-cyan-500 mt-[10px]">
          Log in instead
        </Link>
      </div>
    </div>
  );
};

export default Register;
