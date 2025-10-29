"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  GraduationCap,
  Building2,
  Video,
  Bell,
  Save,
  Plus
} from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Event, EventType } from "@/types/events";

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

interface EventFormProps {
  event?: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
  isOpen: boolean;
}

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

export function EventForm({ event, onSave, onCancel, isOpen }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    type: event?.type || "workshop",
    venue: event?.venue || "",
    speaker: event?.speaker || "",
    mode: event?.mode || "In-person",
    audience: event?.audience || "",
    participants: event?.participants || "",
    focus: event?.focus || "",
    partners: event?.partners || "",
    objective: event?.objective || "",
    theme: event?.theme || "",
    prizes: event?.prizes || "",
    teams: event?.teams || "",
    duration: event?.duration || "",
    sessions: event?.sessions || "",
    certification: event?.certification || "",
    eligibility: event?.eligibility || "",
    modules: event?.modules || "",
    highlight: event?.highlight || "",
    status: event?.status || "upcoming",
  });

  // Sync when a different event is opened for editing
  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date || "",
      type: (event?.type as EventType) || "workshop",
      venue: event?.venue || "",
      speaker: event?.speaker || "",
      mode: (event?.mode as any) || "In-person",
      audience: event?.audience || "",
      participants: event?.participants || "",
      focus: event?.focus || "",
      partners: event?.partners || "",
      objective: event?.objective || "",
      theme: event?.theme || "",
      prizes: event?.prizes || "",
      teams: event?.teams || "",
      duration: event?.duration || "",
      sessions: event?.sessions || "",
      certification: event?.certification || "",
      eligibility: event?.eligibility || "",
      modules: event?.modules || "",
      highlight: event?.highlight || "",
      status: (event?.status as any) || "upcoming",
    });
  }, [event, isOpen]);

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.date) {
      alert("Please fill in all required fields (Title, Description, Date)");
      return;
    }

    const eventData: Event = {
      id: event?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      type: formData.type as EventType,
      venue: formData.venue,
      speaker: formData.speaker,
      mode: formData.mode as "In-person" | "Online" | "Hybrid",
      audience: formData.audience,
      participants: formData.participants,
      focus: formData.focus,
      partners: formData.partners,
      objective: formData.objective,
      theme: formData.theme,
      prizes: formData.prizes,
      teams: formData.teams,
      duration: formData.duration,
      sessions: formData.sessions,
      certification: formData.certification,
      eligibility: formData.eligibility,
      modules: formData.modules,
      highlight: formData.highlight,
      status: formData.status as "upcoming" | "ongoing" | "completed" | "cancelled",
      createdAt: event?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(eventData);
  };

  const getFieldsForEventType = (type: EventType) => {
    const baseFields = ["title", "description", "date", "venue", "status"];
    
    switch (type) {
      case "workshop":
        return [...baseFields, "duration", "sessions", "certification", "eligibility", "modules"];
      case "seminar":
      case "webinar":
        return [...baseFields, "speaker", "mode"];
      case "outreach":
        return [...baseFields, "audience", "participants", "focus"];
      case "collaboration":
        return [...baseFields, "partners", "objective"];
      case "hackathon":
        return [...baseFields, "theme", "prizes", "teams", "duration"];
      case "capacity-building":
        return [...baseFields, "duration", "sessions", "certification", "eligibility", "modules"];
      case "calendar-event":
        return baseFields;
      case "past-event":
        return [...baseFields, "highlight"];
      default:
        return baseFields;
    }
  };

  const visibleFields = getFieldsForEventType(formData.type as EventType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {event ? (
                <>
                  <Building2 className="h-5 w-5" />
                  Edit Event
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add New Event
                </>
              )}
            </CardTitle>
            <CardDescription>
              {event ? "Update event information" : "Create a new event or activity"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type *</label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} eventTypeLabels={eventTypeLabels}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypeLabels).map(([value, label]) => {
                      const IconComponent = eventTypeIcons[value as EventType] || Calendar;
                      return (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Input
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter event description"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>

              {visibleFields.includes("venue") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="Enter venue"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Event Type Specific Fields */}
          {(formData.type === "seminar" || formData.type === "webinar") && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seminar/Webinar Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Speaker</label>
                  <Input
                    value={formData.speaker}
                    onChange={(e) => handleInputChange("speaker", e.target.value)}
                    placeholder="Enter speaker name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mode</label>
                  <Select value={formData.mode} onValueChange={(value) => handleInputChange("mode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-person">In-person</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {formData.type === "outreach" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Outreach Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    placeholder="e.g., Engineering Students"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Participants</label>
                  <Input
                    value={formData.participants}
                    onChange={(e) => handleInputChange("participants", e.target.value)}
                    placeholder="e.g., 200+ students"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Focus Area</label>
                <Input
                  value={formData.focus}
                  onChange={(e) => handleInputChange("focus", e.target.value)}
                  placeholder="e.g., Exposure to healthcare challenges"
                />
              </div>
            </div>
          )}

          {formData.type === "collaboration" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Collaboration Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partners</label>
                  <Input
                    value={formData.partners}
                    onChange={(e) => handleInputChange("partners", e.target.value)}
                    placeholder="e.g., Leading Medical Device Companies & Research Institutions"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Objective</label>
                  <Input
                    value={formData.objective}
                    onChange={(e) => handleInputChange("objective", e.target.value)}
                    placeholder="Enter collaboration objective"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === "hackathon" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hackathon Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Input
                    value={formData.theme}
                    onChange={(e) => handleInputChange("theme", e.target.value)}
                    placeholder="e.g., AI for Diagnostics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 48 hours"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prize Pool</label>
                  <Input
                    value={formData.prizes}
                    onChange={(e) => handleInputChange("prizes", e.target.value)}
                    placeholder="e.g., ₹5 Lakhs Total Prize Pool"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Teams</label>
                  <Input
                    value={formData.teams}
                    onChange={(e) => handleInputChange("teams", e.target.value)}
                    placeholder="e.g., 50+ teams expected"
                  />
                </div>
              </div>
            </div>
          )}

          {(formData.type === "workshop" || formData.type === "capacity-building") && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 12 weeks"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sessions</label>
                  <Input
                    value={formData.sessions}
                    onChange={(e) => handleInputChange("sessions", e.target.value)}
                    placeholder="e.g., 24 sessions"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Eligibility</label>
                <Input
                  value={formData.eligibility}
                  onChange={(e) => handleInputChange("eligibility", e.target.value)}
                  placeholder="e.g., Early-stage founders & aspiring entrepreneurs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Modules</label>
                <Input
                  value={formData.modules}
                  onChange={(e) => handleInputChange("modules", e.target.value)}
                  placeholder="e.g., Business Planning, Financial Management, Market Research"
                />
              </div>
            </div>
          )}

          {formData.type === "past-event" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Past Event Details</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Highlight</label>
                <Input
                  value={formData.highlight}
                  onChange={(e) => handleInputChange("highlight", e.target.value)}
                  placeholder="e.g., 70+ innovators trained; 12 disclosures drafted"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
