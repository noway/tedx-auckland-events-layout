// TODO: put in a separate file?
import { generateItems } from "./Demo";
import {
  getGridTemplateRecursive,
  getGridTemplateSimple,
  isAreasValid,
} from "./EventsSnakeGrid";

export default function Tests() {
  return (
    <>
      <RandomItemsTest columns={2}/>
      <RandomItemsTest columns={4}/>
      <RandomItemsTest columns={8}/>
      <RandomItemsTest columns={16}/>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateRecursive(2, generateItems(i, 256));
            return (
              <div>
                getGridTemplateRecursive 2 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateRecursive(4, generateItems(i, 256));
            return (
              <div>
                getGridTemplateRecursive 4 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateRecursive(8, generateItems(i, 256));
            return (
              <div>
                getGridTemplateRecursive 8 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateRecursive(
              16,
              generateItems(i, 256)
            );
            return (
              <div>
                getGridTemplateRecursive 16 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
    </>
  );
}

function RandomItemsTest(props: { columns: number }) {
  const { columns } = props;
  const total = 256;
  const itemCount = 256;
  let validCount = 0;
  for (let i = 0; i < total; i++) {
    const template = getGridTemplateSimple(
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
