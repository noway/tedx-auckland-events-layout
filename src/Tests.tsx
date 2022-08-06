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
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateSimple(2, generateItems(i, 256));
            return (
              <div>
                getGridTemplateSimple 2 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateSimple(4, generateItems(i, 256));
            return (
              <div>
                getGridTemplateSimple 4 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateSimple(8, generateItems(i, 256));
            return (
              <div>
                getGridTemplateSimple 8 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
      <div>
        {Array(256)
          .fill(undefined)
          .map((_, i) => {
            const template = getGridTemplateSimple(16, generateItems(i, 256));
            return (
              <div>
                getGridTemplateSimple 16 col valid:{" "}
                {String(isAreasValid(template.areas))}
              </div>
            );
          })}
      </div>
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
