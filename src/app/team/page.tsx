export default function TeamPage() {
  const members = [
    { name: "Alice Johnson", role: "Project Manager", email: "alice@example.com" },
    { name: "Bob Smith", role: "Frontend Developer", email: "bob@example.com" },
    { name: "Carol Chen", role: "Backend Developer", email: "carol@example.com" },
    { name: "David Lee", role: "QA Engineer", email: "david@example.com" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Team Members</h1>
      <ul className="space-y-4">
        {members.map((member, index) => (
          <li
            key={index}
            className="bg-white border p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
            <p className="text-sm text-gray-500">{member.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
