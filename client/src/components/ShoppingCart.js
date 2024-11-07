import React, { useState, useEffect } from 'react';

const ShoppingCart = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item._id === productId) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      });
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item._id === productId) {
          const newQuantity = (item.quantity || 1) > 1 ? item.quantity - 1 : 1;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  const getUserInfo = () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      console.log(userData);
       // декодируем токен
      return {
        id: userData.userId,
        role: userData.role,
      };
      
    }
    return {};
  };
//формирование заказа
  const handleOrder = async () => {
    const userInfo = getUserInfo();
console.log(userInfo)
    const orderData = {
      userId: userInfo.id,
      
      cart: cart.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      totalPrice: Number(totalPrice),
    };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
        
        
      });
      console.log(orderData)
      if (!response.ok) {
        // Викидаємо помилку, якщо статус відповіді не успішний
        throw new Error(`Ошибка сервера: ${response.status}`);
    }
      if (response.ok) {
        alert('Замовлення успішно надіслано!');
        setCart([]); // Очищуємо кошик
        localStorage.removeItem('cart'); // Очищуємо localStorage
      } else {
        alert('Не вдалося надіслати замовлення.');
        console.log('Response status:', response.status);
      console.log('Response body:', await response.text());
      }
    } catch (error) {
      console.error('Помилка:', error);
      alert('Сталася помилка при надсиланні замовлення.');
      
    }
  
  };

  return (
    <div className="shopping-cart">
      <h2>Кошик</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Кошик пустий</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <span className="item-name">{item.name}</span>
              <span className="item-price">Ціна: {item.price} ₴</span>
              <span className="item-quantity">Кількість: {item.quantity || 1}</span>
              <span className="item-total-price">
                Загальна сума: {item.price * (item.quantity || 1)} ₴
              </span>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => decreaseQuantity(item._id)}>-</button>
                <span className="item-quantity">{item.quantity || 1}</span>
                <button className="quantity-btn" onClick={() => increaseQuantity(item._id)}>+</button>
              </div>
              <button className="remove-button" onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
          <div className="total">
            <h3>Загальна сума замовлення: {totalPrice} ₴</h3>
          </div>
          <button className="order-button" onClick={handleOrder}>Замовити</button>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
