import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CartSection from "../Components/Cart/CartSection";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Loading from "../Components/SubComponent/Loading";
import Message from "../Components/SubComponent/Message";
import { userPayment } from "../Redux/Actions/UserAction";

const Cart = () => {
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { message, error, loading } = useSelector((st) => st.userPayment);

  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Juncoffee - Cart";
    setModalMessage(null);
    setErrorMessage(null);
    if (message) {
      setModalMessage(message);
      setShow(true);
      return;
    }

    if (error) {
      setErrorMessage(error);
      setShow(true);
      return;
    }

    if (state) {
      if (state.token) {
        dispatch(userPayment(state.token));
      }
    }
  }, [errorMessage, modalMessage, message]);

  return (
    <>
      <Header />
      {loading ? <Loading show={true} onHide={false} /> : <></>}
      <Message
        show={show}
        onHide={() => {
          setShow(false);
          if (state) {
            window.history.replaceState({ ...state.token }, "");
            delete state.token;
          }
        }}
        message={modalMessage}
        error={errorMessage}
      />
      <CartSection />
      <Footer />
    </>
  );
};

export default Cart;
