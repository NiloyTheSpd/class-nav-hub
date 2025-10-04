import { PageContainer } from "@/components/PageContainer";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";

type SessionStatus = "Upcoming" | "Completed";

interface CalendarSession {
  id: number;
  date: string;
  subject: string;
  student: string;
  status: SessionStatus;
}

const mockSessions: CalendarSession[] = [
  { id: 101, date: "2025-01-15", subject: "Mathematics", student: "Alice Johnson", status: "Upcoming" },
  { id: 102, date: "2025-01-15", subject: "Physics", student: "Bob Smith", status: "Upcoming" },
  { id: 103, date: "2025-01-16", subject: "Chemistry", student: "Carol White", status: "Upcoming" },
  { id: 104, date: "2025-01-17", subject: "Biology", student: "David Brown", status: "Completed" },
  { id: 105, date: "2025-01-18", subject: "English", student: "Emma Davis", status: "Upcoming" },
  { id: 106, date: "2025-01-19", subject: "History", student: "Frank Miller", status: "Completed" },
  { id: 107, date: "2025-01-20", subject: "Mathematics", student: "Grace Lee", status: "Upcoming" },
  { id: 108, date: "2025-01-22", subject: "Physics", student: "Henry Wilson", status: "Upcoming" },
  { id: 109, date: "2025-01-23", subject: "Chemistry", student: "Ivy Martinez", status: "Completed" },
  { id: 110, date: "2025-01-24", subject: "Biology", student: "Jack Anderson", status: "Upcoming" },
];

const Calendar = () => {
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<CalendarSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<CalendarSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedSession, setDraggedSession] = useState<CalendarSession | null>(null);

  const getCalendarDays = () => {
    if (view === "month") {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const getSessionsForDay = (day: Date) => {
    return sessions.filter((session) => isSameDay(new Date(session.date), day));
  };

  const handleDragStart = (session: CalendarSession) => {
    setDraggedSession(session);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (day: Date) => {
    if (draggedSession) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === draggedSession.id
            ? { ...session, date: format(day, "yyyy-MM-dd") }
            : session
        )
      );
      setDraggedSession(null);
    }
  };

  const handleSessionClick = (session: CalendarSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const getStatusBadgeVariant = (status: SessionStatus) => {
    return status === "Upcoming" ? "default" : "secondary";
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <PageContainer title="Calendar">
      <div className="space-y-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {/* Week day headers */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-sm p-2 text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => {
                const daySessions = getSessionsForDay(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border rounded-lg transition-colors ${
                      isCurrentMonth ? "bg-card" : "bg-muted/30"
                    } ${isToday ? "ring-2 ring-primary" : ""}`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(day)}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday ? "text-primary" : isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {daySessions.map((session) => (
                        <div
                          key={session.id}
                          draggable
                          onDragStart={() => handleDragStart(session)}
                          onClick={() => handleSessionClick(session)}
                          className="text-xs p-1.5 rounded cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 animate-fade-in"
                        >
                          <div className="font-medium truncate">{session.subject}</div>
                          <div className="text-muted-foreground truncate text-[10px]">
                            {session.student}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Session Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Session Details
              </DialogTitle>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="text-base font-semibold">
                      {format(new Date(selectedSession.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={getStatusBadgeVariant(selectedSession.status)} className="mt-1">
                      {selectedSession.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-base font-semibold">{selectedSession.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student</p>
                  <p className="text-base font-semibold">{selectedSession.student}</p>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button>Reschedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default Calendar;
