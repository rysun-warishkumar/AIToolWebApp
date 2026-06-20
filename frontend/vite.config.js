import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || 'http://localhost:5173'
  const gaId = env.VITE_GA_MEASUREMENT_ID?.trim()
  const googleVerification = env.VITE_GOOGLE_SITE_VERIFICATION?.trim()

  const gaScripts = gaId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>`
    : ''

  const verificationMeta = googleVerification
    ? `<meta name="google-site-verification" content="${googleVerification}" />`
    : ''

  return {
    plugins: [
      react(),
      {
        name: 'inject-html-env',
        transformIndexHtml(html) {
          let out = html.replaceAll('__SITE_URL__', siteUrl.replace(/\/$/, ''))
          if (verificationMeta) {
            out = out.replace('</head>', `    ${verificationMeta}\n  </head>`)
          }
          if (gaScripts) {
            out = out.replace('</head>', `    ${gaScripts}\n  </head>`)
          }
          return out
        },
      },
    ],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/sitemap.xml': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
    },
  }
})
