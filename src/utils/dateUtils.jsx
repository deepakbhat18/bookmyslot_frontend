export function isUpcomingEvent(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const event = new Date(eventDate);
  return event >= today;
}
