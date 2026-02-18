import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { BlogPageSearchBar } from '@/components/pages/home/searchBar'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ArticleCard from '@/components/cards/articleCard'
import placeholder from '@/public/images/placeholder.svg'
import headerCoverBlog from '@/assets/images/hero_blog_cover.png'
import featuredBlog1 from '@/assets/images/featured_blog_1.png'
import featuredBlog2 from '@/assets/images/featured_blog_2.png'
import featuredBlog3 from '@/assets/images/featured_blog_3.png'
import featuredBlog4 from '@/assets/images/featured_blog_4.png'
import featuredBlog5 from '@/assets/images/featured_blog_5.png'
import exploreCategories1 from '@/assets/images/explore_categories_1.png'
import exploreCategories2 from '@/assets/images/explore_categories_2.png'
import exploreCategories3 from '@/assets/images/explore_categories_3.png'
import exploreCategories4 from '@/assets/images/explore_categories_4.png'
import exploreCategories5 from '@/assets/images/explore_categories_5.png'
import exploreCategories6 from '@/assets/images/explore_categories_6.png'
import exploreCategories7 from '@/assets/images/explore_categories_7.png'
import exploreCategories8 from '@/assets/images/explore_categories_8.png'
import blogCtaImagery from '@/assets/images/blog_cta_imagery.png'

import useFetch from '@/hooks/useFetch'
import { ok } from 'assert'
import { callAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'

const Home = ({blogs, blogCategories}) => {  

  return (
    <Layout>
      <Navbar showCurrency={true} />

      <main className="blog">        
        <BlogHero />
        <BlogShowcase blogs={blogs}/>
        <ExploreCategories blogs={blogs} blogCategories={blogCategories}/>    
        <BlogCta />    
      </main>

      <Footer />
    </Layout>
  )
}

const BlogHero = () => {
  const router = useRouter()
  const {search, filter} = router.query
  return(
    <header className="blog__header">
      <div className="blog__header-bg">
        <BlurPlaceholderImage src={headerCoverBlog} alt="Blog Cover Image" />  {/* <Image src={cover} alt={title} width={1440} placeholder="blur" blurDataURL={Images.Placeholder} /> */}
        <div className="blog__header-bg-overlay-shadow" />
      </div>
      <div className="container">
        <div className="blog__header-content">
          
          <h1 className="heading">Discover your travel suggestions</h1>
          <p className="subheading">Search low prices on hotels, homes and much more...</p>
        </div>
      </div>
      <div className="blog__header-form">
        <div className="container">
          <BlogPageSearchBar search={search} filter={filter}/>
        </div>
      </div>
    </header>
  )
}

const BlogShowcase = ({blogs}) => {

  const blogsData = blogs.slice(0, 5)
  const blogsList = blogsData.slice(1)
  const words = blogsData[0].content.split(' ')
  const getText = words.slice(0, 15).join(' ')
  const excerpt = `${getText}...`
  
  return (
    <section>
      <div className="container">
        <div className="blog__showcase">

          <div className="blog__showcase-main" key={blogsData[0].index}>
            <BlurPlaceholderImage className="blog__showcase-main-imagery" src={blogsData[0].title_icon || placeholder} alt="Main Blog Thumbnail" /> 
            <div className="blog__showcase-main-content">
              <div className="blog__showcase-main-text">
                <h3 className="blog__showcase-main-title">{blogsData[0].title}</h3>
                <p className="blog__showcase-main-subtitle">{excerpt}</p>
              </div>
              <Link className="blog__showcase-main-button" href={`/blog/detail?id=${blogsData[0].id_blog}`}>Read more</Link>
            </div>
          </div>
          
          <div className="blog__showcase-list row gx-4 gy-5">
            {blogsList.map((item, index) => (  
              <div className="col-lg-3 col-md-4 col-sm-12" key={index}>
                <ArticleCard
                  image={item.title_icon || placeholder}
                  title={item.title}              
                  linkURL={`/blog/detail?id=${item.id_blog}`} />
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  )
}

const ExploreCategories = ({blogs, blogCategories}) => {
  
  const blogsData = blogs
  const categoriesData = blogCategories

  const [selectedTab, setSelectedTab] = useState('All');
  const [tabs, setTabs] = useState({});
  const [numBlogsToShow, setNumBlogsToShow] = useState(8);


  if (categoriesData && blogsData && Object.keys(tabs).length === 0) {
    const formattedTabs = {
      'All': blogsData.map(blog => ({
        image: blog.title_icon || placeholder,
        title: blog.title,
        linkURL: `/blog/detail?id=${blog.id_blog}`,
      })),
    };

    categoriesData.forEach(category => {
      const categoryBlogs = blogsData.filter(blog => blog.id_blog_category === category.id_blog_category);
      formattedTabs[category.name] = categoryBlogs.slice(0, 8).map(blog => ({
        image: blog.title_icon || placeholder,
        title: blog.title,
        linkURL: `/blog/detail?id=${blog.id_blog}`,
      }));
    });

    setTabs(formattedTabs);
  }

  const handleReadMore = () => {
    setNumBlogsToShow(prev => prev + 8);
  }

  return (
    <section className="blog__explore">
      <div className="container">
        <div className="section-heading">
          <h3 className="section-heading__title">Explore Your Categories</h3>
          <div className="section-heading__description">Know your destination like your own city.</div>
          <div className="section-heading_description section-heading_description--mt-lg align-self-stretch">
            <div className="blog__explore-tabs-menu">
              {Object.keys(tabs).map((tab, index) => (
                <button
                  key={index}
                  className={`btn ${tab === selectedTab ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTab(tab);
                    setNumBlogsToShow(8);
                  }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="blog__articles row g-4">
          {tabs[selectedTab]?.length > 0 ? (
            tabs[selectedTab]?.slice(0, numBlogsToShow).map((blog, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-12">
                <ArticleCard {...blog} />    
              </div>
            ))
          ) : (
            <div style={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
              We're sorry, but we couldn't find any featured blogs on {selectedTab}. It seems that there are no blogs currently published.
            </div>
          )}
        </div>
        
        {tabs[selectedTab]?.length >= numBlogsToShow ? 
        <div className="blog__explore-button">
        <a className="link-green-01" onClick={handleReadMore}>
          <div>Show more</div>
          <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
        </a>
        </div> :
        ''
        }

        
      </div>
    </section>
  );  
};

const BlogCta = () => {
  return(
    <section className="blog__cta">
      <div className="container">
        <div className="blog__cta-banner">
          <div className="blog__cta-imagery">
            <BlurPlaceholderImage src={blogCtaImagery} width={651} height={382} alt="Blog CTA Image" /> 
          </div>
          <div className="blog__cta-text">
            <h1 className="blog__cta-text-title">Save time and save your money</h1>
            <p className="blog__cta-text-subtitle">Lets Login and we will provide a special offer for you</p>
          </div>
          <Link className="btn btn-success rounded-pill blog__cta-button" href="/search/hotels">Search Hotel</Link>
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps() {
  const {data: blogs} = await callAPI(`/blog/show`, 'POST', {}, false)
  const {data: blogCategories} = await callAPI(`/blog-category/show`, 'POST')
  
  return {
    props: {
      blogs: blogs,
      blogCategories: blogCategories
    },
  };
}

export default Home