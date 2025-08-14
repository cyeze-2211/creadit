import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    Typography,
    Select,
    Option,
    Input,
    Button,
} from "@material-tailwind/react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function CreditSell() {
    const { id } = useParams();
    const [selectedClient, setSelectedClient] = useState("");
    const [initialPayment, setInitialPayment] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [files, setFiles] = useState([]);
    const [clients, setClients] = useState([]);
    const [product, setProduct] = useState(null);

    // Format helpers
    const formatNumber = (value) => {
        const onlyNums = value.replace(/\D/g, "");
        return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    const toNumber = (str) => parseInt(str.replace(/\s/g, "")) || 0;

    // Oylik to‘lov
    const monthlyPayment = useMemo(() => {
        const total = toNumber(totalPrice);
        const initial = toNumber(initialPayment);
        const months = parseInt(duration) || 0;
        if (!total || !months || initial >= total) return "0";
        const monthly = Math.floor((total - initial) / months);
        return formatNumber(monthly.toString());
    }, [totalPrice, initialPayment, duration]);

    // Mahsulot va mijozlar olish
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    "ngrok-skip-browser-warning": "true",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                };

                // Mahsulotni olish
                const productRes = await axios.get(`/api/products/${id}`, { headers });
                setProduct(productRes.data?.data || null);

                // Mijozlar ro‘yxatini olish
                const clientsRes = await axios.get(`/api/customers`, { headers });
                setClients(clientsRes.data?.data || []);
            } catch (error) {
                console.error("Ma'lumot olishda xatolik:", error);
                Swal.fire("Xato!", "Ma'lumotlarni olishda xatolik yuz berdi", "error");
            }
        };

        fetchData();
    }, [id]);

    // Kredit sotish
    const handleCreditSell = async () => {
        if (!selectedClient || !totalPrice || !initialPayment || !duration) {
            Swal.fire("Diqqat!", "Iltimos, barcha maydonlarni to‘ldiring.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("customer_id", selectedClient);
        formData.append("product_id", id);
        formData.append("total_price", toNumber(totalPrice));
        formData.append("initial_payment", toNumber(initialPayment));
        formData.append("duration", parseInt(duration));
        formData.append("monthly_payment", toNumber(monthlyPayment));
        files.forEach((file) => formData.append("files[]", file));

        try {
            const headers = {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            };

            await axios.post("/api/credits", formData, { headers });

            Swal.fire("Muvaffaqiyatli!", "Mahsulot kredit asosida sotildi!", "success");
        } catch (error) {
            console.error("API xatosi:", error);
            Swal.fire("Xato!", "Kredit sotishda xatolik yuz berdi", "error");
        }
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(selected);
    };

    return (
        <div className="min-h-screen mt-[80px] pb-10 flex justify-center px-4 bg-gray-100">
            <div className="w-full max-w-6xl flex flex-col gap-10">
                {/* Mahsulot haqida */}
                {product && (
                    <Card className="rounded-2xl shadow-md p-6 bg-white">
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <img
                                src={product?.image || ""}
                                alt={product?.name || "Mahsulot"}
                                className="w-40 h-40 object-contain rounded-xl shadow"
                            />
                            <div className="text-center lg:text-left">
                                <Typography variant="h4" className="font-bold text-blue-gray-800">
                                    {product?.product_name || ""}
                                </Typography>
                                <Typography variant="h5" className="text-green-600 font-semibold mt-2">
                                   Narxi : {formatNumber((product?.price || 0).toString())} $
                                </Typography>
                                 <Typography className="text-gray-600 text-sm mt-4 max-w-xl">
                                   Oylik tolov : {product?.monthly_payment || ""}
                                </Typography>
                                <Typography className="text-gray-600 text-sm mt-4 max-w-xl">
                                   Qoldiq : {product?.amount || ""}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Kredit formasi */}
                <Card className="rounded-2xl shadow-md p-8 bg-white">
                    <Typography variant="h5" className="text-center mb-6 font-bold text-blue-gray-800">
                        Kredit Shartlari
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Typography className="mb-2 text-sm font-medium text-blue-gray-700">
                                Mijozni tanlang
                            </Typography>
                            <Select
                                label="Mijoz"
                                value={selectedClient}
                                onChange={setSelectedClient}
                            >
                                {clients.map((client) => (
                                    <Option key={client.id} value={client.id}>
                                        {client.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Typography className="mb-2 text-sm font-medium text-blue-gray-700">
                                Umumiy narx
                            </Typography>
                            <Input
                                label="Masalan: 3 500 000"
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(formatNumber(e.target.value))}
                            />
                        </div>

                        <div>
                            <Typography className="mb-2 text-sm font-medium text-blue-gray-700">
                                Boshlang‘ich to‘lov
                            </Typography>
                            <Input
                                label="Masalan: 1 000 000"
                                value={initialPayment}
                                onChange={(e) => setInitialPayment(formatNumber(e.target.value))}
                            />
                        </div>

                        <div>
                            <Typography className="mb-2 text-sm font-medium text-blue-gray-700">
                                Kredit muddati (oy)
                            </Typography>
                            <Select label="Oy" value={duration} onChange={setDuration}>
                                {[...Array(30)].map((_, i) => (
                                    <Option key={i + 1} value={(i + 1).toString()}>
                                        {i + 1} oy
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* File upload */}
                    <div className="mt-6">
                        <Typography className="mb-2 text-sm font-medium text-blue-gray-700">
                            Fayllarni yuklash (rasm yoki hujjat)
                        </Typography>
                        <label className="flex items-center gap-3 cursor-pointer bg-blue-50 border border-blue-200 p-3 rounded-lg hover:bg-blue-100 transition">
                            <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
                            <span className="text-blue-700 font-medium">Fayl(lar)ni tanlang</span>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        {files.length > 0 && (
                            <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                                {files.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Natija */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <Typography className="text-blue-900 font-semibold">
                            Oylik to‘lov:{" "}
                            <span className="text-xl text-black">
                                {monthlyPayment} so'm / oyiga
                            </span>
                        </Typography>
                    </div>

                    <Button
                        fullWidth
                        color="blue"
                        size="lg"
                        onClick={handleCreditSell}
                        className="mt-6"
                    >
                        Kreditga sotish
                    </Button>
                </Card>
            </div>
        </div>
    );
}
