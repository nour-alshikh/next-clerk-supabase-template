import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/action-result";

/**
 * Handles an ActionResult in a react-hook-form submit handler:
 * puts server field errors on the matching inputs and shows a toast.
 * Returns true on success.
 */
export function handleActionResult<T extends FieldValues, D>(
  form: UseFormReturn<T>,
  result: ActionResult<D>,
  successMessage?: string,
): result is { ok: true; data: D } {
  if (result.ok) {
    if (successMessage) toast.success(successMessage);
    return true;
  }

  for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
    form.setError(field as Path<T>, { message: messages[0] });
  }
  toast.error(result.error);
  return false;
}
