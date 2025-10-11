import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  description?: string
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trend.isPositive ? "text-success" : "text-destructive"}`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  )
}
