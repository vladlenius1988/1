import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AutorisationModal from './autorisationModal.js';

const Header = () => {
  const [role, setRole] = useState('guest'); // за замовчуванням роль - guest
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // стан для відкриття модального вікна

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role || 'guest');
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/record/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    updateFilteredOptions();
  }, [searchValue, products]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const updateFilteredOptions = () => {
    if (!searchValue.trim()) {
      setFilteredOptions([]);
      return;
    }

    const options = [
      ...getOptionsName(searchValue, products),
      ...getOptionsGroup(searchValue, products),
      ...getOptionsUniverse(searchValue, products)
    ].filter((value, index, self) => self.indexOf(value) === index);

    setFilteredOptions(options);
  };

  const getOptionsName = (word, products) => 
    products.filter(product => product.name.match(new RegExp(word, 'gi')));

  const getOptionsGroup = (word, products) => 
    products.filter(product => product.group.match(new RegExp(word, 'gi')));

  const getOptionsUniverse = (word, products) => 
    products.filter(product => product.universe.match(new RegExp(word, 'gi')));

  const handleOptionClick = (productId) => {
    window.location.href = `http://localhost:3000/product/${productId}`;
  };

  const handleLoginClick = () => {
    if (role === 'guest') {
      setIsModalOpen(true); // відкриваємо модальне вікно для гостей
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (newRole) => {
    setRole(newRole); // оновлюємо роль після входу
    closeModal(); // закриваємо модальне вікно
  };

  return (
    <header className='header' id='header'>
      <div className="headerContainer">
        <div className="logoContainer">
          <p className="logo"><a href="/">GeekShop</a></p>
        </div>
        <div className="searchContainer">
          <input
            type="text"
            className="search"
            placeholder="Обери на свій смак"
            autoComplete="off"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <ul className="options">
            {filteredOptions.slice(0, 10).map(product => (
              <li key={product._id} style={{ cursor: 'pointer' }} onClick={() => handleOptionClick(product._id)}>
                <span className="hl">{product.name}</span>
                <img src={`/photo/${product.photo}.jpg`} width="30px" height="30px" alt={product.name} style={{ float: 'right' }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="linkContainer">
          <div className="text">
            {role === 'guest' && <Link to="/" onClick={handleLoginClick}>Login</Link>}
            {role === 'User' && <Link to="/cart">Cart</Link>}
            {role === 'admin' && <Link to="/admin">Admin</Link>}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={`modalBackground ${isModalOpen ? 'active' : ''}`}>
          <div className="modalActive">
            <AutorisationModal onLogin={handleLogin} closeModal={closeModal} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
