import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Details() {
    const { t, i18n } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex justify-center items-start py-6">
            <div className="w-full max-w-[600px] p-4 mx-auto">
                {/* Header */}
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
                    <div className="text-white text-xl font-bold mb-6 text-center">{t("contract_info")}</div>
                    <div className="space-y-5">
                        <div>
                            <div className="text-xs text-gray-300 mb-1">{t("branch")}</div>
                            <div className="text-white font-semibold text-base">{t("brand")}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-300 mb-1">{t("contract_number")}</div>
                            <div className="text-white font-semibold text-base">F2/20241229/204848</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-300 mb-1">{t("contract_date")}</div>
                            <div className="text-white font-semibold text-base">29-12-2024 20:48</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-300 mb-1">{t("contract_price")}</div>
                            <div className="text-white font-semibold text-base">774 USD</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-300 mb-1">{t("contract_term")}</div>
                            <div className="text-white font-semibold text-base">{t("contract_months")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}