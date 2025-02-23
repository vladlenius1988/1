import React from 'react';

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedProduct: null, cart: [] };
  }

  componentDidMount() {
    let products = [];

    fetch(`http://localhost:5000/record/`)
      .then(res => res.json())
      .then(data => {
        data.forEach(product => {
          products.push(product);
        });

        const location = document.location.pathname;
        const id = location.split('product/')[1];
        const selectedProduct = products.find(product => product._id === id);

        this.setState({ selectedProduct });
        
      });

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.setState({ cart: JSON.parse(savedCart) });
    }
  }

  
  addToCart = (product) => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingProductIndex = cart.findIndex(item => item._id === product._id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1; 
    } else {
      const updatedProduct = { ...product, quantity: 1 }; 
      cart.push(updatedProduct);
    }

    this.setState({ cart });
    localStorage.setItem('cart', JSON.stringify(cart)); 
    window.alert(existingProductIndex !== -1 ? "Товар уже в кошику" : "Товар додано до кошика");
  }

  // Збільшуємо кількість товару
  increaseQuantity = (productId) => {
    const updatedCart = this.state.cart.map(item => {
      if (item._id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    this.setState({ cart: updatedCart });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Зменшуємо кількість товару
  decreaseQuantity = (productId) => {
    const updatedCart = this.state.cart.map(item => {
      if (item._id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    this.setState({ cart: updatedCart });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Додаємо товар у кошик при спробі змінити кількість, якщо його немає
  handleIncreaseQuantity = (productId) => {
    const { cart, selectedProduct } = this.state;
    const productInCart = cart.find(item => item._id === productId);

    if (productInCart) {
      this.increaseQuantity(productId);
    } else {
      this.addToCart(selectedProduct); // Додаємо товар у кошик, якщо його немає
    }
  }

  handleDecreaseQuantity = (productId) => {
    const { cart } = this.state;
    const productInCart = cart.find(item => item._id === productId);

    if (productInCart) {
      this.decreaseQuantity(productId);
    }
  }

  // Отримуємо кількість товару в кошику
  getProductQuantity = (productId) => {
    const item = this.state.cart.find(item => item._id === productId);
    return item ? item.quantity : 1; // За замовчуванням кількість 1, якщо товару немає в кошику
  }

  render() {
    const { selectedProduct } = this.state;

    if (!selectedProduct) {
      return <div>Loading...</div>;
    }

    const quantityInCart = this.getProductQuantity(selectedProduct._id);

    return (
      <div>
        <div key={selectedProduct._id} className="product-card">
          <h4>{selectedProduct.name}</h4>
          <img src={`/photo/${selectedProduct.photo}.jpg`} alt={selectedProduct.name} />
          <p>{selectedProduct.description}</p>
          <p>Ціна: {selectedProduct.price} грн.</p>
          <button 
            className="add-to-cart" 
            onClick={() => this.addToCart(selectedProduct)}>
            &#128722; 
          </button>
          <div className="quantity-controls">
            <button className="quantity-btn" onClick={() => this.handleDecreaseQuantity(selectedProduct._id)}>-</button>
            <span className="item-quantity">{quantityInCart}</span> {/* Кількість відображається з 1 за замовчуванням */}
            <button className="quantity-btn" onClick={() => this.handleIncreaseQuantity(selectedProduct._id)}>+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetail;
