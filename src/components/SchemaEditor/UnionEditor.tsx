import { type FC } from "react";
import type { JSONSchema } from "../../types/jsonSchema";
import SchemaVisualEditor from "./SchemaVisualEditor";

interface Props {
  keyword: "oneOf" | "anyOf" | "allOf";
  schema: JSONSchema;
  readOnly: boolean;
  onChange: (schema: JSONSchema) => void;
}

const UnionEditor: FC<Props> = ({ keyword, schema, readOnly, onChange }) => {
  const variants = (schema as any)[keyword] ?? [];

  const updateVariant = (index: number, newSchema: JSONSchema) => {
    const updated = [...variants];
    updated[index] = newSchema;

    onChange({
      ...schema,
      [keyword]: updated,
    });
  };

  const addVariant = () => {
    onChange({
      ...schema,
      [keyword]: [...variants, { type: "string" }],
    });
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_: any, i: number) => i !== index);

    onChange({
      ...schema,
      [keyword]: updated,
    });
  };

  if (!variants.length && readOnly) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <h3>{keyword}</h3>

      {variants.map((variant: JSONSchema, i: number) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
          <SchemaVisualEditor
            schema={variant}
            readOnly={readOnly}
            onChange={(s) => updateVariant(i, s)}
          />

          {!readOnly && (
            <button onClick={() => removeVariant(i)}>remove</button>
          )}
        </div>
      ))}

      {!readOnly && (
        <button onClick={addVariant}>add schema</button>
      )}
    </div>
  );
};

export default UnionEditor;
