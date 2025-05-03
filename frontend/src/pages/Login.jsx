import Form from "../components/Form"
import { Link } from "react-router-dom"
import "../styles/Login.css"
import FroggyMain from "../assets/FroggyMain.png"

function Login(){
    return <div className="login-page">
        <img src={FroggyMain} alt="Froggy Main"></img>
        <div className="login-form-container">
            <h1>Login</h1>
            <div className="login-input-container">
                <Form route="/api/token/" method="login" />
            </div>
            <p className="register-anchor">Not registered yet? <a href="/register"><strong>Create an account</strong></a></p>
        </div>
    </div>
}

export default Login;