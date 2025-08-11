import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";

export default function BoxCreate({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [months, setMonths] = useState("");
  const [monthly, setMonthly] = useState("");
  const [closing, setClosing] = useState(false);
  const modalRef = useRef(null);

  // Modal tashqarisiga bosilganda yoki ESC bosilganda silliq yopiladi
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

  // Animatsiya tugaganda haqiqiy yopish
  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onCancel();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [closing, onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image || !price || !months || !monthly) return;
    onCreate({
      name,
      image,
      price: Number(price),
      months: Number(months),
      monthly: Number(monthly),
    });
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
                label="Nomi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Rasm URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              <Input
                label="Narxi (USD)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Input
                label="Bo'lib to'lash (oy)"
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                required
              />
              <Input
                label="Oylik to'lov (USD)"
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="text"
                  color="gray"
                  type="button"
                  onClick={() => setClosing(true)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" color="green">
                  Saqlash
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