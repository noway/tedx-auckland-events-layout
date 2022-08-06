import {
  generateItems,
  getGridTemplateRecursive,
  getGridTemplateSimple,
  isAreasValid,
  Item,
} from "./snakeGrid";

export default function Tests() {
  return (
    <>
      <RandomItemsAreasValidTest
        columns={2}
        func={getGridTemplateSimple}
        name="getGridTemplateSimple"
      />
      <RandomItemsAreasValidTest
        columns={4}
        func={getGridTemplateSimple}
        name="getGridTemplateSimple"
      />
      <RandomItemsAreasValidTest
        columns={8}
        func={getGridTemplateSimple}
        name="getGridTemplateSimple"
      />
      <RandomItemsAreasValidTest
        columns={16}
        func={getGridTemplateSimple}
        name="getGridTemplateSimple"
      />
      <RandomItemsAreasValidTest
        columns={2}
        func={getGridTemplateRecursive}
        name="getGridTemplateRecursive"
      />
      <RandomItemsAreasValidTest
        columns={4}
        func={getGridTemplateRecursive}
        name="getGridTemplateRecursive"
      />
      <RandomItemsAreasValidTest
        columns={8}
        func={getGridTemplateRecursive}
        name="getGridTemplateRecursive"
      />
      <RandomItemsAreasValidTest
        columns={16}
        func={getGridTemplateRecursive}
        name="getGridTemplateRecursive"
      />
    </>
  );
}

function RandomItemsAreasValidTest(props: {
  columns: number;
  func: (columns: number, items: Item[]) => { areas: string[] };
  name: string;
}) {
  const { columns, func, name } = props;
  const total = 256;
  const itemCount = 256;
  let validCount = 0;
  for (let i = 0; i < total; i++) {
    const items = generateItems(i, itemCount);
    const template = func(columns, items);
    const valid = isAreasValid(template.areas);
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
