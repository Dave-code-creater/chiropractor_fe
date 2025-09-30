
export const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
];

export const SCHEDULE = [
  {
    day: "Mon",
    blocks: [
      {
        label: "Monitoring",
        time: "08:00",
        color: "bg-blue-100 text-blue-800",
      },
      {
        label: "Appointment",
        time: "10:00",
        color: "bg-pink-100 text-pink-800",
      },
    ],
  },
  {
    day: "Tue",
    blocks: [
      { label: "Meeting", time: "08:00" },
      { label: "Appointment", time: "09:00" },
      { label: "Prize", time: "11:00" },
      { label: "Meeting", time: "13:00" },
    ],
  },
  {
    day: "Wed",
    blocks: [
      { label: "Discussion", time: "08:00" },
      { label: "Appointment", time: "10:00" },
      { label: "Offline session", time: "13:00" },
    ],
  },
];

export default function ScheduleGrid({ currentHour }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[60px_repeat(7,minmax(100px,1fr))] text-sm">
        <div></div>
        {HOURS.map((h) => (
          <div
            key={h}
            className="relative text-center font-medium text-muted-foreground"
          >
            {h}
            {currentHour === h && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-black rounded-full" />
            )}
          </div>
        ))}

        {SCHEDULE.map(({ day, blocks }) => (
          <React.Fragment key={day}>
            <div className="font-medium flex items-center">{day}</div>
            {HOURS.map((slot, i) => {
              const item = blocks.find((b) => b.time === slot);
              return item ? (
                <div
                  key={i}
                  className={`p-2 text-center rounded ${item.color || "bg-gray-100"}`}
                >
                  {item.label}
                </div>
              ) : (
                <div key={i}></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
