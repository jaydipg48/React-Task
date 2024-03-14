import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Data.module.css";

export const Data = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [discountFilter, setDiscountFilter] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reachedLimit, setReachedLimit] = useState(false);

  const observer = useRef();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    if (observer.current && products.length > 0) {
      observer.current.observe(document.getElementById(`product-${products.length - 1}`));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [products]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && !reachedLimit) {
      fetchNextProducts();
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products?skip=${startIndex}&limit=30`);
      const data = await response.json();
      if (data.products.length === 0 || startIndex >= 70) {
        setReachedLimit(true);
      }
      setProducts(data.products);
      setLoading(false);

      const uniqueCategories = [...new Set(data.products.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const fetchNextProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products?skip=${startIndex + 30}&limit=30`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      if (data.total === products.length) {
        setReachedLimit(true);
      }
      setStartIndex(startIndex + 30);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const calculateDiscount = (price) => {
    const discountPercentage = 10;
    const minPriceForDiscount = 100;
    if (price >= minPriceForDiscount) {
      const discountAmount = (price * discountPercentage) / 100;
      return discountAmount.toFixed(2);
    } else {
      return 0;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriceRange =
      (!minPrice || parseFloat(product.price) >= parseFloat(minPrice)) &&
      (!maxPrice || parseFloat(product.price) <= parseFloat(maxPrice));
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesDiscount = !discountFilter || calculateDiscount(parseFloat(product.price)) <= discountFilter;
    return matchesSearch && matchesPriceRange && matchesCategory && matchesDiscount;
  });

  const sortProducts = (sortBy) => {
    switch (sortBy) {
      case "default":
        return filteredProducts;
      case "price-low-to-high":
        return [...filteredProducts].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-high-to-low":
        return [...filteredProducts].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return filteredProducts;
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleDiscountFilterChange = (e) => {
    setDiscountFilter(e.target.value);
  };

  const handlePriceFilter = (maxPrice) => {
    setMaxPrice(maxPrice);
  };

  return (
    <div className="blog-contain card text-center">
      <div className={`${styles.BackGround} ${styles.container} card-body`}>
        <h1 className={`${styles.heading}`}>PRODUCTS</h1>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={handleSearch}
            className={`${styles.searchInput} form-control`}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="minPrice" className="form-label">
            Minimum Price:
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={handleMinPriceChange}
            className={`${styles.priceInput} form-control`}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="maxPrice" className="form-label">
            Maximum Price:
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            className={`${styles.priceInput} form-control`}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="category" className="form-label">
            Product Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-select"
          >
            <option value="">All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="sortBy" className="form-label">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortByChange}
            className="form-select"
          >
            <option value="default">Default</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="discountFilter" className="form-label">
            Discount Filter:
          </label>
          <select
            id="discountFilter"
            className="form-select"
            onChange={handleDiscountFilterChange}
          >
            <option value="">Select Discount Range</option>
            <option value="0">Under 10%</option>
            <option value="20">Under 20%</option>
            <option value="30">Under 30%</option>
            <option value="40">Under 40%</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="priceFilter" className="form-label">
            Price Filter:
          </label>
          <select
            id="priceFilter"
            className="form-select"
            onChange={(e) => handlePriceFilter(e.target.value)}
          >
            <option value="">Select Price Range</option>
            <option value="50">Under $50</option>
            <option value="100">Under $100</option>
            <option value="500">Under $500</option>
            <option value="1000">Under $1000</option>
            <option value="1500">Under $1500</option>
            <option value="2000">Under $2000</option>
          </select>
        </div>

        <div className="row">
          {sortProducts(sortBy).map((product, index) => (
            <div
              key={product.id}
              id={`product-${index}`}
              className={`text-white col-4 position-relative ${styles.detailbox}`}
            >
              <div>
                <p>
                  <strong>Title:</strong> {product.title}
                </p>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                <p>
                  <strong>Discount:</strong> ${calculateDiscount(parseFloat(product.price))}
                </p>
              </div>
              <Link to={`/details/${product.id}`}>
                <img
                  className={`${styles.imagetag} m-2`}
                  src={product.images[0] ?? ""}
                  alt="Product"
                />
              </Link>
              <Link to={`/details/${product.id}`}>
                <button
                  className={`${styles.btnpos} btn btn-info position-absolute`}
                >
                  Details
                </button>
              </Link>
            </div>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {/* {reachedLimit && <p>Reached the limit of 100 products.</p>} */}
      </div>
    </div>
  );
};

export default Data;
