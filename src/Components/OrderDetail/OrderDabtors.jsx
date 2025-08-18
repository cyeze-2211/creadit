import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input,
  Spinner
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function OrderDabtors({ orderId, onCreate, onCancel }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000
    });
  };

  useEffect(() => {
    if (!orderId) return;
    axios
      .get(`/api/cridets/${orderId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json"
        }
      })
      .then((res) => {
        if (res.data?.data) {
          setOrderData(res.data.data);
        } else {
          toast("error", "Buyurtma ma'lumoti topilmadi");
          onCancel();
        }
      })
      .catch((err) => {
        toast("error", err.response?.data?.message || "Ma'lumot olishda xatolik");
        console.error(err);
        onCancel();
      })
      .finally(() => setFetching(false));
  }, [orderId, onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date) {
      toast("warning", "Barcha maydonlarni to‘ldiring");
      return;
    }
    if (!orderData) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `/api/qarz-yozish`, // 🔥 endi qarz yozish API ga
        {
          customer_id: orderData.customer?.id,
          product_id: orderData.product?.id,
          umumiy_kredit: orderData.price,
          qarz_summa: String(amount), // qarz miqdori
          sana: date,
          status: "qarzdor" // default holatda qarzdor
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data) {
        toast("success", "Qarz muvaffaqiyatli yozildi");
        onCreate(res.data);
      } else {
        toast("error", "Qarz yozilmadi");
      }
    } catch (err) {
      toast("error", err.response?.data?.message || "Xatolik yuz berdi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Dialog open={true} handler={onCancel} size="sm">
        <div className="flex items-center justify-center p-6">
          <Spinner className="h-10 w-10" />
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} handler={onCancel} size="sm">
      <DialogHeader>Qarz yozish</DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogBody className="flex flex-col gap-4">
          <Input
            label="Qarz summasi"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={loading}
            crossOrigin={undefined}
          />
          <Input
            label="Qarz sanasi"
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
            disabled={loading}
            className="mr-2"
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
