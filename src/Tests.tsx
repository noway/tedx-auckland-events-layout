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
  {
    columns: 2,
    func: generateGridSimple,
    name: "generateGridSimple 2 columns areas",
  },
  {
    columns: 4,
    func: generateGridSimple,
    name: "generateGridSimple 4 columns areas",
  },
  {
    columns: 8,
    func: generateGridSimple,
    name: "generateGridSimple 8 columns areas",
  },
  {
    columns: 16,
    func: generateGridSimple,
    name: "generateGridSimple 16 columns areas",
  },
  {
    columns: 2,
    func: generateGridRecursive,
    name: "generateGridRecursive 2 columns areas",
  },
  {
    columns: 4,
    func: generateGridRecursive,
    name: "generateGridRecursive 4 columns areas",
  },
  {
    columns: 8,
    func: generateGridRecursive,
    name: "generateGridRecursive 8 columns areas",
  },
  {
    columns: 16,
    func: generateGridRecursive,
    name: "generateGridRecursive 16 columns areas",
  },
  {
    columns: 2,
    func: generateGridHybrid,
    name: "generateGridHybrid 2 columns areas",
  },
  {
    columns: 4,
    func: generateGridHybrid,
    name: "generateGridHybrid 4 columns areas",
  },
  {
    columns: 8,
    func: generateGridHybrid,
    name: "generateGridHybrid 8 columns areas",
  },
  {
    columns: 16,
    func: generateGridHybrid,
    name: "generateGridHybrid 16 columns areas",
  },
];

const initialState = { reports: [] };

function reducer(
  state: { reports: Report[] },
  action: { type: "add_result"; report: Report } | { type: "clear_results" }
) {
  switch (action.type) {
    case "add_result":
      return { reports: [...state.reports, action.report] };
    case "clear_results":
      return { reports: [] };
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
        const report = { result, name };
        // TODO: save "report"
        dispatch({ type: "add_result", report });
      });
    });
    return () => {
      dispatch({ type: "clear_results" });
    };
  }, []);
  return (
    <>
      {state.reports.map((report) => {
        return <RandomItemsAreasValidTest report={report} />;
      })}
    </>
  );
}

type Result = {
  validCount: number;
  total: number;
};

type Report = {
  result: Result;
  name: string;
};

function RandomItemsAreasValidTest(props: { report: Report }) {
  const result = props.report.result;
  const name = props.report.name;
  return (
    <div>
      {name}:{" "}
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
