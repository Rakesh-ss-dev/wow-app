import axios from "axios";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const User_Form = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);


  const validatePassword = (password) => {
    const errorList = [];

    if (password.length < 8)
      errorList.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))
      errorList.push("Must contain at least one uppercase letter.");
    if (!/[a-z]/.test(password))
      errorList.push("Must contain at least one lowercase letter.");
    if (!/[0-9]/.test(password))
      errorList.push("Must contain at least one number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errorList.push("Must contain at least one special character.");

    setPasswordErrors(errorList);
    setIsValidPassword(errorList.length === 0);
    setPassword(password);
  };


  const validateMobile = (number) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    if (mobilePattern.test(number)) {
      setIsValidMobile(true);
      setMobileError("");
    } else {
      setIsValidMobile(false);
      setMobileError("Please enter a valid Indian mobile number.");
    }
    setMobile(number);
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
    const res = await axios.post(`${SERVER_URL}/auth/add-user`,{name,email,mobile,password},config);
    alert(res.data.message);
    navigate('/users');
    }
    catch(error){
        alert(error.response.data.error)
        navigate(0);
    }
  }
  return (
    <div className="flex w-[80%] h-full items-center justify-center bg-slate-300 p-4 sm:ml-64">
    <Card className="w-[50%]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name :" />
          </div>
          <TextInput
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email :" />
          </div>
          <TextInput
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="mobile" value="Mobile Number :" />
          </div>
          <TextInput
            id="mobile"
            type="text"
            required
            value={mobile}
            onChange={(e) => validateMobile(e.target.value)}
          />
          {console.log(mobile)}
          {isValidMobile && mobile!=='' ? "" : <p className="text-red-400 text-sm">{mobileError}</p>}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password :" />
          </div>
          <TextInput
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
          />
          {isValidPassword ? (
            ""
          ) : (
            <ul>
              {passwordErrors.map((error, index) => (
                <li key={index} className="text-red-400 text-sm">
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button disabled={!isValidPassword || !isValidMobile} type="submit">
          Submit
        </Button>
      </form>
    </Card>
    </div>
  );
};

export default User_Form;
