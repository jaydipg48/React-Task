import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Details = () => {
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        setSelectedProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const renderProductImages = () => {
    if (!selectedProduct || !selectedProduct.images || selectedProduct.images.length === 0) {
      return null;
    }

    if (selectedProduct.images.length > 1) {
      const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };

      return (
        <Slider {...sliderSettings}>
          {selectedProduct.images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Product Image ${index + 1}`}
                style={{ width: "400px", height: "300px", margin: "auto" }}
              />
            </div>
          ))}
        </Slider>
      );
    } else {
      return (
        <img
          src={selectedProduct.images[0]}
          alt="Product Image"
          style={{ width: "400px", height: "300px", margin: "auto" }}
        />
      );
    }
  };

  return (
    <>
      {selectedProduct && (
        <div>
          {renderProductImages()}
          <h1>ID: {selectedProduct.id}</h1>
          <h2>Title: {selectedProduct.title}</h2>
          <p>Description: {selectedProduct.description}</p>
          <p>Price: {selectedProduct.price}</p>
          <p>Discount: {selectedProduct.discountPercentage}</p>
          <p>Rating: {selectedProduct.rating}</p>
          <p>Stock: {selectedProduct.stock}</p>
          <p>Brand: {selectedProduct.brand}</p>
          <p>Category: {selectedProduct.category}</p>
        </div>
      )}
    </>
  );
};

export default Details;
