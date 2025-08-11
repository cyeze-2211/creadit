import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
    Card,
    CardBody,
    Typography,
    Select,
    Option,
    Input,
    Button,
    Spinner,
    Alert,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Sell() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            axios.get(`/api/products/${id}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            }),
            axios.get('/api/customers', {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            })
        ])
            .then(([productRes, clientsRes]) => {
                setProduct(productRes.data?.data || null);
                setClients(clientsRes.data?.data || []);
            })
            .catch(err => {
                setError("Ma'lumotlarni yuklashda xatolik");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const formatPrice = (value) => {
        const onlyNumbers = value.replace(/\D/g, "");
        return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handlePriceChange = (e) => {
        const formatted = formatPrice(e.target.value);
        setSellPrice(formatted);
    };

    const handleSell = async () => {
        if (!selectedClient || !sellPrice || !product?.id) {
            alert("Iltimos, barcha maydonlarni to‘ldiring.");
            return;
        }
        setPosting(true);
        try {
            const numericPrice = parseInt(sellPrice.replace(/\s/g, ""));
            const response = await axios.post('/api/sells', {
                product_id: product.id,
                customer_id: Number(selectedClient),
                price: numericPrice
            }, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'success',
  title: 'Mahsulot muvaffaqiyatli qo‘shildi.',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});
            setSellPrice("");
            setSelectedClient("");
        } catch (error) {
            alert(error.response?.data?.message || "Sotishda xatolik yuz berdi");
        } finally {
            setPosting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Alert color="red" className="max-w-md">{error || "Mahsulot topilmadi"}</Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-[80px] bg-gray-50 flex flex-col gap-3 items-center px-4 py-6">
            {/* Mahsulot haqida */}
            <Card className="w-full max-w-2xl shadow-lg rounded-xl p-6">
                <div className="flex items-center gap-4 text-left">
                    <img
                        src={product.image}
                        alt={product.product_name}
                        className="w-40 h-40 object-contain rounded-full shadow-md"
                    />
                    <div>
                        <Typography variant="h5" color="blue-gray" className="font-bold">
                            {product.product_name}
                        </Typography>
                        <Typography variant="h6" color="green" className="font-semibold">
                            {product.price ? Number(product.price).toLocaleString() + " so'm" : "-"}
                        </Typography>
                        <Typography className="text-gray-700 text-sm max-w-md">
                            {product.description}
                        </Typography>
                    </div>
                </div>
            </Card>

            {/* Savdo formasi */}
            <Card className="w-full max-w-2xl shadow-lg rounded-xl p-6">
                <div className="flex flex-col gap-6 mb-6">
                    <div>
                        <Typography className="mb-2 font-medium text-blue-gray-700">
                            Mijozni tanlang
                        </Typography>
                        <Select
                            label="Mijoz"
                            value={selectedClient}
                            onChange={val => setSelectedClient(val)}
                            required
                            disabled={posting}
                        >
                            {clients.map((client) => (
                                <Option key={client.id} value={String(client.id)}>
                                    {client.name} {client.phone && `(${client.phone})`}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Typography className="mb-2 font-medium text-blue-gray-700">
                            Sotuv narxi
                        </Typography>
                        <Input
                            label="Masalan: 3 500 000"
                            type="text"
                            value={sellPrice}
                            onChange={handlePriceChange}
                            required
                            disabled={posting}
                        />
                    </div>
                </div>
                <Button fullWidth color="blue" size="lg" onClick={handleSell} disabled={posting}>
                    Mahsulotni sotish
                </Button>
            </Card>
        </div>
    );
}
