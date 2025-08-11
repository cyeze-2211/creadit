import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";
export default function BoxEdit({ product, onEdit, onCancel }) {
  const [name, setName] = useState(product.name || product.product_name);
  const [image, setImage] = useState(product.image);
  const [price, setPrice] = useState(product.price);
  const [months, setMonths] = useState(product.months || product.monthly_payment);
  const [monthly, setMonthly] = useState(product.monthly || product.Installment);
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setClosing(true);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setClosing(true);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onCancel();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [closing, onCancel]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!name || !image || !price || !months || !monthly) return;

  setLoading(true);

  try {
    const updateData = {
      product_name: name,
      image: image, 
      amount: Number(price),
      price: Number(price), 
      monthly_payment: months.toString(), 
      Installment: monthly.toString()
    };

    const response = await axios.put(`/api/products/${product.id}`, updateData, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      onEdit({
        ...product,
        name: name,
        product_name: name,
        image: image,
        amount: Number(price),
        price: Number(price),
        months: months,
        monthly_payment: months,
        monthly: monthly,
        Installment: monthly
      });
    }

    

  } catch (error) {
   Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'error',
  title: 'Mahsulot qo‘shishda xatolik yuz berdi',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});
    if (error.response) {
      console.error('Server xatosi:', error.response.data);
      alert(`Xatolik: ${error.response.data.message || 'Server xatosi'}`);
    } else if (error.request) {
      console.error('Tarmoq xatosi:', error.request);
      alert('Tarmoq xatosi: Servergacha yetib bormadi');
    } else {
      console.error('Xatolik:', error.message);
      alert('Noma\'lum xatolik yuz berdi');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md ${closing ? "animate-modal-out" : "animate-modal-in"}`}
      >
        <Card className="bg-white rounded-2xl shadow-2xl border border-gray-200">
          <CardBody>
            <Typography variant="h5" className="text-gray-900 font-bold mb-4">
              Mahsulotni tahrirlash
            </Typography>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                label="Nomi"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Rasm URL"
                value={image}
                onChange={e => setImage(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Narxi (USD)"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Bo'lib to'lash (oy)"
                type="number"
                value={months}
                onChange={e => setMonths(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Oylik to'lov (USD)"
                type="number"
                value={monthly}
                onChange={e => setMonthly(e.target.value)}
                required
                disabled={loading}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="text"
                  color="gray"
                  type="button"
                  onClick={() => setClosing(true)}
                  disabled={loading}
                >
                  Bekor qilish
                </Button>
                <Button 
                  type="submit" 
                  color="green"
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
      {/* Animatsiya uchun style */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeInBg 0.3s ease;
        }
        .animate-fade-out {
          animation: fadeOutBg 0.25s ease forwards;
        }
        @keyframes fadeInBg {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOutBg {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-modal-in {
          animation: modalIn 0.3s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-modal-out {
          animation: modalOut 0.25s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        @keyframes modalOut {
          from { opacity: 1; transform: scale(1);}
          to { opacity: 0; transform: scale(0.95);}
        }
        `}
      </style>
    </div>
  );
}