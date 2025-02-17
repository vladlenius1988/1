import React from 'react';
import ModalCross from "./icons/modalCross.svg";
import { jwtDecode } from 'jwt-decode';

class AutorisationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true, // Відслідковує, чи ми на формі входу
            username: '',
            password: '',
            email: '', // Поле для електронної пошти
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleForm = this.toggleForm.bind(this); // Для переключення форм
    }

    toggleForm() {
        this.setState(prevState => ({
            isLogin: !prevState.isLogin, // Перемикає форму між авторизацією та реєстрацією
            email: '', // Скинути електронну пошту при переключенні
        }));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { username, password, email } = this.state;

        const endpoint = this.state.isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register'; // Вибір ендпоінта
        const body = this.state.isLogin 
            ? { username, password } 
            : { username, password, email }; // Додати email для реєстрації

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (this.state.isLogin) {
            // Обробка авторизації
            const data = await response.json();
            const token = data.token;

            if (response.ok) {
                localStorage.setItem('token', token);
                alert('Ви успішно увійшли в систему'); // use component
                const role = this.getRoleFromToken(token);
                this.props.onLogin(role);//??
            } else {
                alert(data.message);
            }
        } else {
            // Обробка реєстрації
            if (response.ok) {
                alert('Реєстрація успішна');// use component
                this.toggleForm(); // Перемкнути на форму входу після успішної реєстрації
            } else {
                alert('Реєстрація не вдалася');// use component
            }
        }
    }

    getRoleFromToken(token) {
        let role = 'guest';
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                role = decodedToken.role || 'guest';
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
        return role;
    }

    render() {
        const { isLogin, username, password, email } = this.state;

        return (
            <div className="modalActive">
                <div className="modalClose" onClick={this.props.closeModal}>
                    <!--
                        do not use images for icons
                        What if I want to change the look?
                        my answer react-icons or icon fonts
                    -->
                    <img src={ModalCross} alt="ModalClose" /> 
                </div>
                <div className="modalWindow">
                    <form className='login-form' onSubmit={this.handleSubmit}>
                        <div className="flex-row modalLogo">
                            <h1>GeekShop</h1>
                        </div>
                        <div className="flex-row">
                            <input
                                id="username"
                                
                        <input class
                        <input classclassName='lf--input'
                                placeholder='Логін'
                                type='text'
                                value={username}
                                onChange={(e) => this.setState({ username: e.target.value })}
                                required
                                autoComplete="username"
                            />
                        </div>
                        {/* Додати поле для електронної пошти */}
                        {!isLogin && (
                            // validation for email
                            <div className="flex-row">
                                <input
                                    id="email"
                                    className='lf--input'
                                    placeholder='E-mail'
                                    type='email'
                                    value={email}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        )}
                        <div className="flex-row">
                            <input
                                id="password"
                                className='lf--input'
                                placeholder='Пароль'
                                type='password'
                                value={password}
                                onChange={(e) => this.setState({ password: e.target.value })}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <!--use btn-->
                        <input className='lf--submit' type='submit' value={isLogin ? 'Увійти' : 'Зареєструватися'} /> 
                        <a className='registration' href='#' onClick={this.toggleForm}>
                            {isLogin ? 'Реєстрація' : 'Увійти'}
                        </a>
                    </form>
                </div>
            </div>
        );
    }
}

export default AutorisationModal;
