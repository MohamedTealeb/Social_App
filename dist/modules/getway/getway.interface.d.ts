import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from '../../DB/model/User.model';
import { Socket } from 'socket.io';
export interface IAuthSocket extends Socket {
    credentials?: {
        user: Partial<HUserDocument>;
        decoded: JwtPayload;
    };
}
//# sourceMappingURL=getway.interface.d.ts.map