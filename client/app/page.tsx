import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, APP_TAGLINE } from "@/lib/constants"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
          <Badge variant="secondary" className="text-xs font-normal">
            Internal
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">Phase 1</span>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Event Operations
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground leading-tight">
              {APP_NAME}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {APP_TAGLINE}
            </p>
          </div>

          <Separator className="max-w-xs w-full" />

          <div className="flex flex-col items-center gap-2.5">
            <Button asChild size="lg" className="px-10 text-sm">
              <Link href="/dashboard">Enter Dashboard</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Internal access only
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-4">
        <p className="text-xs text-muted-foreground text-center">
          Refreshed twice daily â€” morning and evening
        </p>
      </footer>
    </main>
  )
}
