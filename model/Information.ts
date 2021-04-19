type DataShape = Record<string, unknown>;
type ValidationErrors = Record<string, string>;

export type Information = {
  label: string;
  data: Record<string, unknown>;
};

export function validate(record: DataShape): ValidationErrors {
  if (!record.id) return { id: "Must have an ID" };
  else return {};
}
