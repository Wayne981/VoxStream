import JWT from "jsonwebtoken";
import { prismaClient } from "../clients/db";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

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

    // Debug: Log the JWT_SECRET (remove in production)
    console.log("JWT_SECRET exists:", !!JWT_SECRET);
    console.log("JWT_SECRET length:", JWT_SECRET?.length);
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = JWT.sign(payload, JWT_SECRET, { expiresIn: '5h' });
    
    // Debug: Log the generated token structure
    console.log("Generated token preview:", token.substring(0, 50) + "...");
    
    return token;
  }

  public static decodeToken(token: string): JWTUser | null {
    if (!token) {
      console.error("No token provided");
      return null;
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return null;
    }

    try {
      // Remove 'Bearer ' if present
      const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Debug: Log token details
      console.log("Token to decode:", actualToken.substring(0, 50) + "...");
      console.log("Token parts count:", actualToken.split('.').length);
      
      // Check if token has the correct JWT structure (3 parts separated by dots)
      if (actualToken.split('.').length !== 3) {
        console.error("Token doesn't have correct JWT structure (should have 3 parts)");
        return null;
      }

      const decoded = JWT.verify(actualToken, JWT_SECRET) as JWTUser;
      console.log("Successfully decoded token for user:", decoded.id);
      return decoded;
      
    } catch (error) {
      if (error instanceof JWT.JsonWebTokenError) {
        console.error("Invalid token:", error.message);
        console.error("Full error:", error);
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