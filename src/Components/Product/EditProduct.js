import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import Message from "../SubComponent/Message";

const EditProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDesc] = useState("");
  const [category, setCategory] = useState(0);
  const { id } = useParams();

  const { token } = useSelector((state) => state.persist.userInfo.info);
  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_API}/product/detail/${id}`);
        const { data } = result.data;

        switch (data.category) {
          case "non-coffee":
            setCategory(4);
            break;
          case "Coffee":
            setCategory(2);
            break;
          case "Foods":
            setCategory(1);
            break;
          default:
            break;
        }

        setProduct(data);
      } catch (err) {
        setError(err.respose ? err.response.data.error : err.message);
      }
    })();
    document.title = "Juncoffe - Edit Product";
  }, [id]);

  const updateHandler = () => {
    const body = {
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      category_id: Number(category),
    };
    axios
      .patch(`${process.env.REACT_APP_API}/product/${id}`, body, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setMessage(result.data.message);
        setShowMessage(true);
      })
      .catch((er) => {
        setError(er.response ? er.response.data.error : er.message);
        setShowMessage(true);
      });
  };
  return (
    <>
      <Header />
      <Message
        show={showMessage}
        onHide={() => {
          setShowMessage(false);
          window.location.reload();
          window.scrollTo({ behavior: "smooth", top: "0px" });
        }}
        message={message}
        error={error}
      />
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {" "}
          <section class="edit-product">
            <div class="container-fluid">
              <div class="row mt-4">
                <div class="col-md-4 text-center">
                  <p className="top-text-left mb-5" onClick={() => navigate("/product", { replace: true })}>
                    Favorite &amp; Promo <span className="product-text-left">&#8594; {product.name} &#8594; Edit product</span>{" "}
                  </p>
                </div>
              </div>
              <div class="row">
                <div className="col-md-4 text-center">
                  <img src={require("../../assets/img/edit-product-img.png")} alt="" />
                  <p className="top-product-desc my-5 text-black">
                    Delivery only on <span className="day text-black">Monday to friday</span> at <span className="day text-black">1 - 7 pm</span>{" "}
                  </p>
                </div>
                <div class="col-md-6">
                  <input type="text" className="user-contact-text mt-3" name="product_name" defaultValue={product.name} placeholder="Type product name min. 50 characters" onChange={(e) => setName(e.target.value)} />
                  <input type="text" className="user-contact-text mt-5" name="product_price" defaultValue={product.price} placeholder="Type product price" onChange={(e) => setPrice(e.target.value)} />
                  <textarea rows={2} type="text" className="user-contact-text mt-5" name="product_desc" defaultValue={product.description} placeholder="Type product description" onChange={(e) => setDesc(e.target.value)} />
                  <input type="text" className="user-contact-text mt-5" name="product_price" defaultValue={product.stock} placeholder="Type product price" onChange={(e) => setStock(e.target.value)} />

                  <button
                    className={category === 2 ? "product-add-cat-active mt-5 mx-4" : "product-add-cat mt-5 mx-4"}
                    onClick={() => {
                      setCategory(2);
                    }}
                  >
                    Coffee
                  </button>
                  <button
                    className={category === 4 ? "product-add-cat-active mt-5 mx-4" : "product-add-cat mt-5 mx-4"}
                    onClick={() => {
                      setCategory(4);
                    }}
                  >
                    Non-Coffee
                  </button>
                  <button
                    className={category === 1 ? "product-add-cat-active mt-5 mx-4" : "product-add-cat mt-5 mx-4"}
                    onClick={() => {
                      setCategory(1);
                    }}
                  >
                    Foods
                  </button>

                  <button className="save-edit-prod w-100" onClick={updateHandler}>
                    Save Change
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </>
  );
};

export default EditProduct;
