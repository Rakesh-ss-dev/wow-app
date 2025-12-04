import { useEffect, useState } from "react"
import ComponentCard from "../common/ComponentCard"
import NutritionistDatatable from "../datatables/NutritionistDatatable"
import axiosInstance from "../../api/axios";
import { filterRequests } from "../../utils/search";
import Input from "../form/input/InputField";

const NutritionList = () => {
    const [nutritionists, setNutritionists] = useState([]);
    const [filteredNutritionists, setFilteredNutritionists] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const getNutritionists = async () => {
        try {
            const res = await axiosInstance.get(`nutrition/nutritionists`);
            setNutritionists(res.data || []);
            setFilteredNutritionists(res.data || []);
        } catch (err) {
            console.error("Failed to fetch nutritionists:", err);
        }
    };
    useEffect(() => {
        setFilteredNutritionists(filterRequests(nutritionists, searchTerm, ["name", "phone", "city"]));
    }, [searchTerm, nutritionists]);
    useEffect(() => {
        getNutritionists();
    }, []);
    return (
        <ComponentCard title="Nutritionists List" createLink={`/create-nutritionist`} createTitle="Add Nutritionist">
            <div className="w-full mb-4">
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Nutritionist name, email or Mobile Number"
                />
            </div>
            <NutritionistDatatable nutritionists={filteredNutritionists} />
        </ComponentCard>
    )
}

export default NutritionList