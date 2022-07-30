import EventsSnakeGrid from "./EventsSnakeGrid";

const items = [
  { id: 1, title: "01", isBig: true },
  { id: 2, title: "02", isBig: false },
  { id: 3, title: "03", isBig: false },
  { id: 4, title: "04", isBig: false },
  { id: 5, title: "05", isBig: false },
  { id: 6, title: "06", isBig: true },
  { id: 7, title: "07", isBig: false },
  { id: 8, title: "08", isBig: false },
  { id: 9, title: "09", isBig: false },
  { id: 10, title: "10", isBig: false },
  { id: 11, title: "11", isBig: false },
  { id: 12, title: "12", isBig: false },
  { id: 13, title: "13", isBig: true },
  { id: 14, title: "14", isBig: false },
  { id: 15, title: "15", isBig: false },
];

export default function App() {
  return (
    <div>
      <EventsSnakeGrid items={items} lineColor={"white"} />
    </div>
  );
}
