import { Familjen_Grotesk, Inter, Courier_Prime } from 'next/font/google'

const headline_font = Familjen_Grotesk({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  adjustFontFallback: false,
})

const body_font = Inter({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
})

const secondary_font = Courier_Prime({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
  adjustFontFallback: false,
})

import "./globals.css";

import "@styles/css/plugins/bootstrap.min.css";
import "@styles/css/plugins/swiper.min.css";
import "@styles/css/plugins/font-awesome.min.css";
import "@styles/css/plugins/magnific-popup.css";
import '@styles/scss/style.scss';

import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

import AppData from "@data/app.json";
import GoogleAnalytics from "@components/GoogleAnalytics";
import ResumeViewer from "@components/ResumeViewer";
import ImageView from "@components/ImageView";
import PagesLayouts from "@layouts/site/Index";
import { cssVars, themeBoot, themeCss } from "@design/tokens";

const siteUrl = "https://www.davidnallen.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
		default: AppData.settings.siteName,
		template: "%s | " + AppData.settings.siteName,
	},
  description: AppData.settings.siteDescription,
  keywords: AppData.settings.siteKeywords,
  authors: [{ name: "David N. Allen", url: siteUrl }],
  creator: "David N. Allen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: AppData.settings.siteName,
    title: "David N. Allen — Senior Front-end Engineer & CRO",
    description: AppData.settings.siteDescription,
    images: [
      {
        url: "/img/me.jpg",
        width: 800,
        height: 1000,
        alt: "David N. Allen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David N. Allen — Senior Front-end Engineer & CRO",
    description: AppData.settings.siteDescription,
    images: ["/img/me.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David N. Allen",
  "url": siteUrl,
  "image": `${siteUrl}/img/me.jpg`,
  "jobTitle": "Senior Front-end Engineer",
  "description": AppData.settings.siteDescription,
  "email": "david@davidnallen.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lakewood",
    "addressRegion": "CO",
    "addressCountry": "US"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Art Institute International"
  },
  "knowsAbout": [
    "React",
    "Next.js",
    "JavaScript",
    "CSS",
    "SCSS",
    "Sass",
    "Figma",
    "GTM",
    "CRO",
    "Conversion rate optimization",
    "Front-end development",
    "Membership flows",
    "Webinar flows"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/david-allen-a528a74/",
    "https://x.com/DavidAl66448560",
    "https://www.facebook.com/DavidNAllenDesign/"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Simpler Trading",
    "url": "https://www.simplertrading.com"
  }
};

const Layouts = ({
  children
}) => {
  return (
    <html lang="en" data-theme="light" className={`${headline_font.variable} ${body_font.variable} ${secondary_font.variable}`} style={cssVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="default--scrolling">
        <GoogleAnalytics />
        <ResumeViewer />
        <ImageView />
        {/* app */}
        <div className="dna-app">
          <PagesLayouts>{children}</PagesLayouts>
        </div>
        {/* app end */}
      </body>
    </html>
  );
};
export default Layouts;
