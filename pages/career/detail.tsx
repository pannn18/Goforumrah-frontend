import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ArticleCard from '@/components/cards/articleCard'
import featuredBlog1 from '@/assets/images/featured_blog_1.png'
import featuredBlog2 from '@/assets/images/featured_blog_2.png'
import featuredBlog3 from '@/assets/images/featured_blog_3.png'
import featuredBlog4 from '@/assets/images/featured_blog_4.png'
import featuredBlog5 from '@/assets/images/featured_blog_5.png'

const Home = () => {  
  return (
    <Layout>
      <Navbar showCurrency={true} />

      <main className="blog-detail">        
        <BlogDetail />
        <RelatedAticles />
      </main>

      <Footer />
    </Layout>
  )
}

const BlogDetail = () => {
  return(
    <section className="">
      <div className="container"> 
        <div className="blog-detail__wrapper">
          <BlurPlaceholderImage className="blog-detail__thumbnail" src={featuredBlog1} alt="Blog Detail Cover" width={794} height={412} />                        
          <div className="blog-detail__header">
            <div className="blog-detail__breadcrumb">
              <Link className="blog-detail__breadcrumb--link" href="/blog">Article</Link>
              <p>/</p>      
              <p className="blog-detail__breadcrumb--current">Three Festivals to Experience in Saudi Arabia</p>
            </div>
            <div className="blog-detail__header-text">
              <h1 className="blog-detail__header-title">Three Festivals to Experience in Saudi Arabia</h1>
              <p className="blog-detail__header-subtitle">December 18, 2022 06:00 AM</p>
            </div>
            <div className="blog-detail__header-social">
              <Link href="#" className="blog-detail__header-social-item"><SVGIcon src={Icons.Instagram} width={18} height={18} /></Link>
              <Link href="#" className="blog-detail__header-social-item"><SVGIcon src={Icons.Twitter} width={18} height={18} /></Link>
              <Link href="#" className="blog-detail__header-social-item"><SVGIcon src={Icons.Facebook} width={18} height={18} /></Link>
            </div>
          </div>
          <p className="blog-detail__paragraph">
            With a long history that goes back thousands of years, the Kingdom of Saudi Arabia is home to a number of cultural festivals 
            that date back centuries. Many visitors will want to plan a visit around one of these event. Here are three that stand out.
          </p>
          <div className="blog-detail__box blog-detail__box--row">
            <BlurPlaceholderImage className="blog-detail__box-thumbnail" src={featuredBlog2} alt="Blog Detail Image 1" width={285} height={259} />                        
            <div className="blog-detail__box-content">
              <h4 className="blog-detail__box-title">Janadriyah National Festival</h4>
              <p className="blog-detail__box-desc">
                This is one of the kingdom's largest festivals, celebrating Saudi Arabia's culture and heritage. 
                The event takes place over two weeks and includes events such as camel races, folklore art shows, poetry readings and more. 
                Artisans and poets come from around the country to showcase their work.
              </p>
              <p className="blog-detail__box-quote">*Dates are a large part of Saudi Arabia's food culture, incorporated into wines, entrees and desserts. (photo via Saudi Tourism Authority)</p>
            </div>
          </div>
          <div className="blog-detail__box">
            <h4 className="blog-detail__box-title">The Buraidah Date Festival</h4>
            <p className="blog-detail__box-desc">
              The Buraidah Date Festival celebrates all things dates. The festival, which takes place annually, is one of the biggest 
              date markets in the world, offering more than 30 varieties and byproducts such as molasses, dough, sugar, jam, and chocolate. 
              The festival begins in the month of August and lasts for approximately three months.
            </p>
          </div>
          <div className="blog-detail__box">
            <h4 className="blog-detail__box-title">Riyadh Spring Festival</h4>
            <p className="blog-detail__box-desc">
              This festival attracts more than 150,000 people to Riyadh and showcases more than 1 million flowers of a wide-ranging variety. 
              It highlights the beauty of the season as well as the natural resources of the kingdom while also providing ample time for families 
              to explore and enjoy the outdoors together. Visitors can see ornamental plants, gardens, landscaping and architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const RelatedAticles = () => {    
  return (
    <section className="">
      <div className="container">
        <div className="section-heading">
          <h3 className="section-heading__title">Related your articles</h3>                    
        </div>
        <div className="blog-detail__related-list row gx-4 gy-5">
            <div className="col-3">
              <ArticleCard
                image={featuredBlog2}
                title="8 things to know before visiting Saudi Arabia"              
                linkURL="#" />
            </div>
            <div className="col-3">
              <ArticleCard
                image={featuredBlog3}
                title="Things To Do In Madinah! "
                linkURL="#" />
            </div>
            <div className="col-3">
              <ArticleCard
                image={featuredBlog4}
                title="The top 10 places to celebrate Islamic New year"
                linkURL="#" />
            </div>
            <div className="col-3">
              <ArticleCard
                image={featuredBlog5}
                title="Makkah 2023 Top Things to Do"
                linkURL="#" />
            </div>
          </div>
        <div className="blog__explore-button">
          <Link href="#" className="link-green-01">
            <div>Read all blogs</div>
            <SVGIcon src={Icons.ArrowCircleRight} width={24} height={24} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Home