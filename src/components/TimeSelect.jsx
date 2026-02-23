export default function TimeSelect({ h, m, onChangeH, onChangeM }) {
  return (
    <div className="flex gap-1.5 items-center">
      <select value={h} onChange={e => onChangeH(+e.target.value)} className="border border-gray-200 rounded-lg px-2 py-2 text-[16px] font-semibold text-gray-900 w-20 outline-none focus:border-[#a3b3ff] bg-white">
        {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}
      </select>
      <span className="text-[18px] font-bold text-gray-900">:</span>
      <select value={m} onChange={e => onChangeM(+e.target.value)} className="border border-gray-200 rounded-lg px-2 py-2 text-[16px] font-semibold text-gray-900 w-20 outline-none focus:border-[#a3b3ff] bg-white">
        {Array.from({ length: 12 }, (_, i) => i * 5).map(v => <option key={v} value={v}>{String(v).padStart(2, "0")}</option>)}
      </select>
    </div>
  );
}
