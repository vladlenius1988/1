import React from 'react';
import Header from './components/header.js';
import Main from './components/main.js';
import AutorisationModal from './components/autorisationModal.js';
import RegistrationModal from './components/RegistrationModal.js';
import './App.css';
import { Route, Routes } from "react-router-dom";
import RecordList from "./components/recordList.js";
import Edit from "./components/edit.js";
import Create from "./components/create.js";
import ProductDetail from './components/ProductCard.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import ShoppingCart from './components/ShoppingCart.js';

class App extends React.Component {
    state = {
        isAuthModalOpen: false, // Для модального вікна авторизації
        isRegModalOpen: false,   // Для модального вікна реєстрації
        role: 'guest', 
    };

    handleOpenAuthModal = () => {
        this.setState({ isAuthModalOpen: true });
    };

    handleOpenRegModal = () => {
        this.setState({ isRegModalOpen: true });
    };

    closeAuthModal = () => {
        this.setState({ isAuthModalOpen: false });
    };

    closeRegModal = () => {
        this.setState({ isRegModalOpen: false });
    };

    handleLogin = (role) => {
        this.setState({ role }); // Встановлюємо роль користувача
        this.closeAuthModal(); // Закриваємо модальне вікно авторизації після входу
    };

    render() {
        return (
            <div className="App">
                <Header 
                    role={this.state.role} 
                    openAuthModal={this.handleOpenAuthModal} 
                    openRegModal={this.handleOpenRegModal} 
                />

                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/product/:_id" element={<ProductDetail />} />
                   
                    <Route path="/cart" element={<ShoppingCart />} />
                    <Route path="/edit/:id"                     
                    element={
                            <ProtectedRoute requiredRole="admin">
                                <Edit />
                            </ProtectedRoute>
                        }/>
                        <Route path="/create"                    
                    element={
                            <ProtectedRoute requiredRole="admin">
                                <Create />
                            </ProtectedRoute>
                        }/>                   
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <RecordList />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                {/* Модальні вікна */}
                {this.state.isAuthModalOpen && (
                    <AutorisationModal 
                    isVisible={this.state.isAuthModalOpen} 
                    closeModal={this.closeAuthModal} 
                    onLogin={this.handleLogin} 
                />
                )}
                {this.state.isRegModalOpen && (
                    <RegistrationModal 
                        closeModal={this.closeRegModal} 
                    />
                )}
            </div>
        );
    }
}

export default App;
