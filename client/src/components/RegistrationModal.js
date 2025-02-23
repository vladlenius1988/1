import React, { Component } from 'react';
import ModalCross from "./icons/modalCross.svg";
import { useNavigate } from "react-router";

class RegistrationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: { username: '', password: '', email: '' },
            isVisible: false, // Стан для видимості модального вікна
        };
    }

    toggleModal = () => {
        this.setState(prevState => ({ isVisible: !prevState.isVisible }));
    };

    handleChange = (e) => {
        this.setState({
            form: { ...this.state.form, [e.target.name]: e.target.value }
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { form } = this.state;
        const { navigate } = this.props;
        // use in only debbug mode
        console.log('Submitting form:', form);
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        //usually use type of status response (success, pendind, error)
        if (response.ok) {
            console.log('Реєстрація успішна');
            navigate("/");
        } else {
           // pls show dialog or toaster why register is not successfull
            console.error('Реєстрація не вдалася');
        }
    };

    render() {
        const { isVisible } = this.state;

        return (
            <div className={`registrationBackground ${isVisible ? 'show' : ''}`}>
                {isVisible && (
                    <div className="modalActive">
                        <div className="registrationClose" onClick={this.toggleModal}>
                            <img src={ModalCross} alt="ModalCross" />
                        </div>
                         // pls select one style to write styles (camelCaseStyle or other-styles)
                        <div className="modalWindow">
                            <form className='login-form' onSubmit={this.handleSubmit}>
                                <div className="flex-row modalLogo">
                                    <h1>GeekShop</h1>
                                </div>
                                <div className="flex-row">
                                    // add validation 
                                    <input id="user" className='lf--input' name="username" placeholder='Логін' type='text' onChange={this.handleChange} required autoComplete="username" />
                                </div>
                                <div className="flex-row">
                                    <input id="email" className='lf--input' name="email" placeholder='E-mail' type='email' onChange={this.handleChange} required autoComplete="email"/>
                                </div>
                                <div className="flex-row">
                                    <input id="password2" className='lf--input' name="password" placeholder='Пароль' type='password' onChange={this.handleChange} required autoComplete="new-password"/>
                                </div>
                                // As far as I know, button is preferable, answer why
                                // Also disabled button when your form in not valid
                                <input className='lf--submit' type='submit' value='Підтвердити' />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

// Обёртка для функционального компонента
const RegistrationModalWithNavigate = () => {
    const navigate = useNavigate();
    return <RegistrationModal navigate={navigate} />;
};

export default RegistrationModalWithNavigate;
