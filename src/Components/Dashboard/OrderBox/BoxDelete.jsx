import React, { useRef, useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

export default function BoxDelete({ product, onDelete, onCancel }) {
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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-sm ${closing ? "animate-modal-out" : "animate-modal-in"}`}
      >
        <Card className="bg-white rounded-2xl shadow-2xl border border-gray-200">
          <CardBody>
            <Typography variant="h6" className="text-gray-900 font-bold mb-4">
              Mahsulotni o'chirish
            </Typography>
            <Typography className="mb-4 text-gray-800">
              <span className="font-semibold">{product.name}</span> mahsulotini o‘chirishni tasdiqlaysizmi?
            </Typography>
            <div className="flex justify-end gap-2">
              <Button
                variant="text"
                color="gray"
                onClick={() => setClosing(true)}
              >
                Bekor qilish
              </Button>
              <Button
                color="red"
                onClick={() => onDelete(product.id)}
              >
                O'chirish
              </Button>
            </div>
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