"use client"

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { DashboardNav } from "./DashboardNav"
import { Separator } from "@/components/ui/separator"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardNav />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-border px-6">
          <SidebarTrigger className="text-muted-foreground" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">
            Event Ops Dashboard
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
