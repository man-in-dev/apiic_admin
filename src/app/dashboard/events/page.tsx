"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  GraduationCap,
  Building2,
  Video,
  Bell,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { EventForm } from "@/components/dashboard/event-form";
import { Event, EventType } from "@/types/events";
import { useEvents } from "@/hooks/useEvents";

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

// Simple Select components with proper state management
const Select = ({ children, value, onValueChange, eventTypeLabels }: { 
  children: React.ReactNode; 
  value: string; 
  onValueChange: (value: string) => void;
  eventTypeLabels?: Record<string, string>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.select-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleItemClick = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };
  
  return (
    <div className="relative select-container">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, { 
              isOpen, 
              setIsOpen, 
              value, 
              eventTypeLabels
            } as any);
          } else if (child.type === SelectContent) {
            return React.cloneElement(child, { 
              isOpen,
              onItemClick: handleItemClick
            } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, className = "", isOpen, setIsOpen, value, eventTypeLabels }: { 
  children: React.ReactNode; 
  className?: string; 
  isOpen?: boolean; 
  setIsOpen?: (open: boolean) => void;
  value?: string;
  eventTypeLabels?: Record<string, string>;
}) => (
  <div 
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer ${className}`}
    onClick={() => setIsOpen?.(!isOpen)}
  >
    {React.Children.map(children, child => {
      if (React.isValidElement(child) && child.type === SelectValue) {
        return React.cloneElement(child, { value, eventTypeLabels } as any);
      }
      return child;
    })}
  </div>
);

const SelectValue = ({ placeholder, value, eventTypeLabels }: { 
  placeholder: string; 
  value?: string; 
  eventTypeLabels?: Record<string, string>;
}) => {
  const displayValue = value === "all" ? "All Types" : 
                      value && eventTypeLabels?.[value] ? eventTypeLabels[value] : 
                      value || placeholder;
  
  return (
    <span className={value ? "text-foreground" : "text-muted-foreground"}>
      {displayValue}
    </span>
  );
};

const SelectContent = ({ children, isOpen, onItemClick }: { 
  children: React.ReactNode; 
  isOpen?: boolean;
  onItemClick?: (value: string) => void;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white text-foreground shadow-md mt-1">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { onItemClick } as any);
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ children, value, onItemClick }: { 
  children: React.ReactNode; 
  value: string; 
  onItemClick?: (value: string) => void;
}) => (
  <div 
    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100" 
    onClick={() => onItemClick?.(value)}
  >
    {children}
  </div>
);


const eventTypeLabels: Record<EventType, string> = {
  "workshop": "Workshop",
  "seminar": "Seminar",
  "webinar": "Webinar", 
  "outreach": "Outreach",
  "collaboration": "Collaboration",
  "hackathon": "Hackathon",
  "capacity-building": "Capacity Building",
  "calendar-event": "Calendar Event",
  "past-event": "Past Event"
};

const eventTypeIcons: Record<EventType, any> = {
  "workshop": Building2,
  "seminar": Video,
  "webinar": Video,
  "outreach": Users,
  "collaboration": Users,
  "hackathon": Trophy,
  "capacity-building": GraduationCap,
  "calendar-event": Calendar,
  "past-event": Bell
};

export default function EventsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);

  // Build stable query params
  const eventQuery = useMemo(() => ({
    page: currentPage,
    limit: 12,
    search: searchTerm || undefined,
    type: filterType !== "all" ? filterType : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
    sortBy: "createdAt",
    sortOrder: "desc"
  }), [currentPage, searchTerm, filterType, filterStatus]);

  // Use the events hook with filters
  const {
    events,
    loading,
    error,
    pagination,
    stats,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch
  } = useEvents(eventQuery);

  // Reset page when filters change (fetch will occur via hook when params change)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const buildEventPayload = (e: Event) => ({
    title: e.title,
    description: e.description,
    date: e.date,
    type: e.type,
    venue: e.venue,
    link: (e as any).link,
    speaker: e.speaker,
    mode: e.mode,
    audience: e.audience,
    participants: e.participants,
    focus: e.focus,
    partners: e.partners,
    objective: e.objective,
    theme: e.theme,
    prizes: e.prizes,
    teams: e.teams,
    duration: e.duration,
    sessions: e.sessions,
    certification: e.certification,
    eligibility: e.eligibility,
    modules: e.modules,
    highlight: e.highlight,
    image: e.image,
    status: e.status,
  });

  const handleSaveEvent = async (eventData: Event) => {
    try {
      if (editingEvent) {
        // Update existing event
        const payload = buildEventPayload(eventData);
        const updatedEvent = await updateEvent(eventData.id, payload);
        if (updatedEvent) {
          setEditingEvent(null);
        }
      } else {
        // Add new event
        const payload = buildEventPayload(eventData);
        const newEvent = await createEvent(payload as any);
        if (newEvent) {
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleViewEvent = (event: Event) => {
    setViewEvent(event);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const success = await deleteEvent(eventId);
      if (!success) {
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events & Activities Management</h1>
          <p className="text-muted-foreground">
            Manage all events, workshops, seminars, and activities across the platform.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-2 pt-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-red-600">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="ml-auto">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? "Loading..." : `${stats?.upcoming || 0} upcoming`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workshops</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                (stats?.typeDistribution?.find((t: any) => t._id === 'workshop')?.count || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Hands-on training sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hackathons</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                (stats?.typeDistribution?.find((t: any) => t._id === 'hackathon')?.count || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Innovation challenges
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.completed || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Past events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: string) => setFilterType(value as EventType | "all")} eventTypeLabels={eventTypeLabels}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(eventTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading events...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Title & Description</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Venue</th>
                  <th className="px-4 py-2">Speaker</th>
                  <th className="px-4 py-2">Duration</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const IconComponent = eventTypeIcons[event.type] || Calendar;
                  return (
                    <tr key={event.id} className="border-t hover:bg-muted/40">
                      <td className="px-4 py-2 align-top">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium">
                            {eventTypeLabels[event.type]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <div className="font-medium line-clamp-1">{event.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {event.description}
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top text-sm text-muted-foreground">
                        {event.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 align-top text-sm text-muted-foreground">
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="line-clamp-1">{event.speaker}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 align-top text-sm text-muted-foreground">
                        {event.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.duration}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewEvent(event)}
                            disabled={loading}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            disabled={loading}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {events.length === 0 && !loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding your first event."}
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} events
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrevPage || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={!pagination.hasNextPage || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Event Form Modal */}
      <EventForm
        event={editingEvent || undefined}
        onSave={handleSaveEvent}
        onCancel={handleCancelForm}
        isOpen={showAddForm || !!editingEvent}
      />

      {/* View Event Modal */}
      {viewEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {viewEvent.title}
                </CardTitle>
                <CardDescription>
                  {viewEvent.type && eventTypeLabels[viewEvent.type as EventType]} •{" "}
                  {formatDate(viewEvent.date)}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewEvent(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {viewEvent.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p><span className="font-semibold">Status:</span> {viewEvent.status}</p>
                  {viewEvent.venue && (
                    <p><span className="font-semibold">Venue:</span> {viewEvent.venue}</p>
                  )}
                  {viewEvent.speaker && (
                    <p><span className="font-semibold">Speaker:</span> {viewEvent.speaker}</p>
                  )}
                  {viewEvent.mode && (
                    <p><span className="font-semibold">Mode:</span> {viewEvent.mode}</p>
                  )}
                  {viewEvent.duration && (
                    <p><span className="font-semibold">Duration:</span> {viewEvent.duration}</p>
                  )}
                </div>
                <div className="space-y-1">
                  {viewEvent.audience && (
                    <p><span className="font-semibold">Audience:</span> {viewEvent.audience}</p>
                  )}
                  {viewEvent.participants && (
                    <p><span className="font-semibold">Participants:</span> {viewEvent.participants}</p>
                  )}
                  {viewEvent.focus && (
                    <p><span className="font-semibold">Focus:</span> {viewEvent.focus}</p>
                  )}
                  {viewEvent.theme && (
                    <p><span className="font-semibold">Theme:</span> {viewEvent.theme}</p>
                  )}
                  {(viewEvent as any).link && (
                    <p className="truncate">
                      <span className="font-semibold">Link:</span>{" "}
                      <a
                        href={(viewEvent as any).link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {(viewEvent as any).link}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              {viewEvent.highlight && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">Highlights</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {viewEvent.highlight}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
