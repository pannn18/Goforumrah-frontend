import { useState, useEffect } from "react"
import { getSession, useSession } from "next-auth/react"
import Layout from "@/components/layout"

export default function ProtectedPage() {
  // const { data: session } = useSession()
  // const [content, setContent] = useState()

  // Fetch content from protected route
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch("/api/examples/protected")
  //     const json = await res.json()
  //     if (json.content) {
  //       setContent(json.content)
  //     }
  //   }
  //   fetchData()
  // }, [session])

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    context.res.writeHead(302, { Location: "/" })
    context.res.end()
    return {}
  }
  return {
    props: {
      user: session.user
    }
  }
}