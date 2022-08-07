import { startTransition, useEffect, useReducer } from "react";
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

type State = { reports: Record<number, Report[]>; runIds: number[] };

const initialState: State = { reports: {}, runIds: [] };

function reducer(
  state: State,
  action:
    | { type: "add_result"; report: Report; runId: number }
    | { type: "clear_results"; runId: number }
) {
  const { runId } = action;
  switch (action.type) {
    case "add_result":
      const reports = [...(state.reports[runId] ?? []), action.report];
      const runIds1 = [...new Set([...state.runIds, runId])];
      return {
        reports: { ...state.reports, [runId]: reports },
        runIds: runIds1,
      };
    case "clear_results":
      const reportsCopy = { ...state.reports };
      delete reportsCopy[runId];
      const runIds2 = state.runIds.filter((id) => id !== runId);
      return { reports: reportsCopy, runIds: runIds2 };
    default:
      throw new Error();
  }
}

export default function Tests() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function runTests(runId: number) {
    for (const { columns, func, name } of testMatrix) {
      startTransition(() => {
        const result = runTest(func, columns);
        const report = { result, name };
        dispatch({ type: "add_result", report, runId });
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  useEffect(() => {
    // TODO: add run/remove run actions
    const runId = Date.now();
    runTests(runId);
    return () => {
      dispatch({ type: "clear_results", runId });
    };
  }, []);
  const latestRunId = Math.max(...state.runIds);
  const reports = state.reports[latestRunId] ?? [];
  return (
    <>
      {reports.map((report) => {
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
