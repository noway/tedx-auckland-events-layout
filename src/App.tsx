import { useEffect, useState } from "react";
import EventsSnakeGrid from "./EventsSnakeGrid";

const defaultItems = [
  { id: 1, title: "1", isBig: true },
  { id: 2, title: "2", isBig: false },
  { id: 3, title: "3", isBig: false },
  { id: 4, title: "4", isBig: false },
  { id: 5, title: "5", isBig: false },
  { id: 6, title: "6", isBig: true },
  { id: 7, title: "7", isBig: false },
  { id: 8, title: "8", isBig: false },
  { id: 9, title: "9", isBig: false },
  { id: 10, title: "10", isBig: false },
  { id: 11, title: "11", isBig: false },
  { id: 12, title: "12", isBig: false },
  { id: 13, title: "13", isBig: true },
  { id: 14, title: "14", isBig: false },
  { id: 15, title: "15", isBig: false },
];

function generateItems() {
  const items = [];
  for (let i = 0; i < 16; i++) {
    items.push({ id: i, title: i.toString(), isBig: Math.random() > 0.7 });
  }
  return items;
}

export default function App() {
  const [items, setItems] = useState(defaultItems);

  const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  const [colorScheme, setColorScheme] = useState(colorSchemeQueryList.matches ? 'dark' : 'light');
  useEffect(() => {
    const handleSetColorScheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setColorScheme('dark');
      } else {
        setColorScheme('light');
      }
    }
    handleSetColorScheme(colorSchemeQueryList);
    colorSchemeQueryList.addEventListener('change', handleSetColorScheme);
    return () => {
      colorSchemeQueryList.removeEventListener('change', handleSetColorScheme);
    }
  })

  return (
    <div>
      <button onClick={() => setItems(generateItems())}>Random</button>
      <br/>
      <br/>
      <EventsSnakeGrid items={items} lineColor={colorScheme === 'dark' ? "#D9D9D9" : "#2D3648"} />
    </div>
  );
}
