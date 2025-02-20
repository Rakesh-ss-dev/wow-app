import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableHead } from "flowbite-react";
import { Clipboard, ClipboardCheck } from "lucide-react";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const Payment_Content = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCategoryValid, setIsCategoryValid] = useState(false);
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [phoneError, setPhoneError] = useState(
    "Please enter a valid Indian mobile number.",
  );
  const [categoryError, setCategoryError] = useState(
    "Please select any of the option",
  );
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      console.warn("Clipboard API not supported, using fallback.");
      copyToClipboardFallback();
      return;
    }

    if (typeof paymentLink === "string") {
      navigator.clipboard
        .writeText(paymentLink)
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
  const validateSelect = (value) => {
    if (value == "") {
      setIsCategoryValid(false);
      setCategoryError("Please select any of the option");
    } else {
      setIsCategoryValid(true);
      setCategoryError("");
    }
    setCategory(value);
  };
  useEffect(() => {
    const selectedOption = options.find((option) => option.value === category);
    if (selectedOption) {
      const amount = parseInt(selectedOption.price);
      const taxAmount = parseFloat((selectedOption.price * (18 / 100)));
      setPrice(amount.toFixed(2));
      setTax(taxAmount.toFixed(2));
      setFinalAmount((amount + taxAmount).toFixed(2));
    }
  }, [category]);
  useEffect(() => {
    const discountPrice = parseFloat(price * (discount / 100));
    const taxAmount = parseFloat((price - discountPrice) * (18 / 100));
    setDiscountAmount(discountPrice.toFixed(2));
    setTax(taxAmount.toFixed(2));
    setFinalAmount((price - discountPrice + taxAmount).toFixed(2));
  }, [discount]);
  const options = [
    { label: "Select category", value: "", price: 0 },
    { label: "Golden 90 - 9,110", value: "Basic", price: 9110 },
    { label: "Golden 90 Premium - 11,665", value: "Premium", price: 11665 },
    { label: "Golden 90 Elite - 16,665", value: "Elite", price: 16665 },
    { label: "Golden 90 Couple - 12,833", value: "Couple", price: 12833 },
    {
      label: "Golden 90-Premium Couple - 16,448",
      value: "Premium_Couple",
      price: 16448,
    },
    {
      label: "Golden 90 Elite Couple - 23,498",
      value: "Elite_Couple",
      price: 23498,
    },
    {
      label: "Golden 90 International (USA) - $200",
      value: "International_USA",
      price: 200,
    },
  ];
  const validateMobile = (number) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    if (mobilePattern.test(number)) {
      setIsPhoneValid(true);
      setPhoneError("");
    } else {
      setIsPhoneValid(false);
      setPhoneError("Please enter a valid Indian mobile number.");
    }
    setPhone(number);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in headers
      },
    };
    try {
      const res = await axios.post(
        `${SERVER_URL}/payment/create-payment-link`,
        {
          name,
          phone,
          category,
          discount,
          finalAmount
        },
        config,
      );
      setPaymentLink(res.data.payment_link);
      alert("Payment link sent to you number");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <>
      <div className="flex h-full items-center justify-center bg-slate-300 p-4 sm:ml-64">
        <div className="relative max-h-full w-full max-w-md p-4">
          <div className="rounded-lg bg-white shadow-sm dark:bg-gray-700">
            <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-600 md:p-5">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Initiate Payment
              </h3>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    id="name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter Client name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => validateMobile(e.target.value)}
                    name="Phone"
                    id="phone"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter Mobile Number"
                    required
                  />
                  {isPhoneValid ? (
                    ""
                  ) : (
                    <p className="text-red-400">{phoneError}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => validateSelect(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {isCategoryValid ? (
                    ""
                  ) : (
                    <p className="text-red-400">{categoryError}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount(%)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    name="discount"
                    id="discount"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter discount %"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isCategoryValid || !isPhoneValid}
                  className="w-full rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Send Payment Link
                </button>
              </form>
            </div>
          </div>
          {paymentLink == "" ? (
            ""
          ) : (
            <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
              <span className="truncate font-medium text-blue-600">
                {paymentLink}
              </span>
              <Button
                color="green"
                onClick={copyToClipboard}
                className="flex items-center"
              >
                {copied ? (
                  <ClipboardCheck size={18} />
                ) : (
                  <Clipboard size={18} />
                )}
                <span className="ml-2">{copied ? "Copied!" : "Copy Link"}</span>
              </Button>
            </div>
          )}
        </div>
        <div className="p-4 w-[30%]">
              <Table striped>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Amount</Table.Cell>
                    <Table.Cell>{price}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Discount</Table.Cell>
                    <Table.Cell>{discountAmount}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tax(18%)</Table.Cell>
                    <Table.Cell>{tax}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Final Price</Table.Cell>
                    <Table.Cell>{finalAmount}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
      </div>
    </>
  );
};

export default Payment_Content;
