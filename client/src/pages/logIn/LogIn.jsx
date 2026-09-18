import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/userService";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/logo.png";
import FormInput from "../../components/common/FormInput";

const LogIn = () => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ mail, password });
            loginUser(res.data.user);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4">
            <div className="max-w-sm w-full text-gray-600">
                <div className="text-center">
                    <img src={Logo} width={200} className="mx-auto" alt="Logo" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                        <p>Don't have an account? <Link to="/signUp" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link></p>
                    </div>
                </div>
                <form onSubmit={handleLogin} className="mt-8 space-y-5">
                    <FormInput 
                        label="Email" 
                        type="email" 
                        value={mail} 
                        onChange={(e) => setMail(e.target.value)} 
                        required 
                        placeholder="your email" 
                    />
                    <FormInput 
                        label="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        placeholder="your password" 
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white font-medium bg-[#AAD4C1] hover:bg-[#7EC7A6] active:bg-[#7EC7A6] rounded-lg duration-150 shadow-md"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </main>
    );
};

export default LogIn;