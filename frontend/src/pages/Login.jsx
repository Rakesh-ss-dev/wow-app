import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  console.log(SERVER_URL,'hello');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 overflow-y-auto">
      <div className="bg-green-500"></div>
      <div className="p-20">
        <p className="text-3xl">WELCOME to WOW Coach Dashboard</p>
        <form onSubmit={handleLogin}>
          <div className="flex h-[60vh] flex-col justify-between">
            <div className="w-full">
              <div className="input">
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="w-full border  border-[#5541D7] rounded-[8px] px-[10px] py-[12px]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="input your email in here"
                />
              </div>
              <div className="input">
                <label className="block" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="w-full border border-[#5541D7] rounded-[8px] px-[10px] py-[12px]"
                  type="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="input your password in here"
                />
              </div>
              <div className="text-end">
                <a className="text-right" href="">
                  forgot password?
                </a>
              </div>
            </div>
            <div className="w-full">
              <div>
                <button
                  className="w-full rounded-[8px] px-[7px] py-[12px] bg-[#2C5F2E] text-white"
                  type="submit"
                >
                  Sign in
                </button>
                <p className="text-center">or</p>
                <button
                  className="w-full rounded-[8px] px-[7px] py-[12px] bg-white text-[#2C5F2E]"
                  type="submit"
                >
                  Sign in with google
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
