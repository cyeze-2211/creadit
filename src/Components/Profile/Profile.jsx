import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";

export default function Profile() {
  const [open, setOpen] = useState(false); // modal boshqaruv
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });

  // 🔹 Ma'lumotni serverdan olish
  useEffect(() => {
    axios
      .get(`/api/adminProfile`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data?.data) {
          const profile = res.data.data;
          setUser({
            firstName: profile.firstname || "",
            lastName: profile.lastname || "",
            phone: profile.phone || "",
            password: "",
          });
          localStorage.setItem("user", JSON.stringify(profile));
        }
      })
      .catch((err) => {
        console.error("Profilni olishda xatolik:", err.response?.data);
        Swal.fire("Xatolik", "Profilni olishda muammo ❌", "error");
      })
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        firstname: user.firstName,
        lastname: user.lastName,
        phone: user.phone,
        password: user.password || undefined,
      };

      const response = await axios.put(`/api/adminProfile`, payload, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data?.data));
      setOpen(false);

      Swal.fire({
        icon: "success",
        title: "Ma'lumotlar muvaffaqiyatli yangilandi ✅",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Xatolik:", error.response?.data);
      Swal.fire("Xatolik", "Saqlashda muammo ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center mt-[20px] justify-center">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl p-8 bg-white">
        <div className="flex flex-col items-center gap-4 mb-6">
          <UserCircleIcon className="w-24 h-24 text-blue-400" />
          <Typography variant="h4" className="text-blue-gray-800 font-bold">
            Profil Ma'lumotlari
          </Typography>
        </div>

        <CardBody className="flex flex-col gap-6">
          <div>
            <Typography className="mb-1 text-sm text-blue-gray-600">Ism</Typography>
            <Typography className="font-medium">{user.firstName}</Typography>
          </div>

          <div>
            <Typography className="mb-1 text-sm text-blue-gray-600">Familiya</Typography>
            <Typography className="font-medium">{user.lastName}</Typography>
          </div>

          <div>
            <Typography className="mb-1 text-sm text-blue-gray-600">Telefon</Typography>
            <Typography className="font-medium">{user.phone}</Typography>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              color="blue"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Tahrirlash
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 🔹 Modal */}
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Tahrirlash</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <Input
            label="Ism"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
          />
          <Input
            label="Familiya"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
          />
          <Input
            label="Telefon"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
          <Input
            type="password"
            label="Yangi Parol"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={loading}
            className="ml-2"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
