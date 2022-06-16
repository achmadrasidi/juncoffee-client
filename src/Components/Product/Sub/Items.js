import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { SortDown, SortUp } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productList } from "../../../Redux/Actions/ProductAction";
import Loading from "../../SubComponent/Loading";
import Pagination from "./Pagination";

const Items = ({ category, favorite, pageUrl, setPageUrl }) => {
  const [sortValue, setSortValue] = useState("");
  const [order, setOrder] = useState("Order by");
  const [_, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
  const { list, error, loading } = useSelector((st) => st.productList);
  const { keyword } = useSelector((st) => st.searchKeyword);
  const { data } = list;

  let baseUrl = `${process.env.REACT_APP_API}/product?`;

  if (favorite) {
    baseUrl = `${process.env.REACT_APP_API}/product/favourite?`;
  }
  if (!!keyword) {
    baseUrl += `keyword=${keyword}&`;
  }

  if (!!category && category !== "Add-on") {
    baseUrl += `category=${category}&`;
  }
  if (!!pageUrl) {
    baseUrl += pageUrl;
  }

  switch (sortValue) {
    case "asc":
      baseUrl += `order=asc&sort=${order === "Order by" ? "name" : order.toLowerCase()}&`;
      break;
    case "desc":
      baseUrl += `order=desc&sort=${order === "Order by" ? "name" : order.toLowerCase()}&`;
      break;
    default:
      break;
  }

  useEffect(() => {
    let paramsUrl = baseUrl.split("?")[1];
    if (favorite) {
      paramsUrl = baseUrl.split("product/")[1].replace("favourite", "category=favourite").replace("?", "&");
    }

    setSearchParams(paramsUrl);
    dispatch(productList(baseUrl));

    if (error) {
      setPageUrl(null);
    }
  }, [baseUrl, pageUrl]);

  const handleSortDown = () => {
    setSortValue("asc");
  };
  const handleSortUp = () => {
    setSortValue("desc");
  };

  return (
    <>
      <div className="row mt-3">
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
        <div className="col-md-4 p-0 pe-5 justify-content-end d-flex gap-2">
          <DropdownButton variant={"secondary"} className="dropdown-sort" title={order}>
            <Dropdown.Item eventKey="1" onClick={() => setOrder("Date")}>
              {"Date"}
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => setOrder("Price")}>
              {"Price"}
            </Dropdown.Item>
          </DropdownButton>
          {sortValue === "desc" ? <SortDown className="sort-icon " size={40} onClick={handleSortDown}></SortDown> : <SortUp className="sort-icon" size={40} onClick={handleSortUp}></SortUp>}{" "}
        </div>
      </div>
      {loading ? (
        <Loading show={true} onHide={false} />
      ) : error ? (
        <h1 className="text-center my-5 py-5">{error}</h1>
      ) : (
        <>
          <div className="row fav-product mt-0  p-0" id="fav-prod-mobile-res">
            {data.map((product, i) => (
              <div className="col-md-3 my-5" key={i}>
                <div
                  className="card card-fav-product-layout h-100"
                  onClick={() => {
                    navigate(`/product/${product.id}`, { replace: true });
                  }}
                >
                  <div className="card-body text-center d-grid" id="card-body-res">
                    <img src={product.image} className="product-card-image" alt="" />
                    <h2 className="fav-product-title">{product.name}</h2>
                    <p className="fav-product-price">IDR{formatter.format(product.price).split("Rp")[1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination setPageUrl={setPageUrl} />
        </>
      )}
    </>
  );
};

export default Items;
