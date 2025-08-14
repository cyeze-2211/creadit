import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input
} from "@material-tailwind/react";
import axios from "axios";

export default function ExpensesCreate({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !date) {
      alert("Barcha maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/expenses",
        {
          name: name,
          price: Number(price),
          date: date
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json" // RAW bo‘lishi uchun
          }
        }
      );

      if (response.data) {
        onCreate(response.data);
      } else {
        alert("Xarajat qo'shilmadi");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onCancel} size="sm">
      <DialogHeader>Yangi xarajat qo'shish</DialogHeader>
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
            Qo'shish
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
