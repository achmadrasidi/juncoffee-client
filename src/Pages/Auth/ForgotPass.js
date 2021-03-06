import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import bgForgot from "../../assets/img/nani-williams-6PpLqUlCA0s-unsplash.jpg";
import Footer from "../../Components/Footer";
import Message from "../../Components/SubComponent/Message";
import { userForgot } from "../../Redux/Actions/UserAction";
import Loading from "../../Components/SubComponent/Loading";
import { useDispatch, useSelector } from "react-redux";

const ForgotPass = () => {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [load, setLoad] = useState(false);
  const [errorPass, setErrorPass] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showEditPass, setShowEditPass] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useParams();
  const { success, err, loading } = useSelector((state) => state.userForgot);

  useEffect(() => {
    document.title = "Juncoffee - Forgot Password";
    if (email) {
      setShowEditPass(true);
    }
    if (success) {
      setMessage(success);
      setShowMessage(true);
    }
    if (error) {
      setShowMessage(true);
    }
  }, [email, success, error]);

  const sendEmailHandler = () => {
    dispatch(userForgot(emails));
  };

  const changePassHandler = (e) => {
    e.preventDefault();
    const body = { newPassword, email };
    if (!newPassword || !confirmPassword) {
      setErrorPass("Password cannot be empty");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorPass("Password not match");
      return;
    }
    setLoad(true);
    setShowEditPass(false);
    axios
      .patch(`${process.env.REACT_APP_API}/user/forgot-password`, body)
      .then((result) => {
        setLoad(false);
        setMessage(result.data.message);
        setShowMessage(true);
      })
      .catch((errr) => {
        setLoad(false);
        setError(errr.response ? errr.response.data.error : errr.message);
        setShowMessage(true);
      });
  };

  return (
    <>
      {loading || load ? <Loading show={true} onHide={false} /> : <></>}
      <Message
        show={showMessage}
        onHide={() => {
          setShowMessage(false);
          window.scrollTo({ behavior: "smooth", top: "0px" });
          navigate("/auth/login", { replace: true });
        }}
        message={message}
        error={error || err}
      />
      <Modal show={showEditPass} onHide={() => setShowEditPass(false)} backdrop="static" keyboard={true}>
        <Modal.Header>
          <Modal.Title></Modal.Title>
          <Modal.Body>
            <label htmlFor="password">Enter New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              className="user-contact-text"
              name="password"
              onChange={(e) => {
                setErrorPass(null);
                setNewPassword(e.target.value);
              }}
            ></input>
            <span>{showNewPassword ? <EyeSlash size={30} className="eye-icon-prof" onClick={() => setShowNewPassword(false)}></EyeSlash> : <Eye size={30} className="eye-icon-prof" onClick={() => setShowNewPassword(true)}></Eye>}</span>
            <label htmlFor="password">Confirm New Password</label>
            <input
              type={showConPassword ? "text" : "password"}
              className="user-contact-text"
              name="password"
              onChange={(e) => {
                setErrorPass(null);
                setConfirmPassword(e.target.value);
              }}
            ></input>
            <span>{showConPassword ? <EyeSlash size={30} className="eye-icon-prof" onClick={() => setShowConPassword(false)}></EyeSlash> : <Eye size={30} className="eye-icon-prof" onClick={() => setShowConPassword(true)}></Eye>}</span>
            {errorPass ? <p className="text-danger fw-bold fs-6">{errorPass}</p> : <></>}
          </Modal.Body>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowEditPass(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={changePassHandler}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="forgotContainer">
        <img className="forgotImg" src={bgForgot} alt="" />
        <div className="forgotForm">
          <div className="forgotTitle">
            <span>Forgot your password</span>
            <p>Don't worry, we got your back</p>
          </div>
          <div className="inputForgot">
            <input
              type="text"
              placeholder="input your email adress to get link"
              onChange={(e) => {
                setEmails(e.target.value);
              }}
            />
            <span onClick={sendEmailHandler}>Send</span>
          </div>
          <div className="forgotReceive" id="forgot-rec-res">
            <p className="text-center forgot-receive-text">
              Click Here if you didn't receive any link <br /> in 2 minutes
            </p>

            <div className="resendLink" id="resend-link-res">
              Resend Link
            </div>
            <p>01 : 54</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPass;
