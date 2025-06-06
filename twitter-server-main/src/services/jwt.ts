// import JWT from "jsonwebtoken";
// import { prismaClient } from "../clients/db";
// import { User } from "@prisma/client";

// const JWT_SECRET = "BruceHarsha";

// type JWTUser = {
//   id: string;
//   email: string;
// };

// class JWTService {
//     public static async generateTokenForUser(userId: string) {
//         const user = await prismaClient.user.findUnique({ where: { id: userId } });
        
//         if (!user) throw new Error('User not found');

//         const payload: JWTUser = {
//             id: user.id,
//             email: user.email,
//         };

//         const token = JWT.sign(payload, JWT_SECRET);
//         return token;
//     }

//     public static decodeToken(token: string): JWTUser | null {
//         try {
//             return JWT.verify(token, JWT_SECRET) as JWTUser;
//         } catch (error) {
//             console.error("Failed to decode token:", error);
//             return null;
//         }
//     }
// }

// export default JWTService;

import JWT from "jsonwebtoken";
import { prismaClient } from "../clients/db";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "BruceHarsha";

type JWTUser = {
  id: string;
  email: string;
};

class JWTService {
    public static async generateTokenForUser(userId: string) {
        const user = await prismaClient.user.findUnique({ where: { id: userId } });
        
        if (!user) throw new Error('User not found');

        const payload: JWTUser = {
            id: user.id,
            email: user.email,
        };

        const token = JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    public static decodeToken(token: string): JWTUser | null {
        if (!token) {
            console.error("No token provided");
            return null;
        }

        try {
            // Remove 'Bearer ' if present
            const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
            return JWT.verify(actualToken, JWT_SECRET) as JWTUser;
        } catch (error) {
            if (error instanceof JWT.JsonWebTokenError) {
                console.error("Invalid token:", error.message);
            } else if (error instanceof JWT.TokenExpiredError) {
                console.error("Token expired:", error.message);
            } else {
                console.error("Failed to decode token:", error);
            }
            return null;
        }
    }
}

export default JWTService;