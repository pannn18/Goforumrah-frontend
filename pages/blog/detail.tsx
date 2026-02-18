import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ArticleCard from '@/components/cards/articleCard'
import placeholder from '@/public/images/placeholder.svg'
import featuredBlog2 from '@/assets/images/featured_blog_2.png'
import featuredBlog3 from '@/assets/images/featured_blog_3.png'
import featuredBlog4 from '@/assets/images/featured_blog_4.png'
import featuredBlog5 from '@/assets/images/featured_blog_5.png'
import { callAPI } from '@/lib/axiosHelper'


const Home = ({blogData, relatedArticles}) => {  
  return (
    <Layout>
      <Navbar showCurrency={true} />

      <main className="blog-detail">        
        <BlogDetail blogData={blogData}/>
        <RelatedArticles relatedArticles={relatedArticles} />
      </main>

      <Footer />
    </Layout>
  )
}

const BlogDetail = ({blogData}) => {

  // URL yang dibagikan (tidak dapat menggunakan url localhost:3000)
  const shareUrl = `https://goforumara-git-dev-illiyinstudio.vercel.app/blog/detail?id=${blogData.id_blog}`;

  const shareToTwitter = () => {

    const tweetText = 'Lihat artikel keren ini!';
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(tweetText)}`;

    window.open(twitterShareUrl, '_blank');
  }

  const shareToFacebook = () => {

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    window.open(facebookShareUrl, '_blank');
  }
  
  return(
    <section className="">
      <div className="container"> 
        <div className="blog-detail__wrapper">
          <BlurPlaceholderImage className="blog-detail__thumbnail" src={blogData.title_icon || placeholder} alt="Blog Detail Cover" width={794} height={412} />                        
          <div className="blog-detail__header">
            <div className="blog-detail__breadcrumb">
              <Link className="blog-detail__breadcrumb--link" href="/blog">Article</Link>
              <p>/</p>      
              <p className="blog-detail__breadcrumb--current">{blogData.title}</p>
            </div>
            <div className="blog-detail__header-text">
              <h1 className="blog-detail__header-title">{blogData.title}</h1>
              <p className="blog-detail__header-subtitle">{blogData.formattedDate}</p>
            </div>
            <div className="blog-detail__header-social">
              <Link hidden href="#" className="blog-detail__header-social-item"><SVGIcon src={Icons.Instagram} width={18} height={18} /></Link>
              <Link onClick={shareToTwitter} href="#" className="blog-detail__header-social-item"><SVGIcon src={Icons.Twitter} width={18} height={18} /></Link>
              <Link onClick={shareToFacebook} href="#" className="blog-detail__header-social-item"><SVGIcon src={Icons.Facebook} width={18} height={18} /></Link>
            </div>
          </div>
          <p className="blog-detail__paragraph">{blogData.content}</p>
          
        </div>
      </div>
    </section>
  )
}

const RelatedArticles = ({relatedArticles}) => {   
  return (
    <section className="">
      <div className="container">
        <div className="section-heading">
          <h3 className="section-heading__title">Related your articles</h3>                    
        </div>
        <div className="blog-detail__related-list row gx-4 gy-5">

          {relatedArticles.map((item, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <ArticleCard
                image={item.title_icon || placeholder}
                title={item.title}
                linkURL={`/blog/detail?id=${item.id_blog}`} />
            </div>
          ))}
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

// Use getServerSideProps
export async function getServerSideProps(context) {
  const { id: id_blog } = context.query;

  const { data, ok, error } = await callAPI('/blog/show', 'POST', { id_blog });
  if (ok) {
    const formattedDate = new Date(data.datetime).toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric' 
    });

    const id_blog_category = data.id_blog_category;
    const relatedArticlesResponse = await callAPI('/blog/show', 'POST', { id_blog_category, 'limit': 4 });

    return {
      props: {
        blogData: {
          ...data,
          formattedDate
        },
        relatedArticles: relatedArticlesResponse.ok ? relatedArticlesResponse.data : []
      },
    };
  } else {
    return {
      notFound: true
    }
  }
}

export default Home