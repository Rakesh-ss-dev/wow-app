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
import Checkbox from "../../components/form/input/Checkbox";

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
  { label: "Golden 90-Premium Couple - 16,448", value: "Premium_Couple", price: 16448 },
  { label: "Golden 90 Elite Couple - 23,498", value: "Elite_Couple", price: 23498 },
  { label: "Golden 90 International (USA) - $200", value: "International_USA", price: 200 },
  { label: "International Premium (USA) - $300", value: "International_Premium_USA_300", price: 300 },
  { label: "International Elite (USA) - $400", value: "International_Elite_USA_400", price: 400 },
  { label: "DHMPC - DIAMOND HEALTH MASTERY PLAN - 24999", value: "DHMPC", price: 24999 },
  { label: "DHMPC - DIAMOND HEALTH MASTERY PLAN for COUPLE - 39999", value: "DHMPC_Couple", price: 39999 },
];

const CreateRequest: React.FC = () => {
  // Form data states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState<string>("");
  const [programStartDate, setProgramStartDate] = useState("");

  // Calculation states
  const [price, setPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState<number>(0);
  const [installment, setInstallment] = useState("");

  // Other states
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCategoryValid, setIsCategoryValid] = useState(false);
  const [isInstallmentChecked, setIsInstallmentChecked] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clipboard fallback
  const copyFallback = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy payment link
  const copyToClipboard = async () => {
    if (!paymentLink) return console.error("No payment link available");
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
    } catch {
      copyFallback(paymentLink);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mobile validation
  const validateMobile = (number: string) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    setIsPhoneValid(mobilePattern.test(number.replace(/\s+/g, "")));
    setPhone(number.replace(/\s+/g, ""));
  };

  // Category validation
  const validateSelect = (value: string) => {
    setIsCategoryValid(value !== "");
    setCategory(value);
  };

  // Installment checkbox toggle
  const changeInstallmentCheck = () => {
    setIsInstallmentChecked((prev) => {
      if (!prev) {
        setInstallmentAmount(Number((finalAmount / 2).toFixed(2))); // default 50%
        setInstallment("Installment 1");
      } else {
        setInstallmentAmount(0);
        setInstallment("");
      }
      return !prev;
    });
  };

  // Central calculation logic
  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === category);
    if (!selectedOption) return;

    const basePrice = selectedOption.price;
    const discountVal = basePrice * (Number(discount) / 100);
    const taxVal = (basePrice - discountVal) * 0.18;
    const total = basePrice - discountVal + taxVal;

    setPrice(basePrice);
    setDiscountAmount(discountVal);
    setTax(taxVal);
    setFinalAmount(total);

    if (isInstallmentChecked) {
      setInstallmentAmount(Number((total / 2).toFixed(2)));
      setInstallment("Installment 1");
    }
  }, [category, discount, isInstallmentChecked]);

  // Reset payment link whenever key fields change
  useEffect(() => {
    setPaymentLink("");
  }, [category, discount, price, installmentAmount, isInstallmentChecked]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Base payload
      let data: any = {
        name,
        phone,
        category,
        discount: Number(discount) || 0,
        finalAmount: Number(finalAmount.toFixed(2)),
        programStartDate,
      };

      // If installment is enabled
      if (isInstallmentChecked) {
        if (installmentAmount <= 0 || isNaN(installmentAmount)) {
          alert("Invalid installment amount");
          setLoading(false);
          return;
        }
        data = {
          ...data,
          installment,
          tobePaid: Number(installmentAmount.toFixed(2)),
        };
      }

      console.log("Sending data:", data);

      const res = await axios.post(
        `${SERVER_URL}/payment/create-payment-link`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentLink(res.data.payment_link);
      alert("Payment link sent to your number");
    } catch (err: any) {
      console.error("Error creating payment link:", err.response?.data || err.message);
      alert("Failed to generate payment link");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-full items-center justify-center flex-col md:flex-row p-4">
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-700 p-5">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Initiate Payment
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <Input type="text" value={phone} onChange={(e) => validateMobile(e.target.value)} placeholder="Phone" required />
            <Select options={options} onChange={validateSelect} />
            <Input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Discount (%)"
              step=".01"
            />
            <Input
              type="date"
              placeholder="Program Start Date"
              value={programStartDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setProgramStartDate(e.target.value)}
            />
            <Checkbox checked={isInstallmentChecked} onChange={changeInstallmentCheck} label="Installment" />
            {isInstallmentChecked && (
              <Input
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(Number(e.target.value))}
                placeholder="Installment Amount"
              />
            )}
            <Button
              type="submit"
              disabled={!isPhoneValid || !isCategoryValid || !name}
            >
              {loading ? "Processing..." : "Send Payment Link"}
            </Button>
          </form>

          {paymentLink && (
            <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mt-4">
              <a href={paymentLink} target="_blank" className="truncate font-medium text-blue-600 underline">
                {paymentLink}
              </a>
              <Button onClick={copyToClipboard} className="flex items-center">
                {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
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
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Amount
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {price.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Discount
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {discountAmount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Tax (18%)
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {tax.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Final Price
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {finalAmount.toFixed(2)}
              </TableCell>
            </TableRow>
            {isInstallmentChecked && (
              <>
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    To be Paid
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {installmentAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Balance
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {(finalAmount - installmentAmount).toFixed(2)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CreateRequest;
