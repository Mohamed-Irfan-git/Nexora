import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useExportData, useImportData } from '@/features/settings/hooks/useSettings'

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function DataSettingsPage() {
  const { toast } = useToast()
  const exportData = useExportData()
  const importData = useImportData()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleExport = async () => {
    try {
      const data = await exportData.mutateAsync()
      downloadJson(`nexora-export-${new Date().toISOString().slice(0, 10)}.json`, data)
      toast({ title: 'Export complete' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: err instanceof Error ? err.message : 'Could not export data',
      })
    }
  }

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const json = JSON.parse(text) as Record<string, unknown>
      const payload = json as Record<string, unknown[]>
      await importData.mutateAsync(payload)
      toast({ title: 'Import complete', description: 'Reload pages to see the updated data.' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Import failed',
        description: err instanceof Error ? err.message : 'Invalid JSON or import error',
      })
    }
  }

  const importEnabled = confirmText.trim().toUpperCase() === 'IMPORT'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Download a backup of your Nexora data as JSON.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} disabled={exportData.isPending}>
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </CardContent>
      </Card>

      <Card className="border-amber-200 dark:border-amber-900/50">
        <CardHeader>
          <CardTitle>Import</CardTitle>
          <CardDescription>
            Import will overwrite your current data in supported tables. Type <strong>IMPORT</strong> to enable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type IMPORT"
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!importEnabled || importData.isPending}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Choose JSON file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleImportFile(file)
                e.currentTarget.value = ''
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Export first, then import the exported file to verify round-trip.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

