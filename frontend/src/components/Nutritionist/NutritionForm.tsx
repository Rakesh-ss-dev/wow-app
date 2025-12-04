import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import axiosInstance from "../../api/axios";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";

const NutritionForm = () => {
    const navigate = useNavigate();
    const [coaches, setCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState<any>(null);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const getCoaches = async () => {
        // Fetch coaches logic here
        try {
            const res = await axiosInstance.get(`/coach/coaches`);
            const coachesData = res.data.coaches;
            const formattedCoaches = coachesData.map((coach: any) => ({ label: coach.name, value: coach._id }));
            setCoaches(formattedCoaches);
        } catch (err) {

            console.error("Failed to fetch coaches:", err);
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(`/nutrition/create-nutritionist`, {
                name,
                email,
                phone,
                password,
                coachId: selectedCoach,
            });
            alert(res.data.message);
            navigate("/nutritionists");
        } catch (err) {
            alert("Failed to create nutritionist. Please try again.");
            console.error("Failed to create nutritionist:", err);
        }
    }

    useEffect(() => {
        getCoaches();
    }, []);

    return (
        <ComponentCard title="Create Nutritionist">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="name">Name :</Label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="email">Email :</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number :</Label>
                    <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="city">Coach :</Label>
                    <Select options={coaches} onChange={(selectedValue) => { console.log(selectedValue); setSelectedCoach(selectedValue); }} placeholder="Select Coach" />
                </div>
                <div>
                    <Label htmlFor="password">Password :</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="flex align-end justify-end md:col-span-2">
                    <Button type="submit" className="mt-6">
                        Create Nutritionist
                    </Button>
                </div>
            </form>
        </ComponentCard>
    )
}

export default NutritionForm