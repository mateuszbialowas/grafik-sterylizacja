export default function TimeSelect({ h, m, onChangeH, onChangeM }) {
  return (
    <div className="flex gap-1 items-center">
      <select value={h} onChange={e => onChangeH(+e.target.value)} className="border rounded px-1 py-1 text-sm w-16">
        {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}
      </select>
      <span className="font-bold">:</span>
      <select value={m} onChange={e => onChangeM(+e.target.value)} className="border rounded px-1 py-1 text-sm w-16">
        {Array.from({ length: 12 }, (_, i) => i * 5).map(v => <option key={v} value={v}>{String(v).padStart(2, "0")}</option>)}
      </select>
    </div>
  );
}
