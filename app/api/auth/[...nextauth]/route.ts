import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    // Ask for Email Reading permissions
                    scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify",
                },
            },
        }),
    ],

    callbacks: {
        async session({ session, token }: any) {
            session.accessToken = token.accessToken
            return session
        },
        async jwt({ token, account}: any) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        }
    }
})

export { handler as GET, handler as POST}