
// This is a simple in-memory data store for events.
// In a real application, you would use a database.

type EventStatus = 'ongoing' | 'paused' | 'concluded';

export type Event = {
  id: number;
  name: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  attendees: string[];
  status: EventStatus;
};

export let events: Event[] = [
    {
        id: 1,
        name: "Team Brainstorm",
        location: "Office 404",
        startDate: "2024-08-15",
        startTime: "10:00",
        endDate: "2024-08-15",
        endTime: "12:00",
        attendees: ["Alice", "Bob"],
        status: "ongoing",
    },
    {
        id: 2,
        name: "Summer BBQ",
        location: "Central Park",
        startDate: "2024-07-20",
        startTime: "14:00",
        endDate: "2024-07-20",
        endTime: "18:00",
        attendees: ["David", "Eve", "Frank"],
        status: "concluded",
    }
];

export function addEvent(event: Omit<Event, 'id'> & { id?: number }) {
  const newEvent = { ...event, id: event.id || Date.now() };
  events = [newEvent, ...events];
}

export function setEvents(newEvents: Event[]) {
  events = newEvents;
}

export function setEventStatus(eventId: number, status: EventStatus) {
    events = events.map(event => 
        event.id === eventId ? { ...event, status } : event
    );
}

    