import { HelmetData } from 'react-helmet'

interface Template {
  helmet: HelmetData
  body: string
  data: unknown
}

export default ({ helmet, body, data }: Template): string => `
  <!DOCTYPE html>
  <html ${helmet.htmlAttributes.toString()}>
      <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
      </head>
      <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${body}</div>
      </body>
      <script>window.initialData = ${JSON.stringify(data)};</script>
      <script async src='/public/dist/index.js'></script>
  </html>
`
