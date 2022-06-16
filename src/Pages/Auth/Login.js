import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { resetState, userConfirm, userLogin } from "../../Redux/Actions/UserAction";
import Loading from "../../Components/SubComponent/Loading";
import Message from "../../Components/SubComponent/Message";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { loading, errorLogin, isLoggedIn } = useSelector((st) => st.userLogin);
  const { errorConfirm, confirmMessage } = useSelector((st) => st.userConfirm);
  const { logoutMessage } = useSelector((st) => st.userLogout);
  const { registerMessage } = useSelector((st) => st.userRegist);

  useEffect(() => {
    document.title = "Juncoffee - Login";

    setErrorMsg(null);
    setMessage(null);
    if (errorLogin) {
      setErrorMsg(errorLogin);
      return;
    }
    if (errorConfirm) {
      setErrorMsg(errorConfirm);
      setShowMessage(true);
      return;
    }
    if (confirmMessage) {
      setMessage(confirmMessage);
      setShowMessage(true);
      return;
    }
    if (registerMessage) {
      setMessage(registerMessage);
      setShowMessage(true);
      return;
    }
    if (logoutMessage) {
      setMessage(logoutMessage);
      setShowMessage(true);
      return;
    }
    if (state) {
      if (state.message) {
        setMessage(null);
        setErrorMsg(null);
        setShowMessage(true);
        setMessage(state.message);
        return delete state.message;
      }
      (() => {
        window.history.replaceState({}, { ...state });
        return delete state.token;
      })();
    }
  }, [confirmMessage, logoutMessage, errorLogin, errorConfirm]);

  if (state) {
    if (state.token) {
      dispatch(userConfirm(state.token));
      return;
    }
  }

  if (isLoggedIn) {
    navigate("/", { replace: true });
  }

  const buttonHandler = (e) => {
    e.preventDefault();
    dispatch(resetState());
    const body = { email, password };
    dispatch(userLogin(body));
  };

  const showPassHandler = () => {
    setShowPassword(true);
  };

  const hidePassHandler = () => {
    setShowPassword(false);
  };

  return (
    <>
      {loading ? <Loading show={true} onHide={false} /> : <></>}
      <Message
        show={showMessage}
        onHide={() => {
          setShowMessage(false);
        }}
        message={message}
        error={errorMsg}
      />
      <div className="container-auth">
        <div className="column-image">
          <img src={require("../../assets/img/robert-bye-95vx5QVl9x4-unsplash.jpg")} className="side-image-login" alt="aside" />
        </div>
        <div className="column-main">
          <header className="side-title">
            <img src={require("../../assets/img/coffee-1.png")} className="logo" alt="logo-icon" />
            <h2 className="header-title">Juncoffee</h2>
            <h1 className="page-title">Login</h1>
          </header>
          <section className="register">
            <form className="register-form" onSubmit={buttonHandler}>
              {errorMsg ? <div className="text-danger fw-bold fs-6">{errorMsg}</div> : <></>}
              <label htmlFor="email">Email Address :</label>
              <input
                type="text"
                name="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                required
              />
              <label htmlFor="password">Password :</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                required
              />
              <span>{showPassword ? <EyeSlash size={30} className="eye-icon" onClick={hidePassHandler}></EyeSlash> : <Eye size={30} className="eye-icon" onClick={showPassHandler}></Eye>}</span>
              <a href="/forgot-password" className="forgot-pass">
                Forgot Password ?
              </a>
              <button type="submit" className="register-button">
                Login
              </button>
              <button className="google-button">
                <img src={require("../../assets/img/google-logo-png-suite-everything-you-need-know-about-google-newest-0 2.png")} alt="google-icon" /> Login with Google
              </button>
            </form>
            <section className="already-account">
              <div className="underline"></div>
              <p className="already-account-text m-0">Don't have an account?</p>
              <div className="underline"></div>
            </section>
            <Link to={"/auth/register"}>
              <button className="login-here-button login-here-text">Sign up Here</button>
            </Link>
          </section>
          <footer className="login">
            <aside className="describe" aria-label="">
              <img src={require("../../assets/img/coffee-1.png")} className="logo" alt="logo-icon" />
              <h2 className="footer-title"> &nbsp;Juncoffee</h2>
              <p className="footer-text mt-3">Juncoffee is a store that sells some good meals, and especially coffee. We provide high quality beans</p>
              <img src={require("../../assets/img/fb.png")} alt="fb-icon" />
              <img src={require("../../assets/img/twitter.png")} alt="twitter-icon" />
              <img src={require("../../assets/img/ig.png")} alt="ig-icon" />
              <p className="footer-text mt-3 pb-3">@2022Juncoffee</p>
            </aside>
            <aside className="link mt-3 ms-5 ps-5" aria-label="">
              <h2 className="link-title">Product</h2>
              <div className="link-item">
                <Link to={"#"}>Download</Link>
                <Link to={"#"}>Pricing</Link>
                <Link to={"#"}>Locations</Link>
                <Link to={"#"}>Countries</Link>
                <Link to={"#"}>Blog</Link>
              </div>
              <h2 className="link-title mt-3">Engage</h2>
              <div className="link-item">
                <Link to={"#"}>Coffe Shop ?</Link>
                <Link to={"#"}>About Us</Link>
                <Link to={"#"}>FAQ</Link>
                <Link to={"#"}>Privacy Policy</Link>
                <Link to={"#"}>Terms of Service</Link>
              </div>
            </aside>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Login;
