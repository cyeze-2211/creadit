import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function OrderDelete({ order, onDelete, onCancel }) {
  const [loading, setLoading] = useState(false);

  // Agar order bo'lmasa avtomatik yopish
  useEffect(() => {
    if (!order) {
      onCancel();
    }
  }, [order, onCancel]);

  const handleDelete = async () => {
    if (!order?.id) return;
    setLoading(true);
    try {
      await axios.delete(`/api/customers/${order.id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      onDelete(order.id); // ro'yxatdan o'chirish uchun
    } catch (error) {
      alert(error.response?.data?.message || "O'chirishda xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel} 
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} 
          >
            <Card className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200">
              <CardBody>
                <Typography variant="h6" className="text-gray-900 font-bold mb-4">
                  Mijozni o'chirish
                </Typography>
                <Typography className="mb-4 text-gray-800">
                  <span className="font-semibold">{order.name}</span> ({order.phone}) mijozini o‘chirishni tasdiqlaysizmi?
                </Typography>
                <div className="flex justify-end gap-2">
                  <Button variant="text" color="gray" onClick={onCancel} disabled={loading}>
                    Bekor qilish
                  </Button>
                  <Button color="red" onClick={handleDelete} disabled={loading}>
                    O'chirish
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
