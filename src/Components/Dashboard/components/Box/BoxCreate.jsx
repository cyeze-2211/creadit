import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function BoxCreate({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(""); 
  const [amount, setAmount] = useState(""); 
  const [installment, setInstallment] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
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
    if (!name || !image || !amount || !installment || !monthlyPayment) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('product_name', name.toString());
      formData.append('image', image.toString());
      formData.append('amount', Number(amount)); 
      formData.append('price', Number(price)); 
      formData.append('Installment', Number(installment));
      formData.append('monthly_payment', monthlyPayment.toString());

      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: 'Token topilmadi. Qayta login qiling.',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/products', formData, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      const newProduct = {
        id: response.data.data.id,
        name: response.data.data.product_name,
        image: response.data.data.image,
        price: parseFloat(response.data.data.price),
        amount: parseFloat(response.data.data.amount),
        months: parseInt(response.data.data.monthly_payment) || 12,
        monthly: parseFloat(response.data.data.Installment) || 0,
      };

      onCreate(newProduct);

 Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'success',
  title: 'Mahsulot muvaffaqiyatli qo‘shildi.',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

    } catch (error) {
      console.error('Mahsulot qo\'shishda xatolik:', error.response?.data || error);
     Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'error',
  title: 'Mahsulot qo‘shishda xatolik yuz berdi',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});
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
        className={`w-full max-w-md ${
          closing ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        <Card className="bg-white rounded-2xl shadow-2xl border border-gray-200">
          <CardBody>
            <Typography variant="h5" className="text-gray-900 font-bold mb-4">
              Yangi Mahsulot
            </Typography>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                label="Mahsulot nomi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Rasm URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Narxi"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Oylik tolov"
                type="number"
                value={installment}
                onChange={(e) => setInstallment(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Bo'lib to'lash oyi"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
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
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saqlanmoqda...
                    </>
                  ) : (
                    'Saqlash'
                  )}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
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