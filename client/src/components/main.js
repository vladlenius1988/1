import React, { Component } from 'react';
import { Link } from "react-router-dom";


const Prods = ({ record, onClick, addToCart }) => (
  <div className="card">
    <div className="card-img">
      <Link to={`/product/${record._id}`}>
        <img src={`/photo/${record.photo}.jpg`} alt="" id={String(record._id)} onClick={(e) => onClick(e, record)} />
      </Link>
    </div>
    <div className="card-content-name">
      <b>{record.name}</b>
      <span>
        <b>{record.price} грн.</b>
      </span>
    </div>
    <div className="card-content">
      <p>{record.description}</p>
    </div>
    <button className="add-to-cart" onClick={() => addToCart(record)}>
      &#128722; 
    </button>
  </div>
);

const ProductsList = ({ records, deleteRecord, handleCardClick, addToCart }) => {
  return records.map((record) => (
    <Prods
      key={record._id}
      record={record}
      deleteRecord={() => deleteRecord(record._id)}
      onClick={handleCardClick}
      addToCart={addToCart} 
    />
  ));
};
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { status: true, records: [], cart: [] };
    this.deleteRecord = this.deleteRecord.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount() {
    this.getRecords();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    this.setState({ cart: savedCart });
  }

  async getRecords() {
    const response = await fetch(`http://localhost:5000/record/`);
    if (!response.ok) {
      const message = `error: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const records = await response.json();
    this.setState({ records });
  }

  async deleteRecord(id) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });
    this.setState({
      records: this.state.records.filter((el) => el._id !== id)
    });
  }

  handleCardClick(event, record) {
    if (event.target.closest('.card-img')) {
      console.log('Клик по товару:', record);
    }
    return record._id;
  }


  addToCart(product) {
    
    
    this.state = { Cart: [] }
    const savedCart = localStorage.getItem('cart');
   
    const Cart = savedCart ? JSON.parse(savedCart) : [];

    
    
    const existingProductIndex = Cart.findIndex(item => item._id === product._id);
    
    // сохраняем localStorage
    if (existingProductIndex !== -1) {
      // Если товар в корзине,делаем +1      

      Cart[existingProductIndex].quantity += 1; // Збільшуємо кількість
      this.setState({ cart: Cart });
    localStorage.setItem('cart', JSON.stringify(Cart)); 
    window.alert("товар уже в кошику")
      return Cart;
    } else {
      const updatedCart = [...Cart, product];
      this.setState({ cart: updatedCart,  quantity: 1  });
     
      localStorage.setItem('cart', JSON.stringify(updatedCart)); 
      console.log("товару немає в кошику")
      // Если товара нет в корзине,добавить с кол

      return updatedCart;
      
  }}

  render() {
    return (
      <main className='main'>
        <div className="block" id="block3">
        <ProductsList
  records={this.state.records}
  deleteRecord={this.deleteRecord}
  handleCardClick={this.handleCardClick}
  addToCart={this.addToCart} // передаём addToCart
/>
        </div>
        <div className='anchor'>
          <a href='#header'>&#9650;</a>
        </div>
      </main>
    );
  }
}

export default Main;
