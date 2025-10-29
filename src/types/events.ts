// Event types based on the frontend analysis
export type EventType = 
  | "workshop" 
  | "seminar" 
  | "webinar" 
  | "outreach" 
  | "collaboration" 
  | "hackathon" 
  | "capacity-building" 
  | "calendar-event" 
  | "past-event";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  venue?: string;
  speaker?: string;
  mode?: "In-person" | "Online" | "Hybrid";
  audience?: string;
  participants?: string;
  focus?: string;
  partners?: string;
  objective?: string;
  theme?: string;
  prizes?: string;
  teams?: string;
  duration?: string;
  sessions?: string;
  certification?: string;
  eligibility?: string;
  modules?: string;
  highlight?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
