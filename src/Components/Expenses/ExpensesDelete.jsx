import React, { useRef, useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ExpensesDelete({ id,  onCancel }) {
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

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      showToast("success", "Xarajat o‘chirildi");
      setClosing(true);
    } catch (error) {
      showToast("error", error.response?.data?.message || "O‘chirishda xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 Animatsiyalar */}
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
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm 
        ${closing ? "animate-fade-out" : "animate-fade-in"}`}
      >
        <div
          ref={modalRef}
          className={`w-full max-w-sm ${closing ? "animate-modal-out" : "animate-modal-in"}`}
        >
          <Card className="bg-white rounded-2xl shadow-2xl border border-gray-200">
            <CardBody>
              <Typography variant="h6" className="text-gray-900 font-bold mb-4">
                Xarajatni o‘chirish
              </Typography>
              <Typography className="mb-4 text-gray-800">
                Ushbu xarajatni o‘chirmoqchimisiz?
              </Typography>
              <div className="flex justify-end gap-2">
                <Button
                  variant="text"
                  color="gray"
                  onClick={() => setClosing(true)}
                  disabled={loading}
                >
                  Bekor qilish
                </Button>
                <Button color="red" onClick={handleDelete} disabled={loading}>
                  {loading ? "O‘chirilmoqda..." : "O‘chirish"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
