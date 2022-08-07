import { startTransition, useEffect, useReducer, useState } from "react";
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

const testMatrix = [
  { columns: 2, func: generateGridSimple, name: "generateGridSimple" },
  { columns: 4, func: generateGridSimple, name: "generateGridSimple" },
  { columns: 8, func: generateGridSimple, name: "generateGridSimple" },
  { columns: 16, func: generateGridSimple, name: "generateGridSimple" },
  { columns: 2, func: generateGridRecursive, name: "generateGridRecursive" },
  { columns: 4, func: generateGridRecursive, name: "generateGridRecursive" },
  { columns: 8, func: generateGridRecursive, name: "generateGridRecursive" },
  { columns: 16, func: generateGridRecursive, name: "generateGridRecursive" },
  { columns: 2, func: generateGridHybrid, name: "generateGridHybrid" },
  { columns: 4, func: generateGridHybrid, name: "generateGridHybrid" },
  { columns: 8, func: generateGridHybrid, name: "generateGridHybrid" },
  { columns: 16, func: generateGridHybrid, name: "generateGridHybrid" },
];

const initialState = { results: [] };

function reducer(
  state: { results: Result[] },
  action: { type: "add_result"; result: Result } | { type: "clear_results" }
) {
  switch (action.type) {
    case "add_result":
      return { results: [...state.results, action.result] };
    case "clear_results":
      return { results: [] };
    default:
      throw new Error();
  }
}

export default function Tests() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    testMatrix.forEach(({ columns, func, name }) => {
      startTransition(() => {
        const result = runTest(func, columns);
        // TODO: save "report"
        dispatch({ type: "add_result", result });  
      })
    });
    return () => {
      dispatch({ type: "clear_results" });
    };
  }, []);
  return (
    <>
      {state.results.map((result) => {
        return <RandomItemsAreasValidTest result={result} />;
      })}
    </>
  );
}

type Result = {
  validCount: number;
  total: number;
};

function RandomItemsAreasValidTest(props: { result: Result }) {
  const result = props.result;
  return (
    <div>
      {/* {name} {columns} columns areas valid:{" "} */}
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
