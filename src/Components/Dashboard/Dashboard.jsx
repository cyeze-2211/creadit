import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  useEffect(() => {
    axios
      .get(`/api/dashboard?year=2025`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        const data = res.data;

        // Statistikalar
        setStats([
          {
            label: "Foydalanuvchilar",
            value: data.users_count || 0,
            icon: <Users className="w-7 h-7 text-blue-500" />,
            color: "bg-blue-100",
          },
          {
            label: "Buyurtmalar",
            value: data.orders_count || 0,
            icon: <ShoppingCart className="w-7 h-7 text-green-500" />,
            color: "bg-green-100",
          },
          {
            label: "Daromad (UZS)",
            value: data.total_revenue?.toLocaleString("uz-UZ") || 0,
            icon: <DollarSign className="w-7 h-7 text-emerald-500" />,
            color: "bg-emerald-100",
          },
          {
            label: "O'sish (%)",
            value: `${data.growth_percent || 0}%`,
            icon: <TrendingUp className="w-7 h-7 text-purple-500" />,
            color: "bg-purple-100",
          },
        ]);

        // Oylik buyurtmalarni mos formatga keltirish
        setLineData(
          (data.monthly_orders || []).map((item) => ({
            name: item.month,
            value: item.orders,
          }))
        );
      })
      .catch((err) => {
        toast(
          "error",
          err.response?.data?.message || "Ma'lumot olishda xatolik"
        );
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen mt-[90px] mb-[20px] px-4">
        <div className="flex justify-center items-center h-64">
          <ReactLoading type="spin" color="#4CAF50" height={100} width={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-[90px]">
      {/* Statistik kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Faqat bitta katta LineChart */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Oylik buyurtmalar dinamikasi
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5, fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
