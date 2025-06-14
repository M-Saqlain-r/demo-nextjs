'use client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'

export default function WordAssistantPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const generate = () => {
    setOutput(`Rewritten content:\n\n${input.toUpperCase()} 🚀`)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Word Assistant</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <Textarea
            rows={5}
            placeholder="Enter your text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={generate}>Enhance Text</Button>
          {output && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre>{output}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
