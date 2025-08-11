import {
    Card,
    CardBody,
    Typography,
    Avatar,
    Spinner,
    Alert,
} from "@material-tailwind/react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ClientDetail() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("ID topilmadi");
            setLoading(false);
            return;
        }
        axios.get(`api/profile/${id}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                if (res.data?.data) {
                    setClient(res.data.data);
                } else {
                    setError("Mijoz topilmadi");
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "Xatolik yuz berdi");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // const deals = [
    //     {
    //         title: "Samsung Galaxy smartfoni",
    //         image: "https://cdn.asaxiy.uz/asaxiy-content/product/items/desktop/82bc0c2caf19f994a74a9cd139aa23ff2025012414253450747o8Q7DhAPRD.webp",
    //         price: "3 200 000 so'm",
    //         date: "15.06.2025",
    //     },
    //     {
    //         title: "LG 43” Smart televizori",
    //         image: "https://cdn.mediapark.uz/imgs/600x600_3dcb5c04-ae6a-4b8a-b29c-871ec7eaab63_TV11300.webp",
    //         price: "5 500 000 so'm",
    //         date: "03.05.2025",
    //     },
    // ];

    const defaultProductImage = "https://via.placeholder.com/150?text=Mahsulot";

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

    if (!client) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert color="amber" className="max-w-md">Mijoz topilmadi</Alert>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6 mt-[90px]">
            <Card className="flex flex-col md:flex-row items-center gap-6 p-4">
                <Avatar
                    src={client.photo || "https://i.ibb.co/fY2Ypyk/default-user.png"}
                    alt="Mijoz rasmi"
                    size="xxl"
                    className="rounded-lg"
                />
                <CardBody className="w-full">
                    <Typography variant="h5" color="blue-gray" className="mb-2">
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

            <div className="space-y-4">
                <Typography variant="h6" color="blue-gray">
                    Kredit asosida olingan mahsulotlar
                </Typography>
                {(!client.used_credits || client.used_credits.length === 0) ? (
                    <Alert color="amber" className="max-w-md">Kredit yo'q</Alert>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {client.used_credits.map((credit, index) => (
                            <NavLink to={`/order/detail/${credit.id}`} key={index}>
                                <Card className="p-4 flex gap-4 items-center">
                                    <img
                                        src={credit.product?.image || "https://via.placeholder.com/150?text=Mahsulot"}
                                        alt={credit.product?.product_name || "Mahsulot"}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div>
                                        <Typography variant="h6">{credit.product?.product_name || "Mahsulot"}</Typography>
                                        <Typography variant="small" color="gray">
                                            💰 Narxi: {credit.price ? Number(credit.price).toLocaleString() + " so'm" : "-"}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                            📅 Sana: {credit.created_at ? credit.created_at.slice(0, 10) : "-"}
                                        </Typography>
                                    </div>
                                </Card>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
