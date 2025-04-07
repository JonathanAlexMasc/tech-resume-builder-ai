import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    // Configure one or more authentication providers
    /*
    The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;
    For production: https://{YOUR_DOMAIN}/api/auth/callback/google
    For development: http://localhost:3000/api/auth/callback/google
    */
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
}

export default NextAuth(authOptions)