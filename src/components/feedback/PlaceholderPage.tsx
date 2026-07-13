import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Coming in Phase 3+</CardTitle>
          <CardDescription>This module will be built in the next development phase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Authentication and database are ready. Navigation and layout are wired up.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
