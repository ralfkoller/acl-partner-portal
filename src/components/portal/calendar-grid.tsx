"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"
import { de } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  start_date: string
}

interface CalendarGridProps {
  events: CalendarEvent[]
}

export function CalendarGrid({ events }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

  function getEventsForDay(day: Date) {
    return events.filter((event) => isSameDay(new Date(event.start_date), day))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100/80 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-acl-dark">
          {format(currentDate, "MMMM yyyy", { locale: de })}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 rounded-xl hover:bg-acl-light transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-acl-dark" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-acl-orange hover:bg-acl-orange/10 transition-colors"
          >
            Heute
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 rounded-xl hover:bg-acl-light transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-acl-dark" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-acl-gray uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <div
              key={idx}
              className={`min-h-[80px] p-2 border-t border-gray-100 ${
                isToday(day)
                  ? "bg-orange-50 border-orange-200"
                  : isWeekend
                  ? "bg-gray-50"
                  : ""
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  isCurrentMonth ? "text-acl-dark" : "text-acl-gray/40"
                } ${isToday(day) ? "font-bold text-acl-orange" : ""}`}
              >
                {format(day, "d")}
              </div>
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="text-[10px] bg-acl-orange/10 text-acl-orange px-1.5 py-0.5 rounded mb-0.5 truncate font-medium"
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-[10px] text-acl-gray">
                  +{dayEvents.length - 2} mehr
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
