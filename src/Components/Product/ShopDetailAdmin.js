import React, { useEffect, useState } from "react";
import Loading from "../SubComponent/Loading";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Message from "../SubComponent/Message";
import Prompt from "../SubComponent/Prompt";
import axios from "axios";

const ShopDetailAdmin = () => {
  const { loading, err, product } = useSelector((state) => state.productDetail);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [message, setMessage] = useState(null);

  const { token } = useSelector((state) => state.persist.userInfo.info);
  const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);

    if (err) {
      setError(err);
    }
  }, []);

  const deleteHandler = () => {
    setShowPrompt(true);
  };

  const deleteConfirm = () => {
    axios
      .delete(`${process.env.REACT_APP_API}/product/${product.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setShow(true);
        setMessage(result.data.message);
      })
      .catch((er) => {
        setShow(true);
        setError(er.response ? er.response.data.error : er.message);
      });
  };

  return (
    <>
      <Message
        show={show}
        onHide={() => {
          setShow(false);
          navigate("/product");
        }}
        error={error}
        message={message}
      />
      <Prompt show={showPrompt} message={"Are you sure delete this product ?"} confirm={deleteConfirm} cancel={() => setShowPrompt(false)} />
      {loading ? (
        <Loading show={true} onHide={false} />
      ) : (
        <section className="detail-product">
          <div className="container-fluid">
            <div className="row my-5 row-content">
              <div className="col-md-4 text-center">
                <p className="top-text-left mb-5" onClick={() => navigate("/product", { replace: true })}>
                  Favorite &amp; Promo <span className="product-text-left">&#8594; {product.name}</span>{" "}
                </p>
                <img src={product.image} alt="" className=" my-3 justify-content-center" width={"82%"} />
                <div className="row">
                  <div className="col-md-12  ">
                    <button className=" cart-button" onClick={deleteHandler}>
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-5">
                <h2 className="top-product-title text-center fw-bold mt-4 ">{product.name}</h2>
                <p className="top-product-desc mt-5 pe-5" id="top-product-desc-res">
                  {product.description}
                </p>
                <p className="top-product-desc mt-5">
                  Delivery only on <span className="day">Monday to friday</span> at <span className="day">1 - 7 pm</span>{" "}
                </p>

                <div className="count mt-5 pt-5">
                  <div>
                    <div className="numb"> {product.stock} pcs</div>
                  </div>
                  <div className="priceDetail">IDR {formatter.format(product.price).split("Rp")[1]}</div>
                </div>

                <div className="row mt-5 p-0">
                  <div className="col-md-12  ">
                    <button className=" staff-button" onClick={() => navigate(`/product/edit-product/${product.id}`)}>
                      Edit Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ShopDetailAdmin;
