"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/cards/EventCard";

interface Event {
  title: string;
  date: string;
  description: string;
  location: string;
  link: string;
  time: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/kent?type=events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-black dark:text-white">
          🎟️ Upcoming Events & Hackathons
        </h3>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-center">No upcoming events.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              date={event.date}
              description={event.description}
              location={event.location || "Online"}
              link={event.link}
              time={event.time}
            />
          ))}
        </div>
      )}
    </div>
  );
}
