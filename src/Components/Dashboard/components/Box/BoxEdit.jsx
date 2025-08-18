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
  const modalRef = useRef(null);

  // --- Bekor qilish uchun animatsiya tugagach onCancel ---
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onCancel();
      }, 300); // animatsiya tugashi uchun 300ms
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

      const response = await axios.post(`/api/products/${product.id}?_method=PUT`, formData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

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
        setClosing(true); // saqlagandan keyin ham modal yopiladi
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md transform transition-transform duration-300 ${
          closing ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
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
  );
}
