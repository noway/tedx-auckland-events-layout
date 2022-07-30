import EventsSnakeGrid from "./EventsSnakeGrid";

const items = [
  { title: "01", isBig: true },
  { title: "02", isBig: false },
  { title: "03", isBig: false },
  { title: "04", isBig: false },
  { title: "05", isBig: false },
  { title: "06", isBig: true },
  { title: "07", isBig: false },
  { title: "08", isBig: false },
  { title: "09", isBig: false },
  { title: "10", isBig: false },
  { title: "11", isBig: false },
  { title: "12", isBig: false },
  { title: "13", isBig: true },
  { title: "14", isBig: false },
  { title: "15", isBig: false },
];

export default function App() {
  return (
    <div>
      <EventsSnakeGrid items={items} />
    </div>
  );
}
