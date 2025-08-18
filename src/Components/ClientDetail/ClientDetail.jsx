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

// Helper function to handle images
const getImageUrl = (url) => {
    if (!url) return "/no-image.png"; // fallback
    if (url.startsWith("http://localhost")) return url.replace("http://localhost", "https://nasiyapos.uz");
    if (!url.startsWith("http")) return `https://nasiyapos.uz/${url}`; // products/... uchun ishlaydi
    return url;
};


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
            if (res.data?.data) setClient(res.data.data);
            else setError("Mijoz topilmadi");
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

    if (!client) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert color="amber" className="max-w-md">Mijoz topilmadi</Alert>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6 mt-[90px] mb-[40px]">
            {/* Mijoz ma'lumotlari */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-4">
                <Avatar
                    src={`https://as1.ftcdn.net/jpg/01/65/63/94/1000_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg`}
                    alt="Mijoz rasmi"
                    size="xxl"
                    className="rounded-lg"
                    onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                />
                <CardBody className="w-full">
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        {client.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">📞 Telefon: {client.phone}</Typography>
                    <Typography variant="small" className="text-gray-600">📍 Manzil: {client.address}</Typography>
                </CardBody>
            </Card>

            {/* Kredit asosida olingan mahsulotlar */}
            <div className="space-y-4">
                <Typography variant="h6" color="blue-gray">Kredit asosida olingan mahsulotlar</Typography>
                {(!client.used_credits || client.used_credits.length === 0) ? (
                    <Alert color="amber" className="max-w-md">Kredit yo'q</Alert>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {client.used_credits.map((credit) => (
                            <NavLink to={`/order/detail/${credit.id}`} key={credit.id}>
                                <Card className="p-4 flex gap-4 items-center">
                                    <img
    src={getImageUrl(credit.image)}
    alt={credit.product?.product_name || "Mahsulot"}
    className="w-[50%] h-44 object-cover rounded-md"
    onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
/>

                                    <div>
                                        <Typography variant="h6">{credit.product?.product_name || "Mahsulot"}</Typography>
                                        <Typography variant="small" color="gray">
                                            💰 Narxi: {credit.price ? Number(credit.price).toLocaleString() + " so'm" : "-"}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                            📅 Sana: {credit.created_at ? credit.created_at.slice(0, 10) : "-"}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                            🏦 Boshlang'ich to'lov: {credit.initial_payment ? Number(credit.initial_payment).toLocaleString() + " so'm" : "-"}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                            🔄 Oylik to'lov: {credit.monthly_payment ? Number(credit.monthly_payment).toLocaleString() + " so'm" : "-"}
                                        </Typography>
                                    </div>
                                </Card>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>

            {/* Sotilgan mahsulotlar */}
            <div className="space-y-4">
                <Typography variant="h6" color="blue-gray">Sotilgan mahsulotlar</Typography>
                {(!client.sold_products || client.sold_products.length === 0) ? (
                    <Alert color="amber" className="max-w-md">Sotilgan mahsulot yo'q</Alert>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {client.sold_products.map((sold) => (
                            <NavLink to={`/shop/detail/${sold.id}`} key={sold.id}>
                                <Card className="p-4 flex gap-4 items-center">
                                    <img
                                        src={getImageUrl(sold.product?.image)}
                                        alt={sold.product?.product_name || "Mahsulot"}
                                        className="w-[50%] h-44 object-cover rounded-md"
                                        onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                                    />
                                    <div>
                                        <Typography variant="h6">{sold.product?.product_name || "Mahsulot"}</Typography>
                                        <Typography variant="small" color="gray">
                                            💰 Narxi: {sold.price ? Number(sold.price).toLocaleString() + " so'm" : "-"}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                            📅 Sana: {sold.created_at ? sold.created_at.slice(0, 10) : "-"}
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
