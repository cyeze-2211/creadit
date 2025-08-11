import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentHistory() {
    const { t, i18n } = useTranslation();

    const payments = [
        { date: "30-01-2025 12:33", amount: 86, type: t("cash") },
        { date: "07-03-2025 16:34", amount: 86, type: t("cash") },
        { date: "19-03-2025 15:10", amount: 86, type: t("cash") },
        { date: "26-04-2025 13:42", amount: 86, type: t("cash") },
        { date: "24-05-2025 15:24", amount: 86, type: t("cash") },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex justify-center items-start py-6">
            <div className="w-full max-w-[600px] p-4 mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <NavLink to="/" className="flex items-center gap-2 text-white hover:text-green-400 transition font-semibold">
                        <ArrowLeft className="w-5 h-5" />
                        {t("back")}
                    </NavLink>
                    <div className="flex gap-2">
                        <button
                            className={`bg-white/10 px-3 py-1 rounded-full border border-white/20 shadow hover:bg-white/20 transition text-xs font-semibold ${
                                i18n.language === "uz" ? "text-blue-300 font-bold" : "text-white"
                            }`}
                            onClick={() => i18n.changeLanguage("uz")}
                        >
                            {t("lang_uz")}
                        </button>
                        <button
                            className={`bg-white/10 px-3 py-1 rounded-full border border-white/20 shadow hover:bg-white/20 transition text-xs font-semibold ${
                                i18n.language === "ru" ? "text-blue-300 font-bold" : "text-white"
                            }`}
                            onClick={() => i18n.changeLanguage("ru")}
                        >
                            {t("lang_ru")}
                        </button>
                    </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/30">
                    <div className="text-white text-xl font-bold mb-6 text-center">{t("payment_history")}</div>
                    <div className="space-y-4">
                        {payments.map((p, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3">
                                <div>
                                    <div className="text-xs text-gray-300">{p.date}</div>
                                    <div className="text-xs text-gray-400">{p.type}</div>
                                </div>
                                <div className="text-white font-bold text-lg">{p.amount} USD</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}