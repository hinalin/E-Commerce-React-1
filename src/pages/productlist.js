import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotFound from '../components/NotFound';
import './productlist.css';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState('');

  const [searchProducts, setSearchProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/products`)
      .then((result) => {
        setAllProducts(result.data);
        setSearchProducts(result.data);
      })
      .catch((err) => {
        console.log("Product list error ===>", err);
      });
  }, []);

  const productsPerPage = 8;
  const totalProducts = searchProducts.length;
  const totalPages = Math.ceil(searchProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = searchProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSearch = (event) => {
    event.preventDefault();
    const filtered = allProducts.filter(product =>
      product.category.toLowerCase().includes(search.toLowerCase()) &&
      (selectedColors.length === 0 || selectedColors.includes(product.color)) &&
      (selectedSizes.length === 0 || selectedSizes.includes(product.size))
    );
    setSearchProducts(filtered);
    setCurrentPage(1);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <>
      <div className="header">
        <Navbar/>
        <div className="search-filter">
          {totalProducts === 0 ? (
            <h4>No products found</h4>
          ) : (
            <h4>Showing Result {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, totalProducts)} Out Of {totalProducts}</h4>
          )}
          <form className="d-flex">
            <input className="form-control me-2" placeholder="Search" id="search" name="search" onChange={(event) => setSearch(event.target.value)} />

            <div className="multiselect" id='filter'>
              <div className="selectBox" onClick={toggleOptions}>
                 <select className='filter-select'>                   
                    <option>Filter</option>
                 </select>
               </div>
                {showOptions && (
                 <div className="options">
                  <div className="selectBox">
                    <div className='overSelect'>
                    <b>Color</b>
                    {['Pink', 'Black', 'Navy', 'Dark Blue', 'Blue', 'Dark Green', 'Brown' , 'White' , 'Orange' , 'Green' , 'Yellow'].map(color => (
                      <label key={color} htmlFor={color}>
                        <input
                          type="checkbox"
                          id={color}
                          value={color}
                          checked={selectedColors.includes(color)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedColors([...selectedColors, event.target.value]);
                            } else {
                              setSelectedColors(selectedColors.filter(item => item !== event.target.value));
                            }
                          }}
                        />
                        {color}
                      </label>
                    ))}

                    <b>Size</b>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free', '30x30', '32x32'].map(size => (
                      <label key={size} htmlFor={size}>
                        <input
                          type="checkbox"
                          id={size}
                          value={size}
                          checked={selectedSizes.includes(size)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedSizes([...selectedSizes, event.target.value]);
                            } else {
                              setSelectedSizes(selectedSizes.filter(item => item !== event.target.value));
                            }
                          }}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>

            <button className="btn btn-outline-success btn-success text-light" type="submit" onClick={handleSearch}>Search</button>
          </form>
        </div>
      </div>

      <div className="container-fluid">
        <div className="product-list">
          {totalProducts === 0 ? (
            <NotFound />
          ) : (
            <div className="row ppp" style={{ marginTop: "0px" }}>
              {currentProducts.map((item) => (
                <div key={item.id} className="col-lg-3 product">
                  <Link to={`/ProductDetails/${item.id}`} style={{ textDecoration: "none" }}>
                    <img src={item.image} alt={item.name} className='product-image' />
                    <h6>{item.name}</h6>
                    <p>Price: ₹ {item.price}</p>
                    <p>Size: {item.size}</p>
                  </Link>
                  
                </div>
              ))}
            </div>
          )}
        </div>

        {totalProducts > 0 && (
          <div className="product-pagination">
            <div className="pagination">
              <a href="#" onClick={handlePrevPage}>&laquo;</a>
             {[...Array(totalPages).keys()].map((index) => (
                <a
                  key={index + 1}
                  active={index + 1 === currentPage}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </a>
              )
            )}
              <a href="#" onClick={handleNextPage}>&raquo;</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductList;
