import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clipboard, ClipboardCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

interface Option {
  label: string;
  value: string;
  price: number;
}

const options: Option[] = [
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
  {
    label:"DHMPC - DIAMOND HEALTH MASTERY PLAN - 24999",
    value: "DHMPC",
    price:24999
  },
  {
    label:"DHMPC - DIAMOND HEALTH MASTERY PLAN for COUPLE - 39999",
    value: "DHMPC_Couple",
    price:39999
  },
  
];

const CreateRequest: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isCategoryValid, setIsCategoryValid] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const validateMobile = (number: string) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    setIsPhoneValid(mobilePattern.test(number));
    setPhone(number);
  };

  const validateSelect = (value: string) => {
    setIsCategoryValid(value !== "");
    setCategory(value);
  };

  useEffect(() => {
    const selectedOption = options.find((option) => option.value === category);
    if (selectedOption) {
      const amount = selectedOption.price;
      const taxAmount = amount * 0.18;
      setPrice(amount);
      setTax(taxAmount);
      setFinalAmount(amount + taxAmount);
    }
  }, [category]);

  useEffect(() => {
    const discountPrice = price * (discount / 100);
    const taxAmount = (price - discountPrice) * 0.18;
    setDiscountAmount(discountPrice);
    setTax(taxAmount);
    setFinalAmount(price - discountPrice + taxAmount);
  }, [discount, price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${SERVER_URL}/payment/create-payment-link`,
        {
          name,
          phone,
          category,
          discount,
          finalAmount: finalAmount.toFixed(2),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentLink(res.data.payment_link);
      alert("Payment link sent to your number");
    } catch (err) {
      alert("Failed to generate payment link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center flex-col md:flex-row p-4">
      <div className="relative max-h-full w-full max-w-[34rem] p-4">
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-700 p-5">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Initiate Payment
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="input"
            />
            <Input
              type="text"
              value={phone}
              onChange={(e) => validateMobile(e.target.value)}
              placeholder="Phone"
              required
              className="input"
            />
            <Select options={options} onChange={validateSelect} />
            <Input
              type="number"
              min="0"
              max="100"
              value={discount==0?"":discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="Discount (%)"
              required
              className="input"
            />
            <Button
              type="submit"
              disabled={!isPhoneValid || !isCategoryValid || !name || loading}
              className="btn btn-primary"
            >
              {loading ? "Processing..." : "Send Payment Link"}
            </Button>
          </form>
          {paymentLink && (
            <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mt-4">
              <span className="truncate font-medium text-blue-600">
                {paymentLink}
              </span>
              <Button onClick={copyToClipboard} className="flex items-center">
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
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">Amount</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{price.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">Discount</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{discountAmount.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">Tax (18%)</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{tax.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">Final Price</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{finalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
  );
};

export default CreateRequest;
