import React, { useMemo, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Select,
    Option,
} from "@material-tailwind/react";
import axios from "axios";
import ReactLoading from "react-loading";

const monthOptions = [
    { label: "Yanvar", value: "01" },
    { label: "Fevral", value: "02" },
    { label: "Mart", value: "03" },
    { label: "Aprel", value: "04" },
    { label: "May", value: "05" },
    { label: "Iyun", value: "06" },
    { label: "Iyul", value: "07" },
    { label: "Avgust", value: "08" },
    { label: "Sentyabr", value: "09" },
    { label: "Oktyabr", value: "10" },
    { label: "Noyabr", value: "11" },
    { label: "Dekabr", value: "12" },
];

export default function Debtors() {
    const currentMonth = new Date().toISOString().slice(5, 7);
    const currentYear = new Date().getFullYear();

    const [search, setSearch] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [debtors, setDebtors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`/api/debtors?month=${selectedMonth}&year=${year}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (res.data && Array.isArray(res.data.debtors)) {
                    setDebtors(res.data.debtors);
                } else {
                    setDebtors([]);
                }
            })
            .catch((err) => {
                console.error("API xatosi:", err);
                setDebtors([]);
            })
            .finally(() => setLoading(false));
    }, [selectedMonth, year]);

    const filteredDebtors = useMemo(() => {
        return debtors.filter(
            (debtor) =>
                (debtor.fio &&
                    debtor.fio.toLowerCase().includes(search.toLowerCase())) ||
                (debtor.phone && debtor.phone.includes(search))
        );
    }, [debtors, search]);

    const totalAmount = filteredDebtors.reduce(
        (sum, d) => sum + (Number(d.qarz) || 0),
        0
    );

    return (
        <div className="mt-[90px] px-4 pb-10">
            <Typography variant="h3" className="mb-6 font-bold text-gray-800">
                Qarzdor mijozlar
            </Typography>

            {/* Umumiy summa */}
            <Card className="bg-gradient-to-r from-red-100 to-red-50 border border-red-300 mb-8 shadow-lg">
                <CardBody>
                    <Typography variant="h6" className="text-red-900 font-semibold">
                        Umumiy qarz – {monthOptions.find(m => m.value === selectedMonth)?.label}:
                    </Typography>
                    <Typography variant="h3" className="text-red-700 font-bold mt-2">
                        {totalAmount.toLocaleString()} so‘m
                    </Typography>
                </CardBody>
            </Card>

            {/* Filterlar */}
            <Card className="mb-8 shadow-md">
                <CardBody className="flex flex-col md:flex-row gap-4">
                    <Select
                        label="Oy bo'yicha tanlang"
                        value={selectedMonth}
                        onChange={(val) => setSelectedMonth(val)}
                    >
                        {monthOptions.map((m) => (
                            <Option key={m.value} value={m.value}>
                                {m.label}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        type="number"
                        label="Yil"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        crossOrigin={undefined}
                    />
                    <Input
                        label="Qidirish (Ism yoki Telefon)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        crossOrigin={undefined}
                    />
                </CardBody>
            </Card>

            {/* Jadval yoki Loader */}
            {loading ? (
                <div className="min-h-[300px] flex justify-center items-center">
                    <ReactLoading type="spin" color="#4CAF50" height={100} width={100} />
                </div>
            ) : (
                <Card className="mb-8 shadow-md">
                    <CardBody className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="overflow-x-auto rounded-xl w-full">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">#</th>
                                        <th className="px-4 py-3 text-left font-medium">F.I.O</th>
                                        <th className="px-4 py-3 text-left font-medium">Telefon</th>
                                        <th className="px-4 py-3 text-left font-medium">Tovar</th>
                                        <th className="px-4 py-3 text-left font-medium">Qarz (so‘m)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDebtors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                                Ma'lumot topilmadi
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDebtors.map((debtor, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-100 border-t border-gray-100 transition"
                                            >
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">{debtor.fio}</td>
                                                <td className="px-4 py-3">{debtor.phone}</td>
                                                <td className="px-4 py-3">{debtor.product_name}</td>
                                                <td className="px-4 py-3 font-semibold text-red-600">
                                                    {Number(debtor.qarz).toLocaleString()} so‘m
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
