
import jwt from 'jsonwebtoken';

export const createJWT = (playload: any) => {
    return jwt.sign(
        playload,
        process.env.JWT_KEY as string
    );
}
