import {
  generateItems,
  getAreas,
  generateGridRecursive,
  generateGridSimple,
  Grid,
  isAreasValid,
  Item,
} from "./snakeGrid";

export default function Tests() {
  return (
    <>
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
    </>
  );
}

function RandomItemsAreasValidTest(props: {
  columns: number;
  func: (columns: number, items: Item[]) => { grid: Grid };
  name: string;
}) {
  const { columns, func, name } = props;
  const total = 256;
  const itemCount = 256;
  let validCount = 0;
  for (let i = 0; i < total; i++) {
    const items = generateItems(i, itemCount);
    const template = func(columns, items);
    const areas = getAreas(template.grid);
    const valid = isAreasValid(areas);
    if (valid) {
      validCount++;
    }
  }
  const ok = validCount === total;
  return (
    <div>
      {name} {columns} columns areas valid:{" "}
      <span style={{ color: ok ? "green" : "red" }}>
        {validCount}/{total} {ok ? "OK" : "FAIL"}
      </span>
    </div>
  );
}
