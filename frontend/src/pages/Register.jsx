import Form from "../components/Form"
import FroggyCheerCoin from "../assets/FroggyCheerCoin.png"
import "../styles/Register.css"

function Register(){
    return <div className="register-page">
        <div className ="register-form-container">
            <h1>Create your Account</h1>
            <Form route="api/users/" method="register" />
            <p>Already have an Account? <a href="/login">Login</a></p>
        </div>
        <img src={FroggyCheerCoin} alt="Froggy Cheer Coin"></img>
    </div>;
}

export default Register;