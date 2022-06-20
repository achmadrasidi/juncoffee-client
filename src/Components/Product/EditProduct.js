import axios from "axios";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import Loading from "../SubComponent/Loading";
import Message from "../SubComponent/Message";

const EditProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const { id } = useParams();

  const { token } = useSelector((state) => state.persist.userInfo.info);
  useEffect(() => {
    (async () => {
      setLoading(true);
      window.scrollTo({ behavior: "smooth", top: "0px" });
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
        setLoading(false);
        setProduct(data);
      } catch (err) {
        setLoading(false);
        setError(err.respose ? err.response.data.error : err.message);
      }
    })();
    document.title = "Juncoffe - Edit Product";
  }, [id]);

  const handleFoto = (e) => {
    let reader = false;

    e.preventDefault();
    setError(null);
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
      setError("No File Selected");
      return;
    }
    if (!files.type.match(imageType)) {
      setError("Invalid image type (png,jpg,jpeg)");
      return;
    }
    reader.readAsDataURL(files);
  };

  const updateHandler = () => {
    setLoading(true);
    const body = {
      name,
      price: price ? price : product.price.toString(),
      description,
      stock: stock ? stock : product.stock.toString(),
      category_id: category.toString(),
      photo: file,
    };
    axios
      .patch(`${process.env.REACT_APP_API}/product/${id}`, body, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => {
        setLoading(false);
        setMessage(result.data.message);
        setShowMessage(true);
      })
      .catch((er) => {
        setLoading(false);
        setError(er.response ? er.response.data.error : er.message);
        setShowMessage(true);
      });
  };
  return (
    <>
      {loading ? <Loading show={true} /> : <></>}
      <Header />
      <Message
        show={showMessage}
        onHide={() => {
          setShowMessage(false);
          navigate(`/product/${id}`);
        }}
        message={message}
        error={error}
      />
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {" "}
          <section className="detail-product">
            <div className="container-fluid">
              <div className="row my-5 row-content">
                <div className="col-md-4 text-center">
                  <p className="top-text-left mb-5" onClick={() => navigate("/product")}>
                    Favorite &amp; Promo <span className="product-text-left"> &#8594; {product.name} &#8594; Edit Product</span>{" "}
                  </p>
                  <div class="photo-background-add">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Upload a photo</Tooltip>}>
                      {({ ref, ...triggerHandler }) => (
                        <>
                          <label htmlFor="foto" {...triggerHandler}>
                            {" "}
                            {fileUrl && !error ? (
                              <img src={fileUrl} ref={ref} width={200} height={200} className="product-image-add my-3 justify-content-center" alt="preview" />
                            ) : (
                              <img src={product.image ? product.image : require("../../assets/img/photo-camera.png")} ref={ref} width={200} height={200} className="product-image-add my-3 justify-content-center" alt="profile" />
                            )}
                          </label>
                          <input type="file" className="foto-input" name="foto" onChange={handleFoto} id="foto" hidden></input>
                          {error ? <p className="text-danger fw-bold fs-6">{error}</p> : <></>}
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
                  <input type="number" min={0} className="mt-3 w-100" defaultValue={product.stock} onChange={(e) => setStock(e.target.value)} />
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
                    defaultValue={product.name}
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
                    defaultValue={product.price}
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
                    defaultValue={product.description}
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
                    className={category === 2 ? "product-add-cat-active me-4" : "product-add-cat me-4"}
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
                      <button className="cart-button" onClick={updateHandler}>
                        Save Changes
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
        </>
      )}

      <Footer />
    </>
  );
};

export default EditProduct;
