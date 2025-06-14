export default function ProjectsPage() {
  const projects = [
    { name: "Redesign Website", status: "In Progress", due: "2025-07-01" },
    { name: "Marketing Campaign", status: "Completed", due: "2025-06-01" },
    { name: "Mobile App", status: "Pending", due: "2025-08-15" },
    { name: "Data Migration", status: "In Progress", due: "2025-06-30" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Projects</h1>
      <table className="w-full bg-white rounded-xl shadow overflow-hidden border">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm font-semibold text-gray-600">
            <th className="p-4">Project</th>
            <th className="p-4">Status</th>
            <th className="p-4">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-4">{proj.name}</td>
              <td className="p-4">{proj.status}</td>
              <td className="p-4">{proj.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
