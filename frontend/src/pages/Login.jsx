import Form from "../components/Form"
import { Link } from "react-router-dom"

function Login(){
    return <div>
        <Form route="/api/token/" method="login" />
        <Link to="/register" className="nav-link">Register</Link>
    </div>
}

export default Login;