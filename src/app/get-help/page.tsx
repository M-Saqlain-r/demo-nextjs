'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Get Help</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Textarea rows={5} placeholder="Describe your issue..." />
          <Button>Submit Ticket</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-xl mb-2">FAQs</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>How to reset password?</li>
            <li>How to export data?</li>
            <li>How to contact support?</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
