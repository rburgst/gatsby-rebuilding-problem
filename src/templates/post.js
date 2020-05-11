import React, { Fragment } from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

//import { Row, Col, Divider, Tag } from "antd"
// import SiteLayout from "../components/SiteLayout"
// import CategoriesWidget from "../components/CategoriesWidget"
// import RecentCommentsWidget from "../components/RecentCommentsWidget"
// import RecentPostsWidget from "../components/RecentPostsWidget"
// import PostEntryMeta from "../components/PostEntryMeta"
import Seo from "../components/Seo"

// const renderTermNodes = (nodes, title) => (
//   <div>
//     {title}
//     {` `}
//     {nodes.map(term => (
//       <Tag>{term.name}</Tag>
//     ))}
//   </div>
// )

// const renderTerms = (categoryNodes = [], tagNodes = []) => (
//   <Fragment>
//     <Divider />
//     {categoryNodes ? renderTermNodes(categoryNodes, `Categories: `) : null}
//     {tagNodes && tagNodes.length ? renderTermNodes(tagNodes, `Tags: `) : null}
//   </Fragment>
// )

const Post = props => {
  const {
    location,
    data: {
      wpgraphql: { post },
    },
  } = props
  const { title, content, featuredImage } = post
  return (
    <div location={location}>
      <Seo title={`${post.title}`} />
      <h1>{title}</h1>
      <pre>{JSON.stringify(featuredImage, null, 2)}</pre>
      {featuredImage &&
        featuredImage.mediaItemUrlSharp &&
        featuredImage.mediaItemUrlSharp.childImageSharp && (
          <>
            <Img
              style={{ maxWidth: "150px" }}
              fluid={featuredImage.mediaItemUrlSharp.childImageSharp.fluid}
            />
          </>
        )}
    </div>
  )
}

export default Post

export const pageQuery = graphql`
  query GET_POST($id: ID!) {
    wpgraphql {
      post(id: $id) {
        title
        content
        uri
        featuredImage {
          sourceUrl
          mediaItemUrlSharp {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
                presentationWidth
              }
            }
          }
        }
        author {
          name
          slug
          avatar {
            url
          }
        }
        tags {
          nodes {
            name
            link
          }
        }
        categories {
          nodes {
            name
            link
          }
        }
      }
    }
  }
`
