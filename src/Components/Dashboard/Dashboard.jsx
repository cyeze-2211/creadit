import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

// MOCK statistikalar va chart data
const stats = [
  {
    label: "Foydalanuvchilar",
    value: 1240,
    icon: <Users className="w-7 h-7 text-blue-500" />,
    color: "bg-blue-100",
  },
  {
    label: "Buyurtmalar",
    value: 320,
    icon: <ShoppingCart className="w-7 h-7 text-green-500" />,
    color: "bg-green-100",
  },
  {
    label: "Daromad (UZS)",
    value: "45 200 000",
    icon: <DollarSign className="w-7 h-7 text-emerald-500" />,
    color: "bg-emerald-100",
  },
  {
    label: "O'sish (%)",
    value: "+12%",
    icon: <TrendingUp className="w-7 h-7 text-purple-500" />,
    color: "bg-purple-100",
  },
];

const lineData = [
  { name: "Yan", value: 120 },
  { name: "Fev", value: 150 },
  { name: "Mar", value: 170 },
  { name: "Apr", value: 140 },
  { name: "May", value: 200 },
  { name: "Iyun", value: 180 },
];

const barData = [
  { name: "Dushanba", orders: 40 },
  { name: "Seshanba", orders: 55 },
  { name: "Chorshanba", orders: 60 },
  { name: "Payshanba", orders: 48 },
  { name: "Juma", orders: 70 },
  { name: "Shanba", orders: 65 },
  { name: "Yakshanba", orders: 30 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br mt-[90px] ">
      {/* Statistik kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafiklar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Oylik buyurtmalar dinamikasi</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Haftalik buyurtmalar</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}