// TODO: put in a separate file?
import { generateItems } from "./Demo";
import {
  getGridTemplateRecursive,
  getGridTemplateSimple,
  isAreasValid,
  Item,
} from "./EventsSnakeGrid";

export default function Tests() {
  return (
    <>
      <RandomItemsTest columns={2} func={getGridTemplateSimple} />
      <RandomItemsTest columns={4} func={getGridTemplateSimple} />
      <RandomItemsTest columns={8} func={getGridTemplateSimple} />
      <RandomItemsTest columns={16} func={getGridTemplateSimple} />
      <RandomItemsTest columns={2} func={getGridTemplateRecursive} />
      <RandomItemsTest columns={4} func={getGridTemplateRecursive} />
      <RandomItemsTest columns={8} func={getGridTemplateRecursive} />
      <RandomItemsTest columns={16} func={getGridTemplateRecursive} />
    </>
  );
}

function RandomItemsTest(props: { columns: number, func: (columns: number, items: Item[]) => { areas: string[] } }) {
  const { columns, func } = props;
  const total = 256;
  const itemCount = 256;
  let validCount = 0;
  for (let i = 0; i < total; i++) {
    const template = func(
      columns,
      generateItems(i, itemCount)
    );
    if (isAreasValid(template.areas)) {
      validCount++;
    }
  }
  return (
    <div>
      getGridTemplateSimple {columns} columns valid: {validCount}/{total}
    </div>
  );
}
