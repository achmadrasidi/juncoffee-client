import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CloseButton } from "react-bootstrap";
import Prompt from "../../SubComponent/Prompt";
import { removeCart } from "../../../Redux/Actions/CartAction";
import { useDispatch } from "react-redux";

const CartItems = ({ item, subtotal, tax, shipping, totalPrice }) => {
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [cartDelItem, setCartDel] = useState([]);
  const dispatch = useDispatch();
  const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
  const removeCartHandler = (e) => {
    const delItem = item.filter((val) => val.id !== e.target.value);
    setCartDel(delItem);
    setShowModalConfirm(true);
  };

  const confirmDelCart = () => {
    dispatch(removeCart(cartDelItem));
    setShowModalConfirm(false);
  };
  return (
    <>
      <Prompt show={showModalConfirm} confirm={confirmDelCart} message={"Are you sure want to remove item(s) from cart ?"} cancel={() => setShowModalConfirm(false)} />
      {!item.length ? (
        <>
          <div className="no-cart text-center">
            <h1 className="text-center">No Cart Items Found</h1>
            <Link className="btn btn-success text-white mt-3" to="/product">
              Shop Now
            </Link>
          </div>
        </>
      ) : (
        item.length &&
        item.map((obj) => (
          <div className="row mt-3 cart-row-border pb-4 ps-0">
            <div className="col-md-3 cart-row-col">
              <CloseButton value={obj.id} onClick={(e) => removeCartHandler(e)} />
              <img src={obj.image} width="100%" alt="" className="image-cart-product" />
            </div>
            <div className="col-md-9 ">
              <p className="cart-product-text m-0">{obj.name}</p>
              {obj.variant ? (
                obj.variant.map((val) => (
                  <>
                    <div class="row p-0">
                      <div class="col-md-6">
                        <p className="cart-product-text m-0">x{val.quantity}</p>
                        <p className="cart-product-text m-0">{val.size}</p>
                      </div>
                      <div class="col-md-5 ms-3">
                        <p className="cart-product-text m-0">IDR{formatter.format(val.prodPrice * val.quantity).split("Rp")[1]}</p>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        ))
      )}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              {" "}
              <p className="cart-price-text m-0">SUBTOTAL</p>{" "}
            </div>
            <div className="col-md-6">
              {" "}
              <p className="cart-price-text text-center m-0">IDR{formatter.format(subtotal).split("Rp")[1]}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {" "}
              <p className="cart-price-text m-0">TAX &amp; FEES</p>{" "}
            </div>
            <div className="col-md-6 ">
              {" "}
              <p className="cart-price-text text-center m-0">IDR{formatter.format(tax).split("Rp")[1]}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {" "}
              <p className="cart-price-text m-0">SHIPPING</p>{" "}
            </div>
            <div className="col-md-6">
              {" "}
              <p className="cart-price-text text-center m-0">IDR{formatter.format(shipping).split("Rp")[1]}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row ms-2 mt-5 mb-3 ">
        <div className="col-md-6">
          <p className="cart-total-price">TOTAL</p>
        </div>
        <div className="col-md-6">
          <p className="cart-total-price text-center">IDR{formatter.format(totalPrice).split("Rp")[1]}</p>
        </div>
      </div>
    </>
  );
};

export default CartItems;
