export default function Legend() {
  const legend = [
    ['Match', 'bg-green-100 border-green-200'],
    ['Different', 'bg-red-100 border-red-200'],
    ['Added', 'bg-blue-100 border-blue-200'],
    ['Removed', 'bg-gray-100 border-gray-200'],
  ];

  return (
    <div className='flex flex-wrap gap-4 text-xs'>
      {legend.map(([label, style]) => (
        <div key={label} className='flex items-center gap-1'>
          <div className={`w-3 h-3 rounded border ${style}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
