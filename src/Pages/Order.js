import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Message from "../Components/SubComponent/Message";
import { groupByTransaction } from "../helper/groupByTransaction";

const Order = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);
  const { token } = useSelector((state) => state.persist.userInfo.info);
  useEffect(() => {
    document.title = "Juncoffee - Orders";
    (async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_API}/transaction`, { headers: { Authorization: `Bearer ${token}` } });
        const group = groupByTransaction(result.data.data, "transaction_id");
        setData(Object.entries(group));
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      }
    })();
  }, []);
  const limitData = data.map((item) => item);
  const dataId = data.map((item) => item[1].find((val) => val.transaction_id === item[0]).transaction_id).slice(start, end);

  const updateOrder = () => {
    axios
      .patch(`${process.env.REACT_APP_API}/transaction/${dataId[0]}`, { data: null }, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setShowMessage(true);
        setMessage(result.data.message);
      })
      .catch((e) => {
        setShowMessage(true);
        setError(e.response ? e.response.data.error : e.message);
      });
  };

  return (
    <>
      <Message
        show={showMessage}
        message={message}
        error={error}
        onHide={() => {
          setShowMessage(false);
          window.location.reload();
        }}
      />
      <Header />
      <section className="cart">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h1 className="checkout-title my-5 ps-5 ms-5" id="checkout-title-res">
                Finish your customer order now!
              </h1>
            </div>
          </div>
          {error ? (
            <>
              <h1 className="history-title text-center mt-5">{error}</h1>
            </>
          ) : (
            data
              .map((item) => (
                <div className="row ps-5 ms-5 card-between-row" id="card-between-row-res">
                  <div className="col-md-4 ms-5 ps-5" id="card-between-col-res">
                    <div className="card cart-card-layout">
                      <div className="card-body">
                        <div className="row mt-3 ">
                          <div className="col-md-12">
                            <h2 className="cart-product-title text-center">Order {item[0]} </h2>
                            <p className="text-order-for">for {item[1][0] ? item[1][0].user_email : "John Doe"} </p>
                          </div>
                        </div>
                        {item[1].map((val) => (
                          <div className="row mt-3 cart-row-border pb-4 ps-0">
                            <div className="col-md-3 cart-row-col">
                              <img src={val.image} width="100%" alt="" className="image-cart-product" />
                            </div>
                            <div className="col-md-6 ">
                              <p className="cart-product-text m-0">{val.product_name}</p>

                              <p className="cart-product-text m-0">x{val.quantity}</p>
                              <p className="cart-product-text m-0">{val.size}</p>
                            </div>
                            <div className="col-md-3">
                              <p className="cart-product-text">IDR {val.price * val.quantity}</p>
                            </div>
                          </div>
                        ))}
                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-6">
                                {" "}
                                <p className="cart-price-text m-0">SUBTOTAL</p>{" "}
                              </div>
                              <div className="col-md-6">
                                {" "}
                                <p className="cart-price-text text-center m-0">IDR {item[1][0].subtotal}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                {" "}
                                <p className="cart-price-text m-0">TAX &amp; FEES</p>{" "}
                              </div>
                              <div className="col-md-6 ">
                                {" "}
                                <p className="cart-price-text text-center m-0">IDR {item[1][0].tax_price}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                {" "}
                                <p className="cart-price-text m-0">SHIPPING</p>{" "}
                              </div>
                              <div className="col-md-6">
                                {" "}
                                <p className="cart-price-text text-center m-0">IDR {item[1][0].shipping_price}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row ms-2 mt-5 mb-3 ">
                          <div className="col-md-6">
                            <p className="cart-total-price">TOTAL</p>
                          </div>
                          <div className="col-md-6">
                            <p className="cart-total-price">IDR {item[1][0].total}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {end < limitData.length && (
                      <button
                        className="upcoming-button mt-5"
                        onClick={() => {
                          setStart((s) => s + 1);
                          setEnd((e) => e + 1);
                          window.scrollTo({ behavior: "smooth", top: "0px" });
                        }}
                      >
                        Click to see Next orders <ArrowUp />
                      </button>
                    )}

                    {start > 0 && (
                      <button
                        className="upcoming-button-back mt-3"
                        onClick={() => {
                          setStart((s) => s - 1);
                          setEnd((e) => e - 1);
                          window.scrollTo({ behavior: "smooth", top: "0px" });
                        }}
                      >
                        Click to see Prev orders <ArrowDown />
                      </button>
                    )}
                  </div>
                  <div className="col-md-4 ">
                    <div className="row">
                      <div className="col-md-6">
                        <h2 className="cart-detail-title">Address details</h2>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card card-cart-delivery">
                          <div className="card-body mt-2">
                            <div className="row">
                              <div className="col-md-12 ">
                                <p className="delivery-text border-bottom m-0">
                                  <span className="fw-bold">Delivery </span> to&nbsp;
                                  <b>{item[1][0] ? item[1][0].user_email.split("@")[0] : "John Doe"} </b> Address
                                </p>
                              </div>
                            </div>
                            <div className="row my-3">
                              <div className="col-md-12">
                                <textarea rows={2} type="text" disabled className="user-contact-text" placeholder="Detail Address" value={item[1][0].address ? item[1][0].address : "No Address"}></textarea>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <input type="text" disabled className="user-contact-text" placeholder="Contact Detail" value={"No Contact Detail"}></input>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <h2 className="cart-detail-title">Payment method</h2>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card card-cart-payment">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12 mt-2">
                                <input type="radio" name="gender" disabled value="card" checked={item[1][0] && item[1][0].payment_method === "card"} />
                                <label htmlFor="gender" className="male-icon-text ms-3 mb-0">
                                  <img src={require("../assets/img/payment-icon.png")} alt="" />
                                </label>
                                <span className="payment-text ms-2">Card</span>
                                <div className="border ms-4 mt-2"></div>
                              </div>
                            </div>

                            <div className="row my-3">
                              <div className="col-md-12">
                                <input type="radio" name="gender" value="bank account" disabled checked={item[1][0] && item[1][0].payment_method === "bank account"} />
                                <label htmlFor="gender" className="male-icon-text ms-3 mb-0">
                                  <img src={require("../assets/img/bank-icon.png")} alt="" />
                                </label>
                                <span className="payment-text ms-2 ">Bank Account</span>
                                <div className="border ms-4 mt-2"></div>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-12">
                                <input type="radio" name="gender" disabled value="cash on delivery" checked={item[1][0] && item[1][0].payment_method === "cash on delivery"} />
                                <label htmlFor="gender" className="male-icon-text ms-3 mb-0 ">
                                  <img src={require("../assets/img/delivery-icon.png")} alt="" />
                                </label>
                                <span className="payment-text ms-2 ">Cash on delivery</span>
                                <div className="border ms-4 mt-2"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <button className="button-cart-pay w-100 mt-4" onClick={updateOrder}>
                          Mark as done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              .slice(start, end)
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Order;
