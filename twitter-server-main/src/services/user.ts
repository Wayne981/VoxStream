import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "./jwt";

interface GoogleTokenResult {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

class UserService {
    public static async verifyGoogleAuthToken(token: string) {
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set("id_token", token);

        const { data } = await axios.get<GoogleTokenResult>(
            googleOauthURL.toString(),
            {
                responseType: "json",
            }
        );

        // Check if user exists or create new one
        let user = await prismaClient.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageURL: data.picture,
                },
            });
            console.log("✅ New user created:", user);
        }

        // ✅ FIXED: await token generation
        const userToken = await JWTService.generateTokenForUser(user.id);
        return userToken;
    }

    public static getUserById(id: string) {
        return prismaClient.user.findUnique({ where: { id } });
    }

    public static followUser(from: string, to: string) {
        return prismaClient.follows.create({
            data: {
                follower: { connect: { id: from } },
                following: { connect: { id: to } },
            }
        });
    }

    public static unfollowUser(from: string, to: string) {
        return prismaClient.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: from,
                    followingId: to
                }
            }
        });
    }
}

export default UserService;
