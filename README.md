# Sample Gatsby wpgraphql demonstrating rebuilding issues

this is a sample repository to demonstrate a problem in gatsby when
using `yarn develop` (i.e. `gatsby develop`).

As soon as an image resolver is added, the pages get regenerated
many many times.

The image resolver is more or less the code documented at

https://www.gatsbyjs.org/docs/schema-customization/#feeding-remote-images-into-gatsby-image

To reproduce do the following

```bash
yarn install
yarn develop
```

now watch the output.

### Expected

the output

```
create POSTS ======== =
```

should only appear once.

### Actual

The pages are being regenerated 4 times.

It appears that the pages are being regenerated for every single image.

### Solution

A workaround is to use the `sourceNodes` lifecycle and load all images there.
Thanks a lot to [@sanderploegsma](https://github.com/sanderploegsma) for providing the correct solution!

More info can be found here:

- https://github.com/gatsbyjs/gatsby/issues/20083
- https://github.com/gatsbyjs/gatsby/issues/15906
- https://github.com/gatsbyjs/gatsby/issues/20083#issuecomment-626646103 (working workaround)
