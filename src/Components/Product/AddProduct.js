import axios from "axios";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import Message from "../SubComponent/Message";
import { AddProdPrompt } from "../SubComponent/Prompt";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [price, setPrice] = useState(null);
  const [description, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.persist.userInfo.info);

  useEffect(() => {
    document.title = "Juncoffee - Add Product";
  }, []);

  const handleFoto = (e) => {
    let reader = false;

    e.preventDefault();
    setError({ ...error, file: null });
    const files = e.target.files[0];

    setFile(files);
    const imageType = /image\/(png|jpg|jpeg)/i;
    if (files) {
      reader = new FileReader();
      reader.onload = (ev) => {
        const { result } = ev.target;
        if (!!result) setFileUrl(result);
      };
    }
    if (!files) {
      setError({ ...error, file: "No File Selected" });
      return;
    }
    if (!files.type.match(imageType)) {
      setError({ ...error, file: "Invalid image type (png,jpg,jpeg)" });
      return;
    }
    reader.readAsDataURL(files);
  };

  const saveProduct = () => {
    const body = {
      name,
      price,
      description,
      stock,
      category_id: category,
      photo: file,
    };
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    axios
      .post(`${process.env.REACT_APP_API}/product`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } })
      .then((result) => {
        setMessage(result.data.message);
        setId(result.data.data.id);
        setShowMessage(true);
      })
      .catch((err) => {
        setError(err.response ? err.response.data.error : err.message);
        setShowMessage(true);
      });
  };

  return (
    <>
      <AddProdPrompt show={showPrompt} confirm={() => setShowPrompt(false)} cancel={() => navigate(`/product/${id}`)} />
      <Message
        show={showMessage}
        onHide={() => {
          setShowMessage(false);
          setShowPrompt(true);
        }}
        message={message}
        error={error}
      />
      <Header />
      <section className="detail-product">
        <div className="container-fluid">
          <div className="row my-5 row-content">
            <div className="col-md-4 text-center">
              <p className="top-text-left mb-5" onClick={() => navigate("/product")}>
                Favorite &amp; Promo <span className="product-text-left">&#8594; Add new product</span>{" "}
              </p>
              <div class="photo-background-add">
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Upload a photo</Tooltip>}>
                  {({ ref, ...triggerHandler }) => (
                    <>
                      <label htmlFor="foto" {...triggerHandler}>
                        {" "}
                        {fileUrl && !error.file ? (
                          <img src={fileUrl} ref={ref} width={200} height={200} className="product-image-add my-3 justify-content-center" alt="preview" />
                        ) : (
                          <img src={require("../../assets/img/photo-camera.png")} ref={ref} width={200} height={200} className="product-image-add my-3 justify-content-center" alt="profile" />
                        )}
                      </label>
                      <input type="file" className="foto-input" name="foto" onChange={handleFoto} id="foto" hidden></input>
                      {error.file ? <p className="text-danger fw-bold fs-6">{error.file}</p> : <></>}
                    </>
                  )}
                </OverlayTrigger>
              </div>
              <button class="take-pic-button mt-3">Take a picture</button>
              <br />
              <button className="gallery-button mt-3">
                <label htmlFor="foto" className="text-gallery">
                  Choose from gallery
                </label>
              </button>
              <h2 className=" text-start label-add-prod add-prod-top">Delivery Hour:</h2>
              <p class="product-size-add mt-2 border-0">Select start hour</p>
              <input type="time" className=" w-100" />
              <br />
              <p class="product-size-add border-0 mt-3">Select end hour</p>
              <input type="time" className=" w-100" />
              <h2 className=" text-start label-add-prod add-prod-top">Input stock:</h2>
              <input type="number" min={0} className="mt-3 w-100" onChange={(e) => setStock(e.target.value)} />
            </div>
            <div className="col-md-6 mt-5">
              <h2 className="top-product-title text-center fw-bold mt-4 ">{}</h2>
              <p className="top-product-desc mt-5 pe-5" id="top-product-desc-res">
                {}
              </p>
              <h2 className="top-product-desc-add mt-5">Name :</h2>
              <input
                type="text"
                className="user-contact-text mt-3"
                name="product_name"
                placeholder="Type product name min. 50 characters"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <h2 className="top-product-desc-add mt-5">Price :</h2>
              <input
                type="text"
                className="user-contact-text mt-3"
                name="product_price"
                placeholder="Type the price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <h2 className="top-product-desc-add mt-5">Description :</h2>
              <textarea
                rows={2}
                type="text"
                className="user-contact-text mt-3"
                name="product_desc"
                placeholder="Describe your product min. 150 characters"
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
              />
              <h2 className="top-product-desc-add mt-5">Input Product Size :</h2>
              <p class="product-size-add mt-2 border-0">Click size you want to use for this product</p>
              <button className="size-add-prod mt-2">R</button>
              <button className="size-add-prod mx-4">L</button>
              <button className="size-add-prod">XL</button>
              <button className="size-add-prod ms-4">250 gr</button>
              <button className="size-add-prod mx-4">300 gr</button>
              <button className="size-add-prod">500 gr</button>
              <h2 className="top-product-desc-add mt-5">Input Category :</h2>
              <p class="product-size-add mt-2 border-0">Click category for this product</p>
              <button
                className={category === 2 ? "product-add-cat-active mx-4" : "product-add-cat mx-4"}
                onClick={() => {
                  setCategory(2);
                }}
              >
                Coffee
              </button>
              <button
                className={category === 4 ? "product-add-cat-active mx-4" : "product-add-cat mx-4"}
                onClick={() => {
                  setCategory(4);
                }}
              >
                Non-Coffee
              </button>
              <button
                className={category === 1 ? "product-add-cat-active mx-4" : "product-add-cat mx-4"}
                onClick={() => {
                  setCategory(1);
                }}
              >
                Foods
              </button>
              <div className="row mt-5 p-0">
                <div className="col-md-12  ">
                  <button className="cart-button" onClick={saveProduct}>
                    Save Product
                  </button>
                </div>
              </div>
              <div className="row my-5 p-0">
                <div className="col-md-12  ">
                  <button className="cancel-add-product" onClick={() => window.location.reload()}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AddProduct;
