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
import OrderPaymentCreate from "./OrderDetailCreate";
import OrderDabtors from "./OrderDabtors"; // 🔥 qarz yozish modalini import

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false); // 🔥 yangi state

    useEffect(() => {
        if (!id) {
            setError("ID topilmadi");
            setLoading(false);
            return;
        }
        axios
            .get(`/api/cridets/${id}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (res.data?.data) {
                    setOrder(res.data.data);
                } else {
                    setError("Buyurtma topilmadi");
                }
            })
            .catch((err) => {
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
                <Alert color="red" className="max-w-md">
                    {error}
                </Alert>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert color="amber" className="max-w-md">
                    Buyurtma topilmadi
                </Alert>
            </div>
        );
    }

    const client = order.customer || {};
    const product = order.product || {};
    const price = Number(order.price) || 0;
    const paidAmount = Number(order.tolangan) || 0;
    const remainingAmount = Number(order.qolgan) || 0;

    return (
        <div className="mx-auto px-4 py-8 space-y-6 mt-[90px]">
            {/* 👤 Mijoz kartasi */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-4">
                <Avatar
                    src={
                        client.photo ||
                        "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
                    }
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

            {/* 📦 Mahsulot kartasi */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img
                        src={
                            order.image
                                ? order.image.replace(
                                      "http://localhost",
                                      "https://nasiyapos.uz"
                                  )
                                : product.image
                                ? `https://nasiyapos.uz/${product.image}`
                                : "https://via.placeholder.com/150x150?text=No+Image"
                        }
                        alt={product.product_name || "Mahsulot"}
                        className="w-full md:w-64 h-64 object-cover rounded-xl"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://via.placeholder.com/150x150?text=No+Image";
                        }}
                    />

                    <div className="flex-1 space-y-2">
                        <Typography variant="h5">{product.product_name}</Typography>

                        <Typography variant="small" className="mt-2">
                            💰 Narxi:{" "}
                            <span className="font-semibold">
                                {price.toLocaleString()} so‘m
                            </span>
                        </Typography>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <Typography color="gray">Umumiy kredit</Typography>
                                <Typography>{price.toLocaleString()} so‘m</Typography>
                            </div>
                            <div>
                                <Typography color="gray">To‘langan</Typography>
                                <Typography>{paidAmount.toLocaleString()} so‘m</Typography>
                            </div>
                            <div>
                                <Typography color="gray">Qolgan</Typography>
                                <Typography className="text-red-500">
                                    {remainingAmount.toLocaleString()} so‘m
                                </Typography>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <Button
                                color="green"
                                onClick={() => setShowPaymentModal(true)}
                            >
                                💳 Shu oy uchun to‘lash
                            </Button>

                            <Button
                                color="red"
                                onClick={() => setShowDebtModal(true)}
                            >
                                📝 Qarz yozish
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                    To‘lov tarixi
                </Typography>
                <ul className="space-y-2">
                    {order.payments && order.payments.length > 0 ? (
                        order.payments.map((payment, index) => (
                            <li
                                key={index}
                                className="flex justify-between text-sm border-b pb-1"
                            >
                                <span>{payment.date || payment.month}</span>
                                <span>
                                    {payment.amount
                                        ? Number(payment.amount).toLocaleString()
                                        : "-"}{" "}
                                    so‘m
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">To‘lovlar tarixi yo‘q</li>
                    )}
                </ul>
            </Card>

            {/* 💳 To‘lov qo‘shish modal */}
            {showPaymentModal && (
                <OrderPaymentCreate
                    orderId={id}
                    onCreate={(newPayment) => {
                        setOrder((prev) => ({
                            ...prev,
                            payments: [...(prev.payments || []), newPayment],
                        }));
                        setShowPaymentModal(false);
                    }}
                    onCancel={() => setShowPaymentModal(false)}
                />
            )}

            {/* 📝 Qarz yozish modal */}
            {showDebtModal && (
                <OrderDabtors
                    orderId={id}
                    onCreate={(newDebt) => {
                        // yangi qarz qo‘shilganda orderni yangilash
                        setOrder((prev) => ({
                            ...prev,
                            debts: [...(prev.debts || []), newDebt],
                        }));
                        setShowDebtModal(false);
                    }}
                    onCancel={() => setShowDebtModal(false)}
                />
            )}
        </div>
    );
}
