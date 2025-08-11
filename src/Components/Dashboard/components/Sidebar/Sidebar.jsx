import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { Card, Typography } from "@material-tailwind/react";

export default function Sidebar() {
    const [role] = useState("admin");
    const location = useLocation();

    // Группировка по разделам
    const groupedMenuItems = [
        {
            section: "Asosiy",
            items: [
                {
                    id: 1,
                    title: "Bosh sahifa",
                    path: "/dashboard",
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 9.75L12 3l9 6.75M4.5 10.5v9.75h5.25V15h4.5v5.25H19.5V10.5" />
                        </svg>
                    )
                },
                {
                    id: 4,
                    title: "Tovarlar",
                    path: "/box",
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M20.25 7.5v9a2.25 2.25 0 01-2.25 2.25h-12A2.25 2.25 0 013.75 16.5v-9A2.25 2.25 0 016 5.25h12A2.25 2.25 0 0120.25 7.5z" />
                        </svg>
                    )
                },
                {
                    id: 2,
                    title: "Mijozlar",
                    path: "/order",
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M16.5 12a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zM3 21v-1.5a4.5 4.5 0 014.5-4.5h9a4.5 4.5 0 014.5 4.5V21" />
                        </svg>
                    )
                },
                {
                    id: 5,
                    title: "Buyrtma qutisi",
                    path: "/orderbox",
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4.5 6.75L12 3l7.5 3.75M3 10.5l9 4.5 9-4.5M3 14.25l9 4.5 9-4.5" />
                        </svg>
                    )
                }
            ]
        },
        {
            section: "Moliya",
            items: [
                {
                    id: 3,
                    title: "Barcha to'lovlar",
                    path: "/benefits",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8 11.75V7.5q0-.625.438-1.062T9.5 6t1.063.438T11 7.5v4.25q0 .625-.437 1.063T9.5 13.25t-1.062-.437T8 11.75m5-.225V3.5q0-.625.438-1.062T14.5 2t1.063.438T16 3.5v8.025q0 .75-.462 1.125t-1.038.375t-1.037-.375T13 11.525m-10 3.45V11.5q0-.625.438-1.062T4.5 10t1.063.438T6 11.5v3.475q0 .75-.462 1.125t-1.038.375t-1.037-.375T3 14.975m2.4 6.075q-.65 0-.913-.612T4.7 19.35l4.1-4.1q.275-.275.663-.3t.687.25L13 17.65l5.6-5.6H18q-.425 0-.712-.288T17 11.05t.288-.712t.712-.288h3q.425 0 .713.288t.287.712v3q0 .425-.288.713T21 15.05t-.712-.288T20 14.05v-.6l-6.25 6.25q-.275.275-.663.3t-.687-.25L9.55 17.3L6.1 20.75q-.125.125-.312.213t-.388.087"></path></svg>
                    )
                },
                {
                    id: 3,
                    title: "Qarizdorlar",
                    path: "/debtors",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M6.75 9a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5M9 12.5a2.5 2.5 0 0 1 1.707-2.371A2 2 0 0 0 10 10H3.5a2 2 0 0 0-2 2s0 4 5.25 4c.897 0 1.64-.117 2.257-.31A3 3 0 0 1 9 15.5zm8-6a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m-7 6a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5zm1 0v1a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5m7 1v-1a.5.5 0 0 1-.5-.5h-1a1.5 1.5 0 0 0 1.5 1.5M16.5 16h1a.5.5 0 0 1 .5-.5v-1a1.5 1.5 0 0 0-1.5 1.5M11 14.5v1a.5.5 0 0 1 .5.5h1a1.5 1.5 0 0 0-1.5-1.5m3.5 1a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"></path></svg>
                    )
                },
                {
                    id: 3,
                    title: "Xarajatlar",
                    path: "/expenses",
                    icon: (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M1 4.25C1 3.56 1.56 3 2.25 3h9.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 11 1 10.44 1 9.75zm3 .25V4H3v.5a.5.5 0 0 1-.5.5H2v1h.5A1.5 1.5 0 0 0 4 4.5M9 7a2 2 0 1 0-4 0a2 2 0 0 0 4 0m2-3h-1v.5A1.5 1.5 0 0 0 11.5 6h.5V5h-.5a.5.5 0 0 1-.5-.5zM4 9.5A1.5 1.5 0 0 0 2.5 8H2v1h.5a.5.5 0 0 1 .5.5v.5h1zm7 .5v-.5a.5.5 0 0 1 .5-.5h.5V8h-.5A1.5 1.5 0 0 0 10 9.5v.5zm-6.5 3a1.5 1.5 0 0 1-1.427-1.036Q3.281 12 3.5 12h8.25A2.25 2.25 0 0 0 14 9.75V5.085A1.5 1.5 0 0 1 15 6.5v3.25A3.25 3.25 0 0 1 11.75 13z"></path></svg>
                    )
                },
            ]
        },
    ];

    return (
        <Card className="h-[95%] w-[280px] fixed top-[15px] left-[15px] z-50 shadow-xl bg-white/30 backdrop-blur-md border border-white/20 px-6 py-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-md flex items-center justify-center text-black font-bold text-xl">
                    M
                </div>
                <span className="text-xl font-semibold text-gray-800">Moni Credits</span>
            </div>

            {/* Меню с разделами */}
            <div className="flex flex-col gap-6">
                {groupedMenuItems.map((group) => (
                    <div key={group.section}>
                        <Typography variant="small" color="gray" className="mb-2 uppercase font-medium text-xs tracking-widest">
                            {group.section}
                        </Typography>
                        <div className="flex flex-col gap-2">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 
                                        ${isActive
                                            ? "bg-white/80 text-blue-600 font-semibold shadow-md"
                                            : "text-gray-700 hover:bg-white/40 hover:text-blue-600"}`
                                    }
                                >
                                    <span className="w-6 h-6">{item.icon}</span>
                                    <span className="text-sm">{item.title}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
