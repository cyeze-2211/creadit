import { Info, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t, i18n } = useTranslation();

    // Demo ma'lumotlar
    const total = 774;
    const paid = 430;
    const debt = total - paid;
    const thisMonth = 86;
    const progress = (paid / total) * 100;

    const paymentHistory = [
        { id: 1, date: '28-01-2025', amount: 86 },
        { id: 2, date: '28-02-2025', amount: 86 },
        { id: 3, date: '28-03-2025', amount: 86 },
        { id: 4, date: '28-04-2025', amount: 86 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex justify-center items-start py-6">
            <div className="w-full max-w-[600px] p-4 mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-white font-bold text-xl tracking-wide">{t("brand")}</div>
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

                {/* Info Card */}
                <div className="bg-white/20 backdrop-blur-md rounded-3xl mb-4 shadow-xl p-6 border border-white/30 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-extrabold text-lg tracking-widest">{t("brand_upper")}</span>
                        </div>
                        <div>
                            <div className="text-white font-bold text-base">{t("shop")}</div>
                            <div className="text-xs text-gray-200">{t("seller")}</div>
                        </div>
                    </div>
                    <div className="absolute right-4 top-4"></div>
                    <div className="text-gray-100 text-sm mb-1">{t("payment_this_month")}</div>
                    <div className="text-4xl font-bold mb-2 text-white">{t("payment_amount")}</div>
                    <div className="w-full bg-white/30 rounded-full h-2 mb-3 relative">
                        <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <span className="absolute right-2 top-[-22px] text-xs text-white/80">{t("payment_percent")}</span>
                    </div>
                    <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-sm text-white/80">
                            <div>{t("total")}</div>
                            <div className="font-semibold">{t("total_amount")}</div>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                            <div>{t("paid")}</div>
                            <div className="font-semibold">{t("paid_amount")}</div>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                            <div>{t("debt")}</div>
                            <div className="font-semibold">{t("debt_amount")}</div>
                        </div>
                    </div>
                </div>

                {/* Buyurtma haqida */}
                <div className="bg-white/20 backdrop-blur-md rounded-3xl mb-4 shadow-xl p-5 border border-white/30 flex gap-4 items-center relative">
                    <img
                        src="data:image/jpeg;base64,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"
                        alt={t("product")}
                        className="w-20 h-20 rounded-xl object-cover bg-white shadow"
                    />
                    {/* <div className="absolute right-5 top-5 flex flex-col items-end gap-2">
                        <span className="bg-green-500/90 text-white text-base px-4 py-1 rounded-xl font-bold shadow-lg">
                            {t("quantity")}
                        </span>
                    </div> */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="font-bold mb-[10px] text-white text-lg">{t("product")}</div>
                        <div className="bg-green-500/80  text-white text-base px-4 py-1 rounded-lg font-bold shadow w-fit">
                            {t("product_price")}
                        </div>
                        <div className="bg-blue-500/80 text-white text-base px-4 py-1 rounded-lg font-bold shadow w-fit">
                            {t("item_price")}
                        </div>
                    </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md rounded-3xl mb-4 shadow-lg border border-white/30">
                    <NavLink to="/details">
                        <button className="w-full flex items-center justify-between px-4 py-4 border-b border-white/10 hover:bg-white/10 transition-colors rounded-t-3xl">
                            <div className="flex items-center gap-3 text-white">
                                <Info className="text-teal-400 w-5 h-5" />
                                <span className="font-medium">{t("details")}</span>
                            </div>
                            <ChevronRight className="text-gray-300 w-4 h-4" />
                        </button>
                    </NavLink>
                    <NavLink to="/paymenthistory">
                        <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/10 transition-colors rounded-b-3xl">
                            <div className="flex items-center gap-3 text-white">
                                <Clock className="text-teal-400 w-5 h-5" />
                                <span className="font-medium">{t("payment_history")}</span>
                            </div>
                            <ChevronRight className="text-gray-300 w-4 h-4" />
                        </button>
                    </NavLink>
                </div>

                <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-lg p-4 border border-white/30">
                    <div className="text-lg font-semibold mb-3 text-white">{t("payment_schedule")}</div>
                    <div className="space-y-3">
                        {paymentHistory.map((payment, idx) => (
                            <div key={payment.id} className="flex items-center justify-between hover:bg-white/10 rounded-xl px-2 py-2 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 bg-gray-100/80 rounded-full flex items-center justify-center shadow">
                                        <span className="text-xs font-medium text-gray-700">{t(`payment_${idx+1}`)}</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-300">{t(`payment_${idx+1}_date`)}</div>
                                        <div className="font-medium text-white text-sm">{t(`payment_${idx+1}_amount`)}</div>
                                    </div>
                                </div>
                                <CheckCircle className="text-green-400 w-5 h-5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg p-4 border border-white/30 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-bold text-lg">{t("contact")}</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                    <div className="text-white text-sm mb-1">
                        {t("phone")}
                    </div>
                    <div className="text-white text-sm">
                        {t("address")}
                    </div>
                </div>
            </div>
        </div>
    );}