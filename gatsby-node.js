/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { execute } = require("apollo-link")

const { makePromise } = require("apollo-link")

// You can delete this file if you're not using it
const createPosts = require(`./gatsby/createPosts`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { createHttpLink } = require("apollo-link-http")
const fetch = require("node-fetch")
const gql = require("graphql-tag")

const uri = process.env.GRAPHQL_ENDPOINT || "https://demo.wpgraphql.com/graphql"
const headers = {}

exports.createPages = async ({ actions, graphql }) => {
  await createPosts({ actions, graphql })
}

exports.sourceNodes = async ({ actions, getCache, store, reporter }) => {
  const { createNode } = actions
  const link = createHttpLink({
    uri,
    fetch,
    headers,
  })
  const query = gql`
    query FetchImages($after: String) {
      mediaItems(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          sourceUrl
        }
      }
    }
  `

  let hasNextPage
  let after
  do {
    console.log("fetching images from ", uri, query, after)
    const { data } = await makePromise(
      execute(link, { query, variables: { after } })
    )
    console.log("done fetching images from ", uri, query, after)
    await Promise.all(
      data.mediaItems.nodes.map(({ sourceUrl }) => {
        if (!sourceUrl || sourceUrl === "false") return Promise.resolve()
        return createRemoteFileNode({
          url: sourceUrl,
          parentNodeId: null,
          store,
          getCache,
          createNode,
          createNodeId: () => sourceUrl,
          httpHeaders: headers,
          reporter,
        })
      })
    )
    hasNextPage = data.mediaItems.pageInfo.hasNextPage
    after = data.mediaItems.pageInfo.endCursor
  } while (hasNextPage)
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    WPGraphQL_MediaItem: {
      mediaItemUrlSharp: {
        type: "File",
        resolve: (source, args, context) =>
          context.nodeModel.getNodeById({ id: source.sourceUrl, type: "File" }),
      },
    },
  })
}

// exports.createResolvers = ({ createResolvers }) => {
//   createResolvers({
//     MediaItem: {
//       localFile: {
//         type: "File",
//         resolve: (source, args, context) => context.nodeModel.getNodeById({ id: source.sourceUrl, type: "File" })
//       }
//     }
//   })
// }
