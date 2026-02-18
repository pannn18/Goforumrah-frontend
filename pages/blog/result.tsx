import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { StaticImageData } from 'next/image'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { BlogPageSearchBar } from '@/components/pages/home/searchBar'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import placeholder from '@/public/images/placeholder.svg'
import headerCoverBlog from '@/assets/images/hero_blog_cover.png'
import exploreCategories1 from '@/assets/images/explore_categories_1.png'
import exploreCategories2 from '@/assets/images/explore_categories_2.png'
import exploreCategories3 from '@/assets/images/explore_categories_3.png'
import exploreCategories4 from '@/assets/images/explore_categories_4.png'
import exploreCategories5 from '@/assets/images/explore_categories_5.png'
import exploreCategories6 from '@/assets/images/explore_categories_6.png'
import exploreCategories7 from '@/assets/images/explore_categories_7.png'
import exploreCategories8 from '@/assets/images/explore_categories_8.png'

import useFetch from '@/hooks/useFetch'
import { callAPI } from '@/lib/axiosHelper'

const BlogResult = ({blogResult, search, filter}) => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
        <main className="blog">        
          <BlogHero search={search} filter={filter}/>          
          <BlogSearchResult blogResult={blogResult} search={search} filter={filter}/>     
        </main>
      <Footer />
    </Layout>
  )
}

const BlogHero = ({search, filter}) => {
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

const BlogSearchResult = ({blogResult, search, filter}) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (categories.length !== 0) return

    const getDataCategories = async () => {
  
      const {data,  error, ok} = await callAPI('/blog-category/show', 'POST')
      if (error) {
        console.log(error);
      }
      if (ok && data) {
        setCategories(data)
      }
    }

    getDataCategories()
  }, [categories.length])


  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id_blog_category === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  const titleExcerpt = (title) => {
    const words = title.split(' ');
    if (words.length > 7) {
      return words.slice(0, 7).join(' ') + '...';
    } else {
      return title;
    }
  }

  return(
    <section className='blog__result'>
      <div className='container'>
        <div className='blog__result-wrapper'>
        <span className='blog__result-summary'>
          {search 
            ? (filter
              ? <>Found {blogResult.length} post for <strong>“{search}”</strong> in <strong>“{filter}”</strong></>
              : <>Found {blogResult.length} post for <strong>“{search}”</strong></>)
            : (filter
              ? <>Found {blogResult.length} post in <strong>“{filter}”</strong></>
              : <>Found {blogResult.length} post</>)}
        </span>
          <div className='blog__result-wrapper'>
          {
              blogResult.map((result, index) => (
                <BlogResultCard
                  key={index}
                  thumbnail={result.title_icon || placeholder} 
                  category={getCategoryName(result.id_blog_category)}
                  title={titleExcerpt(result.title)} 
                  description={result.content} 
                  linkURL={`/blog/detail?id=${result.id_blog}`}
                />  
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

interface BlogSearchResultProps{
  thumbnail: StaticImageData | string
  title: string
  description?: string
  linkURL?: string
  category: string
}

const BlogResultCard = (props: BlogSearchResultProps) => {
  return(
    <div className='blog__result-card'>
      <BlurPlaceholderImage width={200} height={200} src={props.thumbnail} alt={props.title} className='blog__result-card__thumbnail' />
      <div className='blog__result-card__content'>
        <div className='blog__result-card__content-inner'>
          <span className='blog__result-card__content-label'>{props.category}</span>
          <h4 className='blog__result-card__content-title'>{props.title}</h4>
          <p className='blog__result-card__content-description'>{props.description}</p>
        </div>
        <Link href={props.linkURL} className='blog__result-card__content-link'>See More</Link>
      </div>
    </div>
  )
}

export default BlogResult

// Use getServerSideProps
export async function getServerSideProps(context) {
  const { search } = context.query;
  const { filter } = context.query
  let blogResult = []
  let idCategory = null

  const { data: categoryData, ok: categoryOk, error:categoryError } = await callAPI('/blog-category/show', 'POST');
  if (categoryOk) {
    const category = categoryData.find(item => item.name === filter)
    if (category) {
      idCategory = category.id_blog_category
    }
  }

  const { data, ok, error } = await callAPI('/blog/show', 'POST', {"search": search, "id_blog_category": idCategory}, false);
  if (ok) {
    blogResult = data
  }

  return {
    props: {
      blogResult: blogResult,
      search: search || '',
      filter: filter || ''
    },
  };
  
}