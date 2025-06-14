export default function AnalyticsPage() {
  const metrics = [
    { label: "Monthly Visitors", value: "12,540" },
    { label: "Conversion Rate", value: "4.5%" },
    { label: "Bounce Rate", value: "35%" },
    { label: "Avg. Session Time", value: "3m 24s" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Summary</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white p-4 border rounded-xl shadow"
          >
            <h2 className="text-gray-600 text-sm">{metric.label}</h2>
            <p className="text-xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 p-4 rounded-xl mt-8">
        <p className="text-gray-500">Charts & advanced metrics coming soon...</p>
      </div>
    </div>
  )
}
