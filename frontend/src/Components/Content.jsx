import React, { useState } from 'react'
import axios from 'axios';
import { Button } from "flowbite-react";
import { Clipboard, ClipboardCheck } from "lucide-react";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const Content = () => {
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [category,setCategory]=useState('');
    const [isPhoneValid,setIsPhoneValid]=useState(false);
    const [isCategoryValid,setIsCategoryValid]=useState(false);
    const [phoneError,setPhoneError]=useState('Please enter a valid Indian mobile number.');
    const [categoryError,setCategoryError]=useState('Please select any of the option');
    const [paymentLink,setPaymentLink]=useState('')
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
      if (!navigator.clipboard) {
        console.warn("Clipboard API not supported, using fallback.");
        copyToClipboardFallback();
        return;
      }
  
      if (typeof paymentLink === "string") {
        navigator.clipboard.writeText(paymentLink)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch((err) => console.error("Failed to copy:", err));
      } else {
        console.error("Error: link is not a string", link);
      }
    };
  
    const copyToClipboardFallback = () => {
      const textArea = document.createElement("textarea");
      textArea.value = paymentLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    const validateSelect=(value)=>{
        if(value==''){
            setIsCategoryValid(false);
            setCategoryError('Please select any of the option');
        }
        else{
            setIsCategoryValid(true);
            setCategoryError('')
        }
        setCategory(value);
    }
    const validateMobile = (number) => {
        const mobilePattern = /^[6-9]\d{9}$/;
        if (mobilePattern.test(number)) {
          setIsPhoneValid(true)
          setPhoneError("");
        } else {
          setIsPhoneValid(false)
          setPhoneError("Please enter a valid Indian mobile number.");
        }
        setPhone(number);
      };
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        };
        try {
            const res = await axios.post(`${SERVER_URL}/payment/create-payment-link`, {
              name,
              phone,
              category
            },config);
            setPaymentLink(res.data.payment_link)
            alert("Payment link sent to you number");
            
          } catch (err) {
            alert(err.message);
          }
    }
  return (
    <>
    <div className="p-4 bg-slate-300 sm:ml-64 flex items-center justify-center h-full">
   <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Initiate Payment
                </h3>
            </div>
            <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmit} >
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Client name" required />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                        <input type="text" value={phone} onChange={(e)=>validateMobile(e.target.value)} name="Phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Mobile Number" required />
                        {isPhoneValid?'':<p className='text-red-400'>{phoneError}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" name='category' value={category} onChange={(e)=>validateSelect(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                            <option value="">Select category</option>
                            <option value="Basic">Golden 90 - 9,110</option>
                            <option value="Premium">Golden 90 Premium - 11,665</option>
                            <option value="Elite">Golden 90 Elite - 16,665</option>
                            <option value="Couple">Golden 90 Couple - 12,833</option>
                            <option value="Premium_Couple">Golden 90-Premium Couple - 16,448</option>
                            <option value="Elite_Couple">Golden 90 Elite Couple - 23,498</option>
                            <option value="International_USA">Golden 90 International (USA) - $200</option>
                        </select>
                        {isCategoryValid?'':<p className='text-red-400'>{categoryError}</p>}
                    </div>
                    
                    <button type="submit" disabled={!isCategoryValid || !isPhoneValid} className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed">Send Payment Link</button>
                </form>
            </div>
        </div>
        {paymentLink==''?'': <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
      <span className="text-blue-600 font-medium truncate">{paymentLink}</span>
      <Button color="green" onClick={copyToClipboard} className="flex items-center">
        {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
        <span className="ml-2">{copied ? "Copied!" : "Copy Link"}</span>
      </Button>
    </div>}
       
    </div>
   </div>
    
    </>
  )
}

export default Content