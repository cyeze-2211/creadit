import {
    Card,
    CardBody,
    Typography,
    Avatar,
    Button,
    Spinner,
    Alert,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ShopDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("ID topilmadi");
            setLoading(false);
            return;
        }
        axios.get(`/api/sells/${id}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                if (res.data?.data) {
                    setOrder(res.data.data);
                } else {
                    setError("Buyurtma topilmadi");
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "Xatolik yuz berdi");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert color="red" className="max-w-md">{error}</Alert>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert color="amber" className="max-w-md">Buyurtma topilmadi</Alert>
            </div>
        );
    }

    // Ma'lumotlarni API dan kelgan struktura bo'yicha ajratamiz
    const client = order.customer || {};
    const product = order.product || {};
    const price = order.price || 0;

    // To'lov tarixi bo'lsa, uni ko'rsating (agar APIda bo'lsa)
    const paymentHistory = order.payments || [];

    // Qolgan summa hisoblash (agar kerakli fieldlar bo'lsa)
    const totalCredit = price;
    const paidAmount = paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0);
    const remainingAmount = totalCredit - paidAmount;

    return (
        <div className="mx-auto px-4 py-8 space-y-6 mt-[90px]">
            {/* Mijoz haqida */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-4">
                <Avatar
                    src={client.photo || "https://i.ibb.co/fY2Ypyk/default-user.png"}
                    size="xxl"
                    alt="User"
                    className="rounded-lg"
                />
                <CardBody>
                    <Typography variant="h5" color="blue-gray">
                        {client.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                        📞 Telefon: {client.phone}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                        📍 Manzil: {client.address}
                    </Typography>
                </CardBody>
            </Card>

            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img
                        src={product.image}
                        alt={product.product_name}
                        className="w-full md:w-64 h-64 object-cover rounded-xl"
                    />
                    <div className="flex-1 space-y-2">
                        <Typography variant="h5">{product.product_name}</Typography>
                        <Typography className="text-gray-600 text-sm">
                            {product.description}
                        </Typography>
                        <Typography variant="small" className="mt-2">
                            💰 Narxi:{" "}
                            <span className="font-semibold">
                                {product.price ? Number(product.price).toLocaleString() : "-"} $
                            </span>
                        </Typography>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <Typography color="gray">Umumiy Tolov</Typography>
                                <Typography>{totalCredit.toLocaleString()} $</Typography>
                            </div>
                            <div>
                                <Typography color="gray">To‘langan Vaqt</Typography>
                                <Typography>{product.created_at} </Typography>
                            </div>
                            <div>
                                <Typography color="gray">Qolgan Tovarlar</Typography>
                                <Typography className="text-red-500">
                                    {product.amount} ta
                                </Typography>
                            </div>
                        </div>
                      
                    </div>
                </div>
            </Card>

           
        </div>
    );
}
