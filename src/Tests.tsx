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

const generateGridTestMatrix = [
  {
    columns: 3,
    func: generateGridSimple,
    name: "generateGridSimple 3 columns areas",
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
    columns: 3,
    func: generateGridRecursive,
    name: "generateGridRecursive 3 columns areas",
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
    columns: 3,
    func: generateGridHybrid,
    name: "generateGridHybrid 3 columns areas",
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
type Action =
  | { type: "add_result"; report: Report; runId: number }
  | { type: "end_run"; runId: number }
  | { type: "start_run"; runId: number };

const initialState: State = { reports: {}, runIds: [] };

function reducer(state: State, action: Action) {
  const { runId } = action;
  switch (action.type) {
    case "start_run":
      const runIds1 = [...new Set([...state.runIds, runId])];
      return { ...state, runIds: runIds1 };
    case "add_result":
      const reports = [...(state.reports[runId] ?? []), action.report];
      return {
        ...state,
        reports: { ...state.reports, [runId]: reports },
      };
    case "end_run":
      const runIds2 = state.runIds.filter((id) => id !== runId);
      return { ...state, runIds: runIds2 };
    default:
      throw new Error();
  }
}

export default function Tests() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function runTests(runId: number) {
    for (const { columns, func, name } of generateGridTestMatrix) {
      startTransition(() => {
        const result = runGenerateGridTest(func, columns);
        const report = { result, name };
        dispatch({ type: "add_result", report, runId });
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  useEffect(() => {
    const runId = Date.now();
    dispatch({ type: "start_run", runId });
    runTests(runId);
    return () => {
      dispatch({ type: "end_run", runId });
    };
  }, []);
  const latestRunId = Math.max(...state.runIds);
  const reports = state.reports[latestRunId] ?? [];
  return (
    <>
      {reports.map((report) => {
        return <TestReport key={report.name} report={report} />;
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

function TestReport(props: { report: Report }) {
  const { result, name } = props.report;
  return (
    <div>
      {name}:{" "}
      <span
        style={{
          color: result.validCount === result.total ? "green" : "red",
        }}
      >
        {result.validCount}/{result.total}{" "}
        {result.validCount === result.total ? "OK" : "FAIL"}
      </span>
    </div>
  );
}

function runGenerateGridTest(
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
