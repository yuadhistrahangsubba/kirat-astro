/** Id of a field's error message, for the input's aria-describedby. */
export const errorId = (field: string) => `${field}-error`;

/** aria-invalid / aria-describedby wiring for an input with a FieldError. */
export function errorAria(field: string, message?: string) {
  return {
    "aria-invalid": message ? true : undefined,
    "aria-describedby": message ? errorId(field) : undefined,
  } as const;
}

export function FieldError({ field, message }: { field: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(field)} className="text-destructive text-xs">
      {message}
    </p>
  );
}
