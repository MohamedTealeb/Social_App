import { z } from "zod";
import { logout, updateEmail } from "./user.validation";
export type ILpogoutDto = z.infer<typeof logout.body>;
export type IUpdateEmailDto = z.infer<typeof updateEmail.body>;
//# sourceMappingURL=user.dto.d.ts.map