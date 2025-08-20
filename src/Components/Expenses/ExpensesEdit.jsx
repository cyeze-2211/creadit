import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ExpensesEdit({ id,  onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔔 Toast funksiyasi
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

  // 🔄 Formani submit qilish
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !date) {
      showToast("warning", "Barcha maydonlarni to‘ldiring");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `/api/expenses/${id}`,
        {
          name: name,
          price: Number(price),
          date: date,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedExpense = {
          id,
          name,
          price: Number(price),
          date,
        };

        onCancel(); 
        showToast("success", "Xarajat muvaffaqiyatli yangilandi");
      } else {
        showToast("error", "Xarajat yangilanmadi");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onCancel} size="sm">
      <DialogHeader>Xarajatni tahrirlash</DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogBody className="flex flex-col gap-4">
          <Input
            label="Xarajat nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            crossOrigin={undefined}
          />
          <Input
            label="Narx"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={loading}
            crossOrigin={undefined}
          />
          <Input
            label="Sana"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={loading}
            crossOrigin={undefined}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={onCancel}
            className="mr-2"
            disabled={loading}
          >
            Bekor qilish
          </Button>
          <Button color="green" type="submit" disabled={loading}>
            Saqlash
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
