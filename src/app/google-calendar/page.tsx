"use client";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  Video,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import DashboardMenu from "@/components/DashboardMenu";
import api from "@/services/api";
import Image from "next/image";

const GOOGLE_CLIENT_ID =
  "569726113265-evpgs7qsa7dim7l79o1rumjmn4scorsb.apps.googleusercontent.com";

type GoogleEvent = any;

export default function GoogleCalendarApp() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CalendarComponent />
    </GoogleOAuthProvider>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toDateTimeLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function toISOFromDateTimeLocal(value: string) {
  return new Date(value).toISOString();
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getDateFromEventField(field: any): Date | null {
  if (!field) return null;

  if (typeof field === "object" && field.value) {
    const d = new Date(field.value);
    return d;
  }

  if (typeof field === "string") {
    const d = new Date(field);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function CalendarGrid({
  currentMonth,
  events,
  onEventClick,
}: {
  currentMonth: Date;
  events: GoogleEvent[];
  onEventClick: (event: GoogleEvent) => void;
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Primeiro dia do mês
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay(); // 0 = domingo

  // Último dia do mês
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Dias da semana
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Criar array de dias
  const calendarDays = [];

  // Adicionar espaços vazios para os dias antes do primeiro dia do mês
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Adicionar os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Função para pegar eventos de um dia específico
  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const startDateObj =
        getDateFromEventField(event.start?.dateTime) ||
        getDateFromEventField(event.start?.date);

      if (!startDateObj) return false;

      return (
        startDateObj.getDate() === day &&
        startDateObj.getMonth() === month &&
        startDateObj.getFullYear() === year
      );
    });
  };

  // Verificar se é hoje
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cabeçalho com dias da semana */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-gray-700 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-24 border-r border-b bg-gray-50"
              ></div>
            );
          }

          const dayEvents = getEventsForDay(day);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day}
              className="min-h-24 border-r border-b last:border-r-0 p-2 hover:bg-gray-50 transition"
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isTodayDate
                    ? "bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center"
                    : "text-gray-700"
                }`}
              >
                {day}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const startTime = getDateFromEventField(
                    event.start?.dateTime
                  );
                  const timeStr =
                    startTime && event.start?.dateTime
                      ? startTime.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left text-xs p-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 truncate transition"
                      title={event.summary}
                    >
                      {timeStr && (
                        <span className="font-semibold">{timeStr} </span>
                      )}
                      {event.summary || "Sem título"}
                    </button>
                  );
                })}

                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarComponent() {
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = useState<GoogleEvent | null>(null);
  const [form, setForm] = useState({
    summary: "",
    description: "",
    location: "",
    allDay: false,
    startDateTime: "",
    endDateTime: "",
    startDate: "",
  });

  const loadEventsForMonth = async (date: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      const start = startOfMonth(date).toISOString();
      const end = endOfMonth(date).toISOString();

      const data = await api.getGoogleEvents(start, end);
      setEvents(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch (err: any) {
      if (err && err.status === 401) {
        handleLogout();
        setError("Sessão do Google expirada. Conecte novamente.");
      } else {
        setError(err?.message || "Erro ao carregar eventos");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = response.access_token;
        localStorage.setItem("google_access_token", accessToken);
        await loadEventsForMonth(currentMonth);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar eventos");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Erro ao fazer login com Google");
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  // Carrega eventos ao montar o componente
  useEffect(() => {
    const saved = localStorage.getItem("google_access_token");
    if (saved) {
      loadEventsForMonth(currentMonth);
    }
  }, []);

  // Carrega eventos quando o mês muda
  useEffect(() => {
    const saved = localStorage.getItem("google_access_token");
    if (saved && isConnected) {
      loadEventsForMonth(currentMonth);
    }
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    setCurrentMonth(next);
  };

  function handleLogout() {
    localStorage.removeItem("google_access_token");
    setIsConnected(false);
    setEvents([]);
  }

  function openCreateModal() {
    const now = new Date();
    const startDefault = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0
    );
    const endDefault = new Date(startDefault.getTime() + 60 * 60 * 1000);

    setModalMode("create");
    setEditingEvent(null);
    setForm({
      summary: "",
      description: "",
      location: "",
      allDay: false,
      startDateTime: toDateTimeLocalInput(startDefault.toISOString()),
      endDateTime: toDateTimeLocalInput(endDefault.toISOString()),
      startDate: startDefault.toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  }

  function openEditModal(event: GoogleEvent) {
    setModalMode("edit");
    setEditingEvent(event);

    const startDateObj =
      getDateFromEventField(event.start?.dateTime) ||
      getDateFromEventField(event.start?.date);
    const endDateObj =
      getDateFromEventField(event.end?.dateTime) ||
      getDateFromEventField(event.end?.date);

    const startDateTime = startDateObj ? startDateObj.toISOString() : "";
    const endDateTime = endDateObj ? endDateObj.toISOString() : "";
    const allDay = !!event.start?.date;

    setForm({
      summary: event.summary || "",
      description: event.description || "",
      location: event.location || "",
      allDay,
      startDateTime: allDay ? "" : toDateTimeLocalInput(startDateTime),
      endDateTime: allDay ? "" : toDateTimeLocalInput(endDateTime),
      startDate:
        allDay && startDateObj ? startDateObj.toISOString().slice(0, 10) : "",
    });

    setIsModalOpen(true);
  }

  async function handleSubmitForm(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let eventPayload: any = {
        summary: form.summary,
        description: form.description,
        location: form.location,
      };

      if (form.allDay) {
        const startDate = form.startDate;
        const dt = new Date(startDate);
        const next = new Date(dt.getTime() + 24 * 60 * 60 * 1000);
        eventPayload.start = { date: startDate };
        eventPayload.end = { date: next.toISOString().slice(0, 10) };
      } else {
        if (!form.startDateTime || !form.endDateTime) {
          throw new Error("Preencha data/hora de início e fim");
        }
        eventPayload.start = {
          dateTime: toISOFromDateTimeLocal(form.startDateTime),
        };
        eventPayload.end = {
          dateTime: toISOFromDateTimeLocal(form.endDateTime),
        };
      }

      if (modalMode === "create") {
        await api.createGoogleEvent(eventPayload);
      } else if (modalMode === "edit" && editingEvent) {
        await api.updateGoogleEvent(editingEvent.id, eventPayload);
      }

      await loadEventsForMonth(currentMonth);
      setIsModalOpen(false);
    } catch (err: any) {
      if (err && err.status === 401) {
        handleLogout();
        setError("Sessão do Google expirou. Faça login novamente.");
      } else {
        setError(err?.message || "Erro ao salvar evento");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteEvent(eventId?: string) {
    if (!eventId) return;
    if (!confirm("Deseja realmente excluir este evento?")) return;

    try {
      setIsLoading(true);
      await api.deleteGoogleEvent(eventId);
      await loadEventsForMonth(currentMonth);
      setIsModalOpen(false);
    } catch (err: any) {
      if (err && err.status === 401) {
        handleLogout();
        setError("Sessão do Google expirou. Faça login novamente.");
      } else {
        setError(err?.message || "Erro ao excluir evento");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const monthName = currentMonth.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardMenu />

      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Image
                  src="https://www.svgrepo.com/show/353803/google-calendar.svg"
                  alt="google-calendar"
                  width={200}
                  height={200}
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto hover:opacity-80 transition-opacity"
                />
                <div>
                  <h1 className="text-2xl text-black font-semibold">Agenda</h1>
                  <p className="text-sm text-black/70">
                    Gerencie seus compromissos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white text-black rounded-full p-1 shadow">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Mês anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="px-4 text-sm font-medium">{monthName}</div>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Próximo mês"
                  >
                    <ChevronRight className="w-5 h-5 text-black" />
                  </button>
                </div>

                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Criar
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Desconectar
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <section className="lg:col-span-3">
                {isLoading && (
                  <div className="p-6 bg-white rounded shadow">
                    Carregando...
                  </div>
                )}
                {error && (
                  <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {!isConnected && !isLoading && (
                  <div className="p-8 bg-white rounded shadow text-center">
                    <p className="mb-4 text-black">
                      Conecte-se ao Google Calendar para visualizar seus
                      eventos.
                    </p>
                    <button
                      onClick={() => (login as any)()}
                      className="px-6 py-2 bg-blue-600 text-white rounded"
                    >
                      Conectar com Google
                    </button>
                  </div>
                )}

                {isConnected && !isLoading && (
                  <CalendarGrid
                    currentMonth={currentMonth}
                    events={events}
                    onEventClick={openEditModal}
                  />
                )}
              </section>

              <aside className="lg:col-span-1 space-y-4">
                <div className="bg-red-600 p-4 rounded shadow">
                  <p className="text-sm text-white">Resumo do mês</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {events.length}
                  </p>
                  <p className="text-xs text-white">eventos neste mês</p>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-600">Ações rápidas</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={openCreateModal}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 hover text-white rounded cursor-pointer"
                    >
                      Novo Evento
                    </button>
                    <button
                      onClick={() => loadEventsForMonth(currentMonth)}
                      className="text-black px-3 py-2 border rounded hover:text-white hover:bg-black cursor-pointer"
                    >
                      Recarregar eventos
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black">
          <div className="w-full max-w-2xl bg-white rounded-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {modalMode === "create" ? "Criar evento" : "Editar evento"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={(e) => handleSubmitForm(e)} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Local</label>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="allday"
                    type="checkbox"
                    checked={form.allDay}
                    onChange={(e) =>
                      setForm({ ...form, allDay: e.target.checked })
                    }
                  />
                  <label htmlFor="allday" className="text-sm">
                    Dia inteiro
                  </label>
                </div>
              </div>

              {!form.allDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Início</label>
                    <input
                      type="datetime-local"
                      value={form.startDateTime}
                      onChange={(e) =>
                        setForm({ ...form, startDateTime: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Fim</label>
                    <input
                      type="datetime-local"
                      value={form.endDateTime}
                      onChange={(e) =>
                        setForm({ ...form, endDateTime: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
              )}

              {form.allDay && (
                <div>
                  <label className="block text-sm mb-1">Data</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                    disabled={isLoading}
                  >
                    {modalMode === "create" ? "Criar" : "Salvar"}
                  </button>

                  {modalMode === "edit" && editingEvent && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(editingEvent.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded"
                    >
                      Excluir
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
