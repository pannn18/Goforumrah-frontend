import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

const BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN
const ROLES = {
  customer: 'customer',
  agent: 'agent',
  admin: 'admin',
  'admin-hotel': 'hotel-business',
  'admin-car': 'car-business'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        role: { label: 'User Type', type: 'text' },
        type: { label: 'Login Type', type: 'text' },
        phone: { label: 'Phone Number', type: 'text' },
        code: { label: 'Verification Code', type: 'text' },
        email: { label: 'Email Address', type: 'email' },
        password: { label: 'Password', type: 'password' },
        useragent_info: { label: 'User Agent', type: 'text' },
        device_info: { label: 'Device Info', type: 'text' },
        location_info: { label: 'Location Info', type: 'text' },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${BASE_URL}/${ROLES?.[credentials.role] || 'customer'}/${credentials.type === 'phone' ? 'phone-login-verify' : 'login'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials.type === 'phone' ? {
              phone: credentials.phone,
              code: credentials.code
            } : {
              email: credentials.email,
              password: credentials.password,
              useragent_info: credentials?.useragent_info || '',
              device_info: credentials?.device_info || '',
              location_info: credentials?.location_info || '',
            }),
          })

          const { data, errors } = await res.json()

          if (errors) throw errors

          if (res.ok && data) {
            console.log('=== LOGIN RESPONSE DATA ===')
            console.log(JSON.stringify(data, null, 2))
            console.log('token field:', data?.token)
            console.log('access_token field:', data?.access_token)
            console.log('==========================')
            return { ...data, role: credentials.role }
          }

          throw 'User not found'
        } catch (error) {
          throw new Error(error)
        }
      },
    }),
    GoogleProvider({
      id: 'googleForCustomer',
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GoogleProvider({
      id: 'googleForAgent',
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      id: 'facebookForCustomer',
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    FacebookProvider({
      id: 'facebookForAgent',
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (['googleForCustomer', 'googleForAgent', 'facebookForCustomer', 'facebookForAgent'].includes(account?.provider)) {
        try {
          const res = await fetch(`${BASE_URL}/${['googleForCustomer', 'facebookForCustomer'].includes(account?.provider) ? 'customer' : 'agent'}/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, [`${['googleForCustomer', 'googleForAgent'].includes(account.provider) ? 'gsocial_ids' : 'fsocial_ids'}`]: user.id }),
          })

          const { data, errors } = await res.json()

          if (errors) throw errors

          if (res.ok && data) {
            return true
          }

          throw 'Unknown error'
        } catch (error) {
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        console.log('=== JWT USER OBJECT ===')
        console.log(JSON.stringify(user, null, 2))
        console.log('======================')
        token.id = user.id
        token.accessToken = user.token
        token.role = user.role
      }

      if (['googleForCustomer', 'googleForAgent', 'facebookForCustomer', 'facebookForAgent'].includes(account?.provider)) {
        try {
          const res = await fetch(`${BASE_URL}/${['googleForCustomer', 'facebookForCustomer'].includes(account?.provider) ? 'customer' : 'agent'}/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, [`${['googleForCustomer', 'googleForAgent'].includes(account.provider) ? 'gsocial_ids' : 'fsocial_ids'}`]: user.id }),
          })

          const { data, errors } = await res.json()

          if (errors) throw errors

          if (res.ok && data) {
            token.id = data.id
            token.accessToken = data?.token
            token.role = ['googleForCustomer', 'facebookForCustomer'].includes(account?.provider) ? 'customer' : 'agent'
          }
        } catch (error) {
          console.error(error)
        }
      }

      return token
    },
    async session({ session, token }) {
      return { user: { ...session.user, accessToken: token.accessToken, id: token.id, role: token.role }, expires: session.expires }
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  session: {
    maxAge: 60 * 60 * 24
  },
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)