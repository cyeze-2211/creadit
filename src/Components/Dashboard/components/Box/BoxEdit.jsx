import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function BoxEdit({ product, onEdit, onCancel }) {
  const [name, setName] = useState(product.name || product.product_name);
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(product.price);
  const [months, setMonths] = useState(product.months || product.monthly_payment);
  const [monthly, setMonthly] = useState(product.monthly || product.Installment);
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Animatsiya tugagach modalni o‘chirish ---
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onCancel();
      }, 250); // animate-out davomiyligi
      return () => clearTimeout(timer);
    }
  }, [closing, onCancel]);

  // --- handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !months || !monthly) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("product_name", name);
      if (image) formData.append("image", image);
      formData.append("amount", Number(price));
      formData.append("price", Number(price));
      formData.append("monthly_payment", months.toString());
      formData.append("Installment", monthly.toString());

      const response = await axios.post(
        `/api/products/${product.id}?_method=PUT`,
        formData,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        onEdit({
          ...product,
          name,
          product_name: name,
          image: response.data.image ?? product.image,
          amount: Number(price),
          price: Number(price),
          months,
          monthly_payment: months,
          monthly,
          Installment: monthly,
        });
        setClosing(true); // saqlagandan keyin yopiladi
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Mahsulotni tahrirlashda xatolik",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      console.error("Xatolik:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- Animatsiya style --- */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modal-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-20px) scale(0.95); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-out { animation: fade-out 0.25s ease-in forwards; }
        .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
        .animate-modal-out { animation: modal-out 0.25s ease-in forwards; }
      `}</style>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center 
        bg-black/40 backdrop-blur-sm 
        ${closing ? "animate-fade-out" : "animate-fade-in"}`}
      >
        <div
          className={`w-full max-w-md 
          ${closing ? "animate-modal-out" : "animate-modal-in"}`}
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
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  disabled={loading}
                />

                <Input
                  label="Narxi (USD)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Bo'lib to'lash (oy)"
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Oylik to'lov (USD)"
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  required
                  disabled={loading}
                />

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="text"
                    color="gray"
                    type="button"
                    onClick={() => setClosing(true)} // yopish tugmasi
                    disabled={loading}
                  >
                    Bekor qilish
                  </Button>
                  <Button type="submit" color="green" disabled={loading}>
                    {loading ? "Saqlanmoqda..." : "Saqlash"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
