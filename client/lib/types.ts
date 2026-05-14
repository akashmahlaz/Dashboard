// ─── Ticketing ────────────────────────────────────────────────────────────────

export interface Event {
  id: string
  sourceEventId: string
  name: string
  eventDate: string
  status: "active" | "ended" | "cancelled"
}

export interface TicketSalesDaily {
  id: string
  eventId: string
  saleDate: string
  ticketsSold: number
  syncedAt: string
}

// Flattened row for the main dashboard table
export interface DailyEventRow {
  eventId: string
  eventName: string
  eventDate: string
  saleDate: string
  ticketsSold: number
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

export type SyncStatus = "running" | "success" | "failed"

export interface SyncRun {
  id: string
  source: string
  startedAt: string
  finishedAt: string | null
  status: SyncStatus
  recordsProcessed: number | null
  errorSummary: string | null
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiError {
  error: string
  issues?: Record<string, string[]>
}
