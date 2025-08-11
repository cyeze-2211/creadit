import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader(props) {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed w-[78%] z-30 top-[10px] flex justify-end items-center mb-6 px-6 py-4 
            bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
            
            {/* Profile Avatar & Menu */}
            <div className="relative flex items-center gap-4" ref={menuRef}>
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/40 text-gray-800 px-4 py-2 rounded-full border border-white/30 shadow transition text-sm font-medium"
                >
                    <User className="w-5 h-5" />
                    <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openMenu && (
                    <div className="absolute right-0 top-14 w-40 bg-white/90 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg py-2 z-50">
                        <button
                            onClick={() => navigate("/profil")}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            Profil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
                        >
                            Chiqish
                        </button>
                    </div>
                )}
                {props.children}
            </div>
        </div>
    );
}
