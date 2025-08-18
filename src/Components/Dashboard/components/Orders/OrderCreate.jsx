import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import axios from "axios";

export default function OrderCreate({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [dataOfBirth, setDataOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const modalRef = useRef(null);

  // --- tashqariga bosilganda yopiladi ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setClosing(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- animatsiya tugagach onCancel ---
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onCancel();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [closing, onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !dataOfBirth || !address) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/customers",
        {
          name: name,
          phone: phone,
          data_of_birth: dataOfBirth,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        onCreate(response.data);
        setClosing(true); // saqlangandan keyin ham yopiladi
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40
        ${closing ? "animate-fade-out" : "animate-fade-in"}`}
      >
        <Card
          ref={modalRef}
          className={`w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200
          ${closing ? "animate-modal-out" : "animate-modal-in"}`}
        >
          <CardBody>
            <Typography variant="h5" className="text-gray-900 font-bold mb-4">
              Yangi Mijoz
            </Typography>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                label="Ismi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Telefon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Tug'ilgan sana"
                type="date"
                value={dataOfBirth}
                onChange={(e) => setDataOfBirth(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Manzil"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={loading}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="text"
                  color="gray"
                  onClick={() => setClosing(true)}
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
    </>
  );
}
