import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * The shape of the returned object in the OAuth providers' profile callback, available in the jwt and session callbacks, or the second parameter of the session callback, when using a database.
   */
  interface User {
    token?: any
    id_customer?: string | number
    role?: string
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role */
      role?: string
      /** The user's access token */
      accessToken?: any
    } & DefaultUser
  }



  interface JWT {
    /** The user's role */
    role?: 'user' | 'admin'
    /** The user's access token */
    accessToken?: string
  }
}