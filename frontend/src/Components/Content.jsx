import React, { useState } from 'react'

const Content = () => {
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [category,setCategory]=useState('');
    const [isPhoneValid,setIsPhoneValid]=useState(false);
    const [isCategoryValid,setIsCategoryValid]=useState(false);
  return (
    <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white left-[50%] rounded-lg shadow-sm dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Initiate Payment
                </h3>
            </div>
            <div class="p-4 md:p-5">
                <form class="space-y-4" >
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your name" required />
                    </div>
                    <div>
                        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                        <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} name="Phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Mobile Number" required />
                    </div>
                    <div>
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" value={category} onChange={(e)=>setCategory(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                            <option selected="">Select category</option>
                            <option value="Basic">Golden 90 - 9,110</option>
                            <option value="Premium">Golden 90 Premium - 11,665</option>
                            <option value="Elite">Golden 90 Elite - 16,665</option>
                            <option value="Couple">Golden 90 Couple - 12,833</option>
                            <option value="Premium_Couple">Golden 90-Premium Couple - 16,448</option>
                            <option value="Elite_Couple">Golden 90 Elite Couple - 23,498</option>
                            <option value="International_USA">Golden 90 International (USA) - $200</option>
                        </select>
                    </div>
                    
                    <button type="submit" disabled={!isCategoryValid || !isPhoneValid} class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Content