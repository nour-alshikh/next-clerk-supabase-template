import { z } from "zod";

// Shared by the components (client) and the actions (server).
export const filePathSchema = z.object({ path: z.string().min(1).max(500) });
