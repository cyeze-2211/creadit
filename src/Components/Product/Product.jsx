import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Alert
} from "@material-tailwind/react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!id) {
      setError("Mahsulot ID topilmadi");
      setLoading(false);
      return;
    }

    axios.get(`/api/products/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (res.data?.data) {
          setProduct(res.data.data);
        } else {
          setError("Mahsulot topilmadi");
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 404) {
            setError("Mahsulot topilmadi");
          } else if (err.response.status === 401) {
            setError("Avtorizatsiyadan o‘tish kerak");
            setTimeout(() => navigate('/login'), 2000);
          } else {
            setError(err.response.data?.message || `Server xatosi (${err.response.status})`);
          }
        } else if (err.request) {
          setError("Serverga ulanib bo‘lmadi");
        } else {
          setError("Noma'lum xatolik yuz berdi");
        }
        console.error("API xatosi:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Alert color="red" className="max-w-md">
          <Typography variant="h5" className="mb-2">
            Xatolik!
          </Typography>
          <Typography className="mb-4">{error}</Typography>
          <Button color="blue" onClick={() => navigate('/')}>
            Bosh sahifaga qaytish
          </Button>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert color="amber" className="max-w-md">
          <Typography variant="h5" className="mb-2">
            Diqqat!
          </Typography>
          <Typography>So'ralgan mahsulot topilmadi</Typography>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-1/2 bg-gray-100 p-8 flex items-center justify-center">
              <img
                src={product.image || 'https://via.placeholder.com/600x400?text=Rasm+Mavjud+Emas'}
                alt={product.product_name}
                className="max-h-[500px] w-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Rasm+Yuklanmadi';
                }}
              />
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-8">
              <CardBody className="space-y-4">
                <Typography variant="h2" className="font-bold">
                  {product.product_name}
                </Typography>

                <div className="space-y-6">
                  <Typography variant="h3" color="green">
                    ${product.price}
                  </Typography>

                  <div className="space-y-2">
                    <Typography className="flex justify-between">
                      <span className="text-gray-600">Bo'lib to'lash:</span>
                      <span className="font-medium">{product.Installment}</span>
                    </Typography>
                    <Typography className="flex justify-between">
                      <span className="text-gray-600">Muddat:</span>
                      <span className="font-medium">{product.monthly_payment}</span>
                    </Typography>
                    {product.created_at && (
                      <Typography className="flex justify-between">
                        <span className="text-gray-600">Qo'shilgan sana:</span>
                        <span className="font-medium">
                          {new Date(product.created_at).toLocaleDateString()}
                        </span>
                      </Typography>
                    )}
                  </div>
                </div>
              </CardBody>

              <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
              <NavLink to={`/sell/${product.id}`} className="w-full">
  <Button color="blue" size="lg" fullWidth>
    SOTISH
  </Button>
</NavLink>
                <NavLink to={`/sell/credit/${product.id}`} className="w-full">
                  <Button color="green" size="lg" fullWidth>
                    Credit asosida 
                  </Button>
                </NavLink>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}