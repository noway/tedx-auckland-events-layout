import EventsSnakeGrid from "./EventsSnakeGrid";

const items = [
  { t: "01", big: true },
  { t: "02", big: false },
  { t: "03", big: false },
  { t: "04", big: false },
  { t: "05", big: false },
  { t: "06", big: true },
  { t: "07", big: false },
  { t: "08", big: false },
  { t: "09", big: false },
  { t: "10", big: false },
  { t: "11", big: false },
  { t: "12", big: false },
  { t: "13", big: true },
  { t: "14", big: false },
  { t: "15", big: false },
];

export default function App() {
  return (
    <div>
      <EventsSnakeGrid items={items} />
    </div>
  );
}
