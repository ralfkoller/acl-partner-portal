"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Plus, Pencil, Trash2, Users, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { createEvent, updateEvent, deleteEvent } from "@/lib/actions/events"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { TiptapEditor } from "@/components/tiptap/editor"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: any
  location: string | null
  eventUrl: string | null
  startDate: string
  endDate: string | null
  maxSeats: number | null
  isPublished: boolean
  createdAt: string
}

interface Attendee {
  fullName: string
  company: string | null
}

interface AdminEventsListProps {
  events: Event[]
  registrations: Record<string, Attendee[]>
}

export function AdminEventsList({ events, registrations }: AdminEventsListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState<any>(null)
  const [location, setLocation] = useState("")
  const [eventUrl, setEventUrl] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [maxSeats, setMaxSeats] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  function openNewForm() {
    setEditEvent(null)
    setTitle("")
    setDescription(null)
    setLocation("")
    setEventUrl("")
    setStartDate("")
    setEndDate("")
    setMaxSeats("")
    setIsPublished(false)
    setShowForm(true)
  }

  function openEditForm(event: Event) {
    setEditEvent(event)
    setTitle(event.title)
    setDescription(event.description)
    setLocation(event.location ?? "")
    setEventUrl(event.eventUrl ?? "")
    setStartDate(event.startDate ? event.startDate.slice(0, 16) : "")
    setEndDate(event.endDate ? event.endDate.slice(0, 16) : "")
    setMaxSeats(event.maxSeats?.toString() ?? "")
    setIsPublished(event.isPublished)
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const data = {
        title,
        description,
        location,
        eventUrl,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        maxSeats: maxSeats ? parseInt(maxSeats) : undefined,
        isPublished,
      }

      const result = editEvent
        ? await updateEvent(editEvent.id, data)
        : await createEvent(data)

      if (result.error) toast.error(result.error)
      else {
        toast.success(editEvent ? "Event aktualisiert" : "Event erstellt")
        setShowForm(false)
        router.refresh()
      }
    })
  }

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteEvent(deleteId)
      if (result.error) toast.error(result.error)
      else {
        toast.success("Event gelöscht")
        router.refresh()
      }
      setDeleteId(null)
    })
  }

  return (
    <>
      <button
        onClick={openNewForm}
        className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all mb-6"
      >
        <Plus className="w-4 h-4" /> Neues Event
      </button>

      <div className="space-y-4">
        {events.map((event) => {
          const attendees = registrations[event.id] ?? []
          const isExpanded = expandedEvent === event.id

          return (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-gray-100/80 overflow-hidden"
              style={{ borderLeft: "4px solid #3b82f6" }}
            >
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-acl-dark">{event.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      event.isPublished
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-acl-orange/10 text-acl-orange"
                    }`}>
                      {event.isPublished ? "Veröffentlicht" : "Entwurf"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-acl-gray">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(event.startDate), "dd.MM.yyyy HH:mm", { locale: de })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {attendees.length}{event.maxSeats ? ` / ${event.maxSeats}` : ""} Teilnehmer
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                    className="p-1.5 rounded-lg text-acl-gray hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                    title="Teilnehmer anzeigen"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditForm(event)}
                    className="p-1.5 rounded-lg text-acl-gray hover:text-acl-orange hover:bg-acl-orange/10 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(event.id)}
                    className="p-1.5 rounded-lg text-acl-gray hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attendees */}
              {isExpanded && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="text-xs font-medium text-acl-gray uppercase tracking-wider mt-3 mb-2">
                    Teilnehmer ({attendees.length})
                  </div>
                  {attendees.length > 0 ? (
                    <div className="space-y-1.5">
                      {attendees.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-acl-orange-light flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-acl-dark">
                              {a.fullName[0]}
                            </span>
                          </div>
                          <span className="text-acl-dark">{a.fullName}</span>
                          {a.company && <span className="text-acl-gray text-xs">({a.company})</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-acl-gray">Noch keine Anmeldungen.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {events.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-gray-100/80 text-center">
            <Calendar className="w-8 h-8 text-acl-gray/40 mx-auto mb-2" />
            <p className="text-sm text-acl-gray">Noch keine Events erstellt.</p>
          </div>
        )}
      </div>

      {/* Event Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-acl-dark">
              {editEvent ? "Event bearbeiten" : "Neues Event"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Titel</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-acl-dark">Start</Label>
                <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-acl-dark">Ende (optional)</Label>
                <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-acl-dark">Ort</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-acl-dark">Max. Teilnehmer</Label>
                <Input type="number" value={maxSeats} onChange={(e) => setMaxSeats(e.target.value)} min="1" className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Event-URL (optional)</Label>
              <Input value={eventUrl} onChange={(e) => setEventUrl(e.target.value)} className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Beschreibung</Label>
              <TiptapEditor content={description} onChange={setDescription} placeholder="Event-Beschreibung..." />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="event-published"
                checked={isPublished}
                onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                className="border-gray-300 data-[state=checked]:bg-acl-orange data-[state=checked]:border-acl-orange"
              />
              <Label htmlFor="event-published" className="text-sm text-acl-dark cursor-pointer">Sofort veröffentlichen</Label>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending ? "Speichern..." : editEvent ? "Aktualisieren" : "Erstellen"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Event löschen"
        description="Möchten Sie dieses Event wirklich löschen? Alle Anmeldungen werden ebenfalls entfernt."
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        isDestructive
        isPending={isPending}
      />
    </>
  )
}
