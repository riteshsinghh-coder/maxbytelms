import Head from 'next/head';
import Script from 'next/script'; // Import the Script component
import NavBar from '../components/NavBar';
import Placed from '../components/Placed';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import PlacementPage from '../components/PlacementPage';
import Services from '../components/Services';
import PopularClass from '../components/PopularClass';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div>
      <Head>
        {/*
          Primary SEO Tags: These are critical for how your website appears in search results
          and how search engines understand your content.
        */}
        <title>MaxByte Placement Academy | Best IT, Accounts, Digital Marketing Institute & Placement in Faridabad</title>
        {/*
          Meta Description: This is often shown as the snippet under your title in search results.
          It should be compelling, accurate, and include relevant keywords to encourage clicks.
          Keep it concise (around 150-160 characters).
        */}
        <meta
          name="description"
          content="MaxByte Placement Academy offers the best IT, Accounts & Tally, and Digital Marketing courses with guaranteed job placements in Faridabad. Unlock your career potential with expert-led training. Voted top institute for career training in Faridabad!"
        />
        {/*
          Meta Keywords: While Google largely ignores this tag for ranking,
          it doesn't hurt to include relevant terms. Focus on natural language in content instead.
        */}
        <meta
          name="keywords"
          content="MaxByte Placement Academy, best institute in Faridabad, best placement academy in Faridabad, IT courses Faridabad, software training Faridabad, web development courses Faridabad, data science Faridabad, IT job placements Faridabad, accounts course Faridabad, Tally training Faridabad, digital marketing course Faridabad, SEO training Faridabad, career advancement Faridabad, job search Faridabad, Wipro, Infosys, Amazon, Flipkart, Google, Microsoft, Jobs in Delhi NCR, Software engineering training, Coding bootcamps Faridabad, Tech certifications, Internships Faridabad, IT training Faridabad, Employment opportunities Faridabad, Technology careers, Programming courses, Technical skills, Entry-level IT jobs, Web design courses, Cloud computing training, Networking courses, Full-stack development, UI/UX design, Mobile app development, Java, Python, JavaScript, HTML/CSS, DevOps, Artificial intelligence, Machine learning, Big data, Blockchain, Internet of Things, Virtual reality, Augmented reality, Game development, Digital marketing, Project management, Agile, Scrum, Remote work, Freelancing, Resume building, Interview preparation, Soft skills, Leadership development, Career counseling, Job placement, Talent acquisition, Staffing, Industry partnerships, Networking events, IT job fairs, Recruitment drives, Career progression, Upskilling, Reskilling, Continuing education, Lifelong learning, Curriculum, Mentorship, Alumni network, financial accounting courses, taxation courses, GST training, bookkeeping"
        />
        {/*
          Canonical Tag: This tells search engines the preferred version of a page.
          Crucial for preventing duplicate content issues, especially if your site
          can be accessed via multiple URLs (e.g., with/without www, with/without trailing slash).
          Ensuring consistency with your non-www domain.
        */}
        <link rel="canonical" href="https://maxbyteplacementacademy.in" />
        {/* Favicon: The small icon displayed in browser tabs. */}
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/*
          Viewport Meta Tag: Essential for responsive design. It ensures your website
          scales correctly across different devices (mobile, tablet, desktop).
        */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*
          Color Scheme Meta Tag: Helps browsers understand if your site supports
          light and dark modes, improving user experience.
        */}
        <meta name="color-scheme" content="light dark" />
        {/*
          Format Detection Meta Tag: Prevents mobile browsers from automatically
          formatting phone numbers, emails, or addresses as clickable links,
          which can sometimes interfere with custom styling or JavaScript.
        */}
        <meta name="format-detection" content="telephone=no, email=no, address=no" />


        {/*
          Open Graph Meta Tags (for social media sharing): These tags control how your
          website appears when shared on platforms like Facebook, LinkedIn, Twitter (via summary cards).
          Consistency with your canonical URL is important here too.
        */}
        <meta property="og:title" content="MaxByte Placement Academy | Top IT, Accounts & Digital Marketing Institute in Faridabad" />
        <meta property="og:description" content="Unlock your potential with MaxByte Placement Academy! Offering the best IT, Accounts & Tally, and Digital Marketing courses with guaranteed job placement support for a thriving career in Faridabad." />
        {/*
          og:image: The URL of an image that represents your content.
          Should be high-quality and at least 1200x630 pixels for best display.
          Ensuring consistency with your non-www domain.
        */}
        <meta property="og:image" content="https://maxbyteplacementacademy.in/assets/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/*
          og:url: The canonical URL of the page. Must match the <link rel="canonical">.
          Ensuring consistency with your non-www domain.
        */}
        <meta property="og:url" content="https://maxbyteplacementacademy.in" />
        <meta property="og:type" content="website" /> {/* 'website' for homepages */}
        <meta property="og:site_name" content="MaxByte Placement Academy" />

        {/*
          Schema.org Structured Data (JSON-LD) for Educational Organization:
          This provides search engines with detailed, structured information about your academy,
          its offerings, and contact details. This can lead to rich snippets in search results.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "MaxByte Placement Academy",
              // Ensure the main URL is consistent with non-www
              "url": "https://maxbyteplacementacademy.in",
              // Ensure the logo URL is consistent with non-www
              "logo": "https://maxbyteplacementacademy.in/assets/logo.png",
              "description": "MaxByte Placement Academy is the top IT, Accounts & Tally, and Digital Marketing training and placement institute in Faridabad, Haryana, India. We offer comprehensive courses and guaranteed job assistance to empower students for successful careers in technology, finance, and marketing. Your best choice for professional education and job placement in Faridabad.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "AP School Gali, Sector 23",
                "addressLocality": "Faridabad",
                "addressRegion": "Haryana",
                "postalCode": "121005",
                "addressCountry": "IN"
              },
              "telephone": "+917545840365",
              "email": "maxbyteplacement@gmail.com",
              "sameAs": [
                "https://www.instagram.com/maxbyteplacementacademy",
                "https://www.facebook.com/profile.php?id=61558540708282",
                // ACTION REQUIRED: REPLACE WITH YOUR ACTUAL YOUTUBE URL.
                // If you don't have one, remove this line.
               
                "https://www.youtube.com/channel/UCUOszJIYskBMjPTmYxr-f1A" // e.g., "https://www.youtube.com/channel/YOUR_CHANNEL_ID"
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "contactType": "enrollment",
                  "email": "maxbyteplacement@gmail.com",
                  "telephone": "+917545840365",
                  "description": "Enrollment and general inquiries for MaxByte Placement Academy",
                  "areaServed": "Faridabad",
                  "availableLanguage": ["en", "hi"]
                },
                {
                  "@type": "ContactPoint",
                  // Student portal URL is a subdomain, so it remains as is.
                  "@id": "https://app.maxbyteplacementacademy.in",
                  "contactType": "customer service",
                  "url": "https://wa.me/7545840365",
                  "description": "WhatsApp contact for quick support and inquiries",
                  "areaServed": "Faridabad",
                  "availableLanguage": ["en", "hi"]
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Training Courses & Placement Services",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Software Development Courses",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Full Stack Web Development",
                          // Ensure course URLs are consistent with non-www
                          "url": "https://maxbyteplacementacademy.in/course/3"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Python Programming"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Java Development"
                        }
                      }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Accounts & Finance Courses",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Accounts & Tally ERP 9 Training",
                          // Ensure course URLs are consistent with non-www
                          "url": "https://maxbyteplacementacademy.in/course/5"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Advanced Financial Accounting"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "GST & Taxation Course"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Basic Computer Course",
                          // Ensure course URLs are consistent with non-www
                          "url": "https://maxbyteplacementacademy.in/course/1"
                        }
                      }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Digital Marketing Courses",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Certified Digital Marketing Professional",
                          // Ensure course URLs are consistent with non-www
                          "url": "https://maxbyteplacementacademy.in/course/4"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "SEO & SEM Masterclass"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Course",
                          "name": "Social Media Marketing"
                        }
                      }
                    ]
                  },
                   {
                    "@type": "OfferCatalog",
                    "name": "Placement Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Guaranteed Job Placement"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Resume Building & Interview Preparation"
                        }
                      },
                       {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Career Counseling & Mentorship"
                        }
                      }
                    ]
                  }
                ]
              },
              "hasPart": [ // Adding student portal as a part of the main website
                {
                  "@type": "WebSite",
                  "name": "MaxByte Student Portal",
                  // This is a subdomain, so it remains as is.
                  "url": "https://app.maxbyteplacementacademy.in"
                }
              ]
            }),
          }}
        />
      </Head>

      {/* Google Analytics Global Site Tag using next/script */}
      {/*
        Using 'afterInteractive' strategy for Google Analytics ensures the script
        loads after the page is hydrated, which is a good balance for performance.
      */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-WCM4HJ7JL8"
      />
      <Script
        id="google-analytics-init" // Unique ID for the inline script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WCM4HJ7JL8');
          `,
        }}
      />

      {/* Your main page components */}
      <NavBar />
      <Hero />
      <PlacementPage />
      <Services />
      <PopularClass />
      <Testimonials />
      <Placed />
      <Footer />
    </div>
  );
}
