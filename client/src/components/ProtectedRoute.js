import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  // Перевірка наявності токена
  if (!token) {
    console.log('not user')
    return <Navigate to="/" replace />;
   
  }

  try {
    // Декодуємо токен, щоб отримати роль
    const decodedToken = jwtDecode(token);
    console.log(decodedToken)

    // Перевіряємо, чи відповідає роль користувача вимогам
    if (decodedToken.role !== requiredRole) {
        console.log('not admin')
      return <Navigate to="/" replace />; // Перенаправляємо на головну, якщо роль не підходить
      
    }

    // Якщо все добре, рендеримо компонент
    return children;
  } catch (error) {
    // Якщо токен недійсний або декодування не вдалося
    console.log('token invalid')
    return <Navigate to="/" replace />;
   
  }
};

export default ProtectedRoute;