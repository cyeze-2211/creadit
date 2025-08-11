import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function OrderEdit({ order, onEdit, onCancel }) {
  const [name, setName] = useState(order?.name || "");
  const [phone, setPhone] = useState(order?.phone || "");
  const [dataOfBirth, setDataOfBirth] = useState(order?.data_of_birth || "");
  const [address, setAddress] = useState(order?.address || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order) onCancel();
    else {
      setName(order.name || "");
      setPhone(order.phone || "");
      setDataOfBirth(order.data_of_birth || "");
      setAddress(order.address || "");
    }
  }, [order, onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order?.id) return;
    setLoading(true);
    try {
      const response = await axios.put(`/api/customers/${order.id}`, {
        name,
        phone,
        data_of_birth: dataOfBirth,
        address,
      }, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (response.data) {
        onEdit(response.data.data); // yangilangan ma’lumotni uzatish
      }
    } catch (error) {
      alert(error.response?.data?.message || "Xatolik yuz berdi");
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
            <Card className="w-[500px] bg-white rounded-2xl shadow-xl border border-gray-200">
              <CardBody>
                <Typography variant="h5" className="text-gray-900 font-bold mb-4">
                  Mijozni tahrirlash
                </Typography>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <Input label="Ismi" value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
                  <Input label="Telefon" value={phone} onChange={e => setPhone(e.target.value)} required disabled={loading} />
                  <Input label="Tug'ilgan sana" type="date" value={dataOfBirth} onChange={e => setDataOfBirth(e.target.value)} required disabled={loading} />
                  <Input label="Manzil" value={address} onChange={e => setAddress(e.target.value)} required disabled={loading} />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="text" color="gray" onClick={onCancel} disabled={loading}>Bekor qilish</Button>
                    <Button type="submit" color="green" disabled={loading}>Saqlash</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
