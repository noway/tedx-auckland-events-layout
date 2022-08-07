import { startTransition, useState } from "react";
import {
  generateItems,
  getAreas,
  generateGridRecursive,
  generateGridSimple,
  Grid,
  isAreasValid,
  Item,
  generateGridHybrid,
} from "./snakeGrid";

// TODO: make non-blocking
export default function Tests() {
  return (
    <>
      {/* simple */}
      <RandomItemsAreasValidTest
        columns={2}
        func={generateGridSimple}
        name="generateGridSimple"
      />
      <RandomItemsAreasValidTest
        columns={4}
        func={generateGridSimple}
        name="generateGridSimple"
      />
      <RandomItemsAreasValidTest
        columns={8}
        func={generateGridSimple}
        name="generateGridSimple"
      />
      <RandomItemsAreasValidTest
        columns={16}
        func={generateGridSimple}
        name="generateGridSimple"
      />
      {/* recursive */}
      <RandomItemsAreasValidTest
        columns={2}
        func={generateGridRecursive}
        name="generateGridRecursive"
      />
      <RandomItemsAreasValidTest
        columns={4}
        func={generateGridRecursive}
        name="generateGridRecursive"
      />
      <RandomItemsAreasValidTest
        columns={8}
        func={generateGridRecursive}
        name="generateGridRecursive"
      />
      <RandomItemsAreasValidTest
        columns={16}
        func={generateGridRecursive}
        name="generateGridRecursive"
      />
      {/* hybrid */}
      <RandomItemsAreasValidTest
        columns={2}
        func={generateGridHybrid}
        name="generateGridHybrid"
      />
      <RandomItemsAreasValidTest
        columns={4}
        func={generateGridHybrid}
        name="generateGridHybrid"
      />
      <RandomItemsAreasValidTest
        columns={8}
        func={generateGridHybrid}
        name="generateGridHybrid"
      />
      <RandomItemsAreasValidTest
        columns={16}
        func={generateGridHybrid}
        name="generateGridHybrid"
      />
    </>
  );
}

type Result = {
  validCount: number;
  total: number;
};

function RandomItemsAreasValidTest(props: {
  columns: number;
  func: (columns: number, items: Item[]) => { grid: Grid };
  name: string;
}) {
  const { columns, func, name } = props;
  const [result, setResult] = useState<null | Result>(null);
  useState(() => {
    setTimeout(() => {
      startTransition(() => {
        setResult(runTest(func, columns));
      });
    }, 0);
    return () => {
      setResult(null);
    };
  });
  return (
    <div>
      {name} {columns} columns areas valid:{" "}
      {result ? (
        <span
          style={{
            color: result.validCount === result.total ? "green" : "red",
          }}
        >
          {result.validCount}/{result.total}{" "}
          {result.validCount === result.total ? "OK" : "FAIL"}
        </span>
      ) : (
        <span>Pending...</span>
      )}
    </div>
  );
}

function runTest(
  func: (columns: number, items: Item[]) => { grid: Grid },
  columns: number
) {
  const total = 256;
  const itemCount = 256;
  let validCount = 0;

  for (let i = 0; i < total; i++) {
    try {
      const items = generateItems(i, itemCount);
      const template = func(columns, items);
      const areas = getAreas(template.grid);
      const valid = isAreasValid(areas);
      if (valid) {
        validCount++;
      }
    } catch (e) {
      console.log("error", e);
    }
  }
  return { validCount, total };
}
