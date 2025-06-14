'use client'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const dummyResults = [
  'React state management',
  'Node.js API error handling',
  'MongoDB indexing guide',
  'How to use Next.js layout',
]

export default function SearchPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <Input placeholder="Type to search..." />
      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-semibold">Results</h2>
          {dummyResults.map((res, i) => (
            <p key={i} className="border-b pb-2">{res}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
