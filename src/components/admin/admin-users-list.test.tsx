import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AdminUsersList } from "./admin-users-list"

// --- Mocks ---
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

vi.mock("@/lib/actions/users", () => ({
  updateUserRole: vi.fn().mockResolvedValue({ success: true }),
  createUser: vi.fn().mockResolvedValue({ success: true }),
  inviteUser: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

// ---

const mockUsers = [
  {
    id: "1",
    full_name: "Anna Admin",
    company: "ACL GmbH",
    role: "admin" as const,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    full_name: "Peter Partner",
    company: "Partner GmbH",
    role: "partner" as const,
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "3",
    full_name: "Maria Muster",
    company: null,
    role: "partner" as const,
    created_at: "2026-03-01T10:00:00Z",
  },
]

describe("AdminUsersList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Tabellenrendering", () => {
    it("rendert alle Benutzer", () => {
      render(<AdminUsersList users={mockUsers} />)
      expect(screen.getByText("Anna Admin")).toBeInTheDocument()
      expect(screen.getByText("Peter Partner")).toBeInTheDocument()
      expect(screen.getByText("Maria Muster")).toBeInTheDocument()
    })

    it("zeigt Unternehmen an", () => {
      render(<AdminUsersList users={mockUsers} />)
      expect(screen.getByText("ACL GmbH")).toBeInTheDocument()
      expect(screen.getByText("Partner GmbH")).toBeInTheDocument()
    })

    it("zeigt — für Benutzer ohne Unternehmen", () => {
      render(<AdminUsersList users={mockUsers} />)
      expect(screen.getByText("—")).toBeInTheDocument()
    })

    it("zeigt Rollen-Badges an", () => {
      render(<AdminUsersList users={mockUsers} />)
      expect(screen.getByText("Admin")).toBeInTheDocument()
      expect(screen.getAllByText("Partner")).toHaveLength(2)
    })

    it("zeigt Aktionsbuttons für Rollenänderung", () => {
      render(<AdminUsersList users={mockUsers} />)
      expect(screen.getByText("Zum Partner")).toBeInTheDocument()
      expect(screen.getAllByText("Zum Admin")).toHaveLength(2)
    })

    it("zeigt Meldung wenn keine Benutzer gefunden", () => {
      render(<AdminUsersList users={[]} />)
      expect(screen.getByText("Keine Benutzer gefunden.")).toBeInTheDocument()
    })
  })

  describe("Suche und Filter", () => {
    it("filtert Benutzer nach Name", () => {
      render(<AdminUsersList users={mockUsers} />)
      const searchInput = screen.getByPlaceholderText("Suchen...")
      fireEvent.change(searchInput, { target: { value: "Anna" } })
      expect(screen.getByText("Anna Admin")).toBeInTheDocument()
      expect(screen.queryByText("Peter Partner")).not.toBeInTheDocument()
    })

    it("filtert Benutzer nach Unternehmen", () => {
      render(<AdminUsersList users={mockUsers} />)
      const searchInput = screen.getByPlaceholderText("Suchen...")
      fireEvent.change(searchInput, { target: { value: "ACL" } })
      expect(screen.getByText("Anna Admin")).toBeInTheDocument()
      expect(screen.queryByText("Peter Partner")).not.toBeInTheDocument()
    })

    it("zeigt Meldung wenn Suche keine Treffer hat", () => {
      render(<AdminUsersList users={mockUsers} />)
      const searchInput = screen.getByPlaceholderText("Suchen...")
      fireEvent.change(searchInput, { target: { value: "xxxxxx" } })
      expect(screen.getByText("Keine Benutzer gefunden.")).toBeInTheDocument()
    })
  })

  describe("Dialog: Benutzer hinzufügen", () => {
    it("öffnet Dialog beim Klick auf 'Benutzer erstellen'", () => {
      render(<AdminUsersList users={mockUsers} />)
      fireEvent.click(screen.getByText("Benutzer erstellen"))
      expect(screen.getByText("Benutzer hinzufügen")).toBeInTheDocument()
    })

    it("öffnet Dialog beim Klick auf 'Partner einladen'", () => {
      render(<AdminUsersList users={mockUsers} />)
      fireEvent.click(screen.getByText("Partner einladen"))
      expect(screen.getByText("Benutzer hinzufügen")).toBeInTheDocument()
    })

    it("zeigt Tab 'Erstellen' als Standard", () => {
      render(<AdminUsersList users={mockUsers} />)
      fireEvent.click(screen.getByText("Benutzer erstellen"))
      expect(screen.getByText("Erstellen")).toBeInTheDocument()
      expect(screen.getByText("Einladen")).toBeInTheDocument()
    })

    it("zeigt Passwortfeld im Erstellen-Tab", () => {
      render(<AdminUsersList users={mockUsers} />)
      fireEvent.click(screen.getByText("Benutzer erstellen"))
      expect(screen.getByPlaceholderText("Mindestens 8 Zeichen")).toBeInTheDocument()
    })

    it("versteckt Passwortfeld im Einladen-Tab", () => {
      render(<AdminUsersList users={mockUsers} />)
      fireEvent.click(screen.getByText("Partner einladen"))
      // Tab auf "Einladen" wechseln
      const einladenTab = screen.getAllByText("Einladen")[0]
      fireEvent.click(einladenTab)
      expect(screen.queryByPlaceholderText("Mindestens 8 Zeichen")).not.toBeInTheDocument()
    })
  })

  describe("Rollenänderungs-Dialog", () => {
    it("öffnet Bestätigungs-Dialog bei Rollenänderung", () => {
      render(<AdminUsersList users={mockUsers} />)
      fireEvent.click(screen.getByText("Zum Partner"))
      expect(screen.getByRole("heading", { name: "Rolle ändern" })).toBeInTheDocument()
    })
  })
})
