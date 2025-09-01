import { z } from "zod";
import { logout } from "./user.validation";
export type ILpogoutDto = z.infer<typeof logout.body>;
//# sourceMappingURL=user.dto.d.ts.map