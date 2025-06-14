'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

const datasets = [
  { name: 'Sales Data Q1', size: '2.3MB', updated: '2025-05-01' },
  { name: 'User Feedback', size: '1.2MB', updated: '2025-04-20' },
  { name: 'Marketing Leads', size: '4.5MB', updated: '2025-06-01' },
]

export default function DataLibraryPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Data Library</h1>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((ds, i) => (
                <TableRow key={i}>
                  <TableCell>{ds.name}</TableCell>
                  <TableCell>{ds.size}</TableCell>
                  <TableCell>{ds.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
