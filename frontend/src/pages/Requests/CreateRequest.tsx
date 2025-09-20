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
import MultiSelect from "../../components/form/MutiSelect";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

interface Option {
  label: string;
  value: string; // MUST match Package.name in your DB
  price: number; // used only for UI calculation
}

// Make sure each `value` EXACTLY equals the Package.name stored in DB
const options: Option[] = [
  { label: "Golden 90 - 9,110", value: "Basic", price: 9110 },
  { label: "Golden 90 Premium - 11,665", value: "Premium", price: 11665 },
  { label: "Golden 90 Elite - 16,665", value: "Elite", price: 16665 },
  { label: "Golden 90 Couple - 12,833", value: "Couple", price: 12833 },
  { label: "Golden 90-Premium Couple - 16,448", value: "Premium_Couple", price: 16448 },
  { label: "Golden 90 Elite Couple - 23,498", value: "Elite_Couple", price: 23498 },
  { label: "Golden 90 International (USA) - $200", value: "International_USA", price: 200 },
  { label: "International Premium (USA) - $300", value: "International_300", price: 300 },
  { label: "International Elite (USA) - $400", value: "International_400", price: 400 },
  { label: "DHMPC - DIAMOND HEALTH MASTERY PLAN - 24999", value: "DHMPC", price: 24999 },
  { label: "DHMPC - DIAMOND HEALTH MASTERY PLAN for COUPLE - 39999", value: "DHMPC_Couple", price: 39999 },
  { label: "WG5 Course - 9999", value: "WG5_Course", price: 9999 },
];

const causeOptions = [
  { text: "Weight Loss", value: "Weight Loss", selected: false },
  { text: "Diabetes Reversal", value: "Diabetes Reversal", selected: false },
  { text: "PCOD/PCOS Reversal", value: "PCOD/PCOS Reversal", selected: false },
  { text: "Thyroid", value: "Thyroid", selected: false },
  { text: "Others", value: "Others", selected: false }
]

const CreateRequest: React.FC = () => {
  // Form fields
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState<string>("");
  const [programStartDate, setProgramStartDate] = useState("");
  const [referrerPhone, setReferrerPhone] = useState('');
  const [cause, setCause] = useState<string[]>([]);
  // Calculations
  const [price, setPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState<number>(0);
  const [installment, setInstallment] = useState("");

  // UI state
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCategoryValid, setIsCategoryValid] = useState(false);
  const [isInstallmentChecked, setIsInstallmentChecked] = useState(false);
  const [isCauseValid, setIsCauseValid] = useState(false);
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

  // Mobile validation (India)
  const validateMobile = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const mobilePattern = /^\d{6,15}$/;
    setIsPhoneValid(mobilePattern.test(cleaned));
    setPhone(cleaned);
  };

  // Category change
  const validateSelect = (value: string) => {
    setIsCategoryValid(!!value);
    setCategory(value);
  };
  const validateCauses = (selected: string[]) => {
    setIsCauseValid(selected.length > 0);
    setCause(selected);
  }
  // Toggle installment
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

  // Recalculate totals
  useEffect(() => {
    const selected = options.find((o) => o.value === category);
    if (!selected) return;

    const base = selected.price;
    const disc = base * (Number(discount || 0) / 100);
    const tx = (base - disc) * 0.18;
    const total = base - disc + tx;

    setPrice(base);
    setDiscountAmount(disc);
    setTax(tx);
    setFinalAmount(total);

    if (isInstallmentChecked) {
      setInstallmentAmount(Number((total / 2).toFixed(2)));
      setInstallment("Installment 1");
    }
  }, [category, discount, isInstallmentChecked]);

  // Reset link on recalculation / toggles
  useEffect(() => {
    setPaymentLink("");
  }, [category, discount, price, installmentAmount, isInstallmentChecked]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let data: any = {
        name,
        phone,
        countryCode,
        category, // MUST match Package.name in DB
        discount: Number(discount) || 0,
        finalAmount: Number(finalAmount.toFixed(2)),
        programStartDate,
        cause,
        referrerPhone
      };

      if (isInstallmentChecked) {
        if (!installmentAmount || installmentAmount <= 0) {
          alert("Invalid installment amount");
          setLoading(false);
          return;
        }
        data = { ...data, installment, tobePaid: Number(installmentAmount.toFixed(2)) };
      } else {
        data.tobePaid = 0;
      }

      const res = await axios.post(
        `${SERVER_URL}/payment/create-payment-link`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentLink(res.data.payment_link);
      alert("Payment link generated successfully!");

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Create link error:", err.response?.data || err.message);
        alert(`Failed: ${JSON.stringify(err.response?.data || err.message)}`);
      } else {
        console.error("Unexpected error:", err);
        alert("Unexpected error occurred.");
      }
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
            <div className="flex gap-3">
              <div className="w-1/4">
                <Input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="Country Code" required />
              </div>
              <div className="w-3/4">
                <Input type="text" value={phone} onChange={(e) => validateMobile(e.target.value)} placeholder="Phone" required />
              </div>
            </div>

            {/* Your Select should pass back the selected .value string */}
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
            <Input type="text" value={referrerPhone} onChange={e => setReferrerPhone(e.target.value)} placeholder="Referred User Mobile Number" />
            <div>
              <MultiSelect
                label="Reason for joining"
                options={causeOptions}
                onChange={(selected) => validateCauses(selected)}
              />
            </div>
            <Checkbox checked={isInstallmentChecked} onChange={changeInstallmentCheck} label="Installment" />
            {isInstallmentChecked && (
              <Input
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(Number(e.target.value))}
                placeholder="Installment Amount"
              />
            )}
            <Button type="submit" disabled={!isPhoneValid || !isCategoryValid || !name || !isCauseValid}>
              {loading ? "Processing..." : "Send Payment Link"}
            </Button>
          </form>

          {paymentLink && (
            <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mt-4">
              <a href={paymentLink} target="_blank" className="truncate font-medium text-blue-600 underline" rel="noreferrer">
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

      {/* Summary */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start">Amount</TableCell>
              <TableCell className="px-4 py-3">{price.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start">Discount</TableCell>
              <TableCell className="px-4 py-3">{discountAmount.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start">Tax (18%)</TableCell>
              <TableCell className="px-4 py-3">{tax.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-4 py-3 text-gray-500 text-start">Final Price</TableCell>
              <TableCell className="px-4 py-3">{finalAmount.toFixed(2)}</TableCell>
            </TableRow>
            {isInstallmentChecked && (
              <>
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start">To be Paid</TableCell>
                  <TableCell className="px-4 py-3">{installmentAmount.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start">Balance</TableCell>
                  <TableCell className="px-4 py-3">{(finalAmount - installmentAmount).toFixed(2)}</TableCell>
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
