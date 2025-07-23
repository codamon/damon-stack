import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Providers } from "./providers";
import { Layout } from "../components";
import { WebVitals } from "../components/WebVitals";
import { seoUtils, SEO_DEFAULTS, type MetadataBase } from '@damon-stack/shared';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 手动创建metadata以避免类型冲突
export const metadata: Metadata = {
  title: 'Damon Stack - 现代化全栈开发平台',
  description: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台，提供完整的企业级解决方案',
  keywords: 'Next.js, React, TypeScript, Mantine, tRPC, 全栈开发, 企业级, 开发平台',
  openGraph: {
    type: 'website',
    title: 'Damon Stack - 现代化全栈开发平台',
    description: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台，提供完整的企业级解决方案',
    siteName: 'Damon Stack',
    locale: 'zh-CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Damon Stack - 现代化全栈开发平台',
    description: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台，提供完整的企业级解决方案',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        
        {/* 基础SEO meta标签 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 网站验证 */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="baidu-site-verification" content="your-baidu-verification-code" />
        
        {/* 性能优化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* PWA支持 */}
        <meta name="theme-color" content="#228be6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Damon Stack',
              url: 'https://damon-stack.com',
              description: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台，提供完整的企业级解决方案',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://damon-stack.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Damon Stack',
              url: 'https://damon-stack.com',
              logo: 'https://damon-stack.com/logo.png',
              description: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台，提供完整的企业级解决方案',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
        
        {/* Web Vitals 监控 */}
        <WebVitals />
      </body>
    </html>
  );
} 