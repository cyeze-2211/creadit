import { InboxIcon } from "@heroicons/react/24/outline";

export default function EmptyState({ title = "Ma'lumot topilmadi", subtitle = "Hozircha hech narsa mavjud emas", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl shadow-inner border border-dashed border-gray-300">
      <InboxIcon className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
