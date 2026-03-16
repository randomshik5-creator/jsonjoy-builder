import { useState } from "react";
import type { JSONSchema } from "../../types/jsonSchema";
import SchemaVisualEditor from "./SchemaVisualEditor";

type Keyword = "oneOf" | "anyOf" | "allOf";

interface Props {
  schema: JSONSchema;
  readOnly: boolean;
  onChange: (schema: JSONSchema) => void;
}

export default function UnionSchemaEditor({ schema, readOnly, onChange }: Props) {
  const [active, setActive] = useState<Keyword>("oneOf");

  const variants = (schema as any)[active] ?? [];

  const updateVariant = (i: number, s: JSONSchema) => {
    const updated = [...variants];
    updated[i] = s;

    onChange({
      ...schema,
      [active]: updated,
    });
  };

  const addVariant = () => {
    onChange({
      ...schema,
      [active]: [...variants, { type: "string" }],
    });
  };

  const removeVariant = (i: number) => {
    const updated = variants.filter((_: any, x: number) => x !== i);

    onChange({
      ...schema,
      [active]: updated,
    });
  };

  const convertToUnion = () => {
    onChange({
      ...schema,
      oneOf: [schema],
    });

    setActive("oneOf");
  };

  const hasUnion =
    schema.oneOf?.length ||
    schema.anyOf?.length ||
    schema.allOf?.length;

  if (!hasUnion && readOnly) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {(["oneOf", "anyOf", "allOf"] as Keyword[]).map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: active === k ? "#444" : "#eee",
              color: active === k ? "#fff" : "#000",
            }}
          >
            {k}
          </button>
        ))}

        {!hasUnion && !readOnly && (
          <button onClick={convertToUnion}>
            convert to union
          </button>
        )}
      </div>

      {variants.map((v: JSONSchema, i: number) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <SchemaVisualEditor
            schema={v}
            readOnly={readOnly}
            onChange={(s) => updateVariant(i, s)}
          />

          {!readOnly && (
            <button onClick={() => removeVariant(i)}>
              remove
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <button onClick={addVariant}>
          add schema
        </button>
      )}
    </div>
  );
}
