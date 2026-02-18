import Layout from '@/components/layout'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  return (
    <>
      <Layout>
        <main className="py-5">
          <div className="container">
            <div className="row g-3 align-items-end mb-3">
              <div className="col-auto">
                <button className="btn btn-lg btn-success">Large Primary Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-success">Primary Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-success">Small Primary Button</button>
              </div>
            </div>
            <div className="row g-3 align-items-end mb-3">
              <div className="col-auto">
                <button className="btn btn-lg btn-outline-success">Large Primary Outline Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-success">Primary Outline Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-outline-success">Small Primary Outline Button</button>
              </div>
            </div>
            <div className="row g-3 align-items-end mb-3">
              <div className="col-auto">
                <button className="btn btn-lg btn-outline-success text-neutral-primary">Large Primary Outline Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-success text-neutral-primary">Primary Outline Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-outline-success text-neutral-primary">Small Primary Outline Button</button>
              </div>
            </div>
            <div className="row g-3 align-items-end mb-3">
              <div className="col-auto">
                <button className="btn btn-lg btn-outline-success text-white">Large Primary Outline Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-success text-white">Primary Outline Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-outline-success text-white">Small Primary Outline Button</button>
              </div>
            </div>
            <div className="row g-3 align-items-end mb-3">
              <div className="col-auto">
                <button className="btn btn-lg btn-primary">Large Blue Whale Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary">Blue Whale Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-primary">Small Blue Whale Button</button>
              </div>
            </div>
            <div className="row g-3 align-items-end mb-3">
              <div className="col-auto">
                <button className="btn btn-lg btn-secondary">Large Grey Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-secondary">Grey Button</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-secondary">Small Grey Button</button>
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-auto">
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <h4>Heading 4</h4>
                <h5>Heading 5</h5>
                <h6>Heading 6</h6>
                <p className="fs-xl">Paragraph Extra Large</p>
                <p className="fs-lg">Paragraph Large</p>
                <p>Paragraph</p>
                <p className="fs-sm">Paragraph Small</p>
                <p className="fs-xs">Paragraph Extra Small</p>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  )
}
