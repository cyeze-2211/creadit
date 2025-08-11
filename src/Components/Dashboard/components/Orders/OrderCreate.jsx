import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import axios from "axios";

export default function OrderCreate({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [dataOfBirth, setDataOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !dataOfBirth || !address) return;

    setLoading(true);

    try {
      const response = await axios.post('/api/customers', {
        name: name,
        phone: phone,
        data_of_birth: dataOfBirth,
        address: address
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (response.data) {
        onCreate(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card ref={modalRef} className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200">
        <CardBody>
          <Typography variant="h5" className="text-gray-900 font-bold mb-4">
            Yangi Mijoz
          </Typography>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="Ismi"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              label="Telefon"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              label="Tug'ilgan sana"
              type="date"
              value={dataOfBirth}
              onChange={e => setDataOfBirth(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              label="Manzil"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              disabled={loading}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="text" color="gray" onClick={onCancel} disabled={loading}>Bekor qilish</Button>
              <Button type="submit" color="green" disabled={loading}>Saqlash</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}