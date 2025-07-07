import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in both fields");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/login",
                { email, password },
                { withCredentials: true }
            );
            const { role } = response.data.user;
            if (role === "teacher") {
                navigate("/teacher/dashboard");
            } else if (role === "student") {
                navigate("/student/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError("Invalid credentials or server error");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form" autoComplete="off">
                <h1>Login</h1>

                {error && <p className="error-message" role="alert">{error}</p>}

                <div className="form-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                        aria-label="Email address"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                        aria-label="Password"
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Login
                </button>

                <div className="signup-redirect">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </div>
            </form>
        </div>
    );
}