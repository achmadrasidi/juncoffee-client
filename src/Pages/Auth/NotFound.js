import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = "Juncoffee | Not Found";
  }, []);
  return (
    <section class="notfound">
      <div class="container-fluid">
        <div class="row text-center">
          <div class="col-md-12">
            <h1 class="page-title-not-found">404</h1>
            <h2>Whoops....</h2>
            <p>Page you're looking for not found.</p>
            <button
              class="upcoming-button-back w-50 mb-5"
              onClick={() => {
                if (pathname.includes("product")) {
                  navigate("/product", { replace: true });
                  return;
                }
                navigate("/", { replace: true });
              }}
            >
              Back To {pathname.includes("product") ? "Product" : "Home"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
