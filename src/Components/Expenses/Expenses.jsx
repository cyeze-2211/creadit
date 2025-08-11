import React, { useState, useMemo } from "react";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

// 🔹 Примерные данные
const initialExpenses = [
    {
        id: 1,
        name: "Ofis ijarasi",
        description: "Toshkentdagi ofis uchun oylik ijara",
        price: 500,
        date: "2025-06-05",
    },
    {
        id: 2,
        name: "Internet to‘lovi",
        description: "1 oylik internet narxi",
        price: 50,
        date: "2025-06-10",
    },
    {
        id: 3,
        name: "Texnika xaridi",
        description: "Printer va planshetlar",
        price: 300,
        date: "2025-05-20",
    },
];

// 📅 Текущий месяц
const today = dayjs();
const defaultStart = today.startOf("month").format("YYYY-MM-DD");
const defaultEnd = today.endOf("month").format("YYYY-MM-DD");

export default function Expenses() {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    const filteredExpenses = useMemo(() => {
        return expenses.filter((e) => e.date >= startDate && e.date <= endDate);
    }, [expenses, startDate, endDate]);

    const total = filteredExpenses.reduce((sum, item) => sum + item.price, 0);

    const handleDelete = (id) => {
        const confirm = window.confirm("Rostdan ham o‘chirmoqchimisiz?");
        if (confirm) {
            setExpenses((prev) => prev.filter((e) => e.id !== id));
        }
    };

    const handleUpdate = (expense) => {
        alert(`Tahrirlash: ${expense.name} (funksiya hali mavjud emas)`);
    };

    return (
        <div className="mt-[90px] pb-10 ">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h3" className="font-bold text-gray-800">
                    Xarajatlar
                </Typography>
                <Button color="green">+ Xarajat yaratish</Button>
            </div>

            {/* Фильтр */}
            <Card className="mb-8 p-4 border border-gray-200 shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                        label="Boshlanish sanasi"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        crossOrigin={undefined}
                    />
                    <Input
                        label="Tugash sanasi"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        crossOrigin={undefined}
                    />
                    <Button color="green">Filter</Button>
                </div>
            </Card>
            <div className="flex flex-col gap-6">
                {filteredExpenses.length === 0 ? (
                    <Card className="p-6 bg-gray-50 border text-center text-gray-500">
                        Xarajatlar topilmadi
                    </Card>
                ) : (
                    filteredExpenses.map((expense) => (
                        <Card
                            key={expense.id}
                            className="w-full shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                            <CardBody className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Typography variant="h6" className="text-gray-800">
                                            {expense.name}
                                        </Typography>
                                        <Typography className="text-gray-600 text-sm">
                                            {expense.description}
                                        </Typography>
                                        <Typography className="text-gray-400 text-xs mt-1">
                                            Sana: {dayjs(expense.date).format("YYYY-MM-DD")}
                                        </Typography>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Typography className="text-red-600 font-bold text-lg">
                                            ${expense.price}
                                        </Typography>
                                        <div className="flex gap-2">
                                            <IconButton
                                                variant="text"
                                                color="blue"
                                                onClick={() => handleUpdate(expense)}
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </IconButton>
                                            <IconButton
                                                variant="text"
                                                color="red"
                                                onClick={() => handleDelete(expense.id)}
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
