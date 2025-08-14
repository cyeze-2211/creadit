import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Calendar, DollarSign, Users, Filter } from 'lucide-react';

export default function Benefit() {
  const [paymentsData, setPaymentsData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const firstRun = useRef(true);

  // === Utilities ===
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const lastDayFormatted = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    return { firstDay, lastDayFormatted };
  };

  const toISODate = (d) => {
    // timezone ta'sirini oldini olamiz
    const dt = new Date(d);
    const tzSafe = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
    return tzSafe.toISOString().slice(0, 10);
  };

  // Kunlar oralig'ini to'liq (0-lar bilan) to'ldirish
  const fillMissingDates = (dailyData, start, end) => {
    const byDate = new Map(dailyData.map(d => [d.date, Number(d.amount) || 0]));
    const result = [];
    let current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      const dateStr = toISODate(current);
      result.push({
        date: dateStr,
        amount: byDate.has(dateStr) ? byDate.get(dateStr) : 0,
      });
      current.setDate(current.getDate() + 1);
    }
    return result;
  };

  // Backend javobni normalize qilish:
  // - Variant A: { data: [{date, amount}, ...] }
  // - Variant B: { daily_totals: { 'YYYY-MM-DD': number, ... }, total_sum, total_count }
  const normalizeApiResponse = (payload) => {
    // A)
    if (Array.isArray(payload?.data)) {
      const arr = payload.data.map(it => ({
        date: toISODate(it.date),
        amount: Number(it.amount) || 0,
      }));
      return {
        daily: arr,
        total_sum: arr.reduce((s, i) => s + i.amount, 0),
        total_count: arr.filter(i => i.amount > 0).length,
      };
    }
    // B)
    if (payload?.daily_totals && typeof payload.daily_totals === 'object') {
      const arr = Object.entries(payload.daily_totals).map(([date, amount]) => ({
        date: toISODate(date),
        amount: Number(amount) || 0,
      }));
      return {
        daily: arr,
        total_sum: Number(payload.total_sum) || arr.reduce((s, i) => s + i.amount, 0),
        total_count: Number(payload.total_count) || arr.filter(i => i.amount > 0).length,
      };
    }
    // Fallback: bo'sh
    return { daily: [], total_sum: 0, total_count: 0 };
  };

  // === API ===
  const fetchPaymentsData = async (start = null, end = null) => {
    setLoading(true);
    try {
      let startParam = start || startDate;
      let endParam = end || endDate;

      // Agar kiritilmagan bo'lsa, joriy oy
      if (!startParam || !endParam) {
        const { firstDay, lastDayFormatted } = getCurrentMonth();
        startParam = firstDay;
        endParam = lastDayFormatted;
        setStartDate(firstDay);
        setEndDate(lastDayFormatted);
      }

      const res = await axios.get(`/api/payments?from=${startParam}&to=${endParam}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      const normalized = normalizeApiResponse(res.data || {});
      const filledDaily = fillMissingDates(normalized.daily, startParam, endParam);

      const total = normalized.total_sum ?? filledDaily.reduce((s, i) => s + i.amount, 0);
      const count = normalized.total_count ?? filledDaily.filter(i => i.amount > 0).length;

      setPaymentsData({
        total_payments: `${Number(total).toLocaleString()} UZS`,
        count,
        start_date: startParam,
        end_date: endParam,
        daily: filledDaily,
      });
    } catch (error) {
      console.error('API xatosi:', error);
      setPaymentsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Mount -> joriy oyga qo'yamiz (fetchni ikkinchi effect qiladi)
  useEffect(() => {
    const { firstDay, lastDayFormatted } = getCurrentMonth();
    setStartDate(firstDay);
    setEndDate(lastDayFormatted);
  }, []);

  // startDate/endDate o'zgarsa fetch
  useEffect(() => {
    if (!startDate || !endDate) return;
    if (firstRun.current) {
      firstRun.current = false;
    }
    fetchPaymentsData(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Chart data
  const chartData = (paymentsData?.daily || []).map(item => {
    const d = new Date(item.date);
    return {
      date: d.getDate(), // XAxis uchun 1..31
      amount: item.amount,
      fullDate: item.date,
      formattedDate: d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' }),
    };
  });

  const setCurrentMonth = () => {
    const { firstDay, lastDayFormatted } = getCurrentMonth();
    setStartDate(firstDay);
    setEndDate(lastDayFormatted);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-gray-300 p-3 shadow-lg rounded-lg">
          <p className="text-gray-800 font-medium">{`Sana: ${data.formattedDate}`}</p>
          <p className="text-gray-600">{`Summa: ${Number(payload[0].value || 0).toLocaleString()} UZS`}</p>
        </div>
      );
    }
    return null;
  };

  const calculateTotalFromDaily = () => {
    if (!paymentsData?.daily) return 0;
    return paymentsData.daily.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  return (
    <div className="min-h-screen mt-[90px]">
      <div className="max-w-7xl mx-auto">
        {/* Sarlavha */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">To'lovlar Tahlili</h1>
          <p className="text-gray-600 text-lg">Moliyaviy tushumlarni monitoring qilish</p>
        </div>

        {/* Sanalar boshqaruv paneli */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Davr:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Dan:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Gacha:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={setCurrentMonth}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Filter className="w-4 h-4" />
              Joriy oy
            </button>
            <button
              onClick={() => fetchPaymentsData()}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Yuklanmoqda...' : 'Yangilash'}
            </button>
          </div>
        </div>

        {/* Statistik kartalar */}
        {paymentsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Umumiy summa</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {calculateTotalFromDaily().toLocaleString()} UZS
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <DollarSign className="w-8 h-8 text-gray-700" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">To'lovlar soni</p>
                  <p className="text-3xl font-bold text-gray-900">{paymentsData.count}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chiziqli grafik */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">To'lovlar dinamikasi</h2>
            <p className="text-gray-600">Kunlik tushumlar statistikasi</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-600"></div>
              <span className="ml-3 text-gray-600">Ma'lumotlar yuklanmoqda...</span>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#374151"
                    strokeWidth={3}
                    dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#374151', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Ustunli grafik */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kunlar bo'yicha tafsilot</h2>
            <p className="text-gray-600">To'lovlarning ustunli diagrammasi</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-600"></div>
              <span className="ml-3 text-gray-600">Ma'lumotlar yuklanmoqda...</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="amount"
                    fill="#374151"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Ma'lumotlar haqida */}
        {paymentsData && (
          <div className="bg-white rounded-xl mt-[30px] shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Davr haqida ma'lumot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Boshlanish sanasi:</span> {new Date(paymentsData.start_date).toLocaleDateString('uz-UZ')}
              </div>
              <div>
                <span className="font-medium">Tugash sanasi:</span> {new Date(paymentsData.end_date).toLocaleDateString('uz-UZ')}
              </div>
              <div>
                <span className="font-medium">Jami kunlar:</span> {chartData.length} kun
              </div>
              <div>
                <span className="font-medium">To'lov bo'lgan kunlar:</span> {chartData.filter(item => item.amount > 0).length} kun
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
