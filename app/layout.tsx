import React from 'react';
import './globals.css';
import type { ReactNode } from 'react';
import { loadSiteData, loadContactsData, loadHeaderData } from '../lib/loadData';
// Comment out client components
// import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, ShoppingBag, User, Heart, Phone, Search, Menu, Facebook, Instagram, Twitter, Mail, MapPin, LogIn, UserPlus } from 'lucide-react';
import { HeaderVariant1 } from '@/components/header-variants/HeaderVariant1';
import { HeaderVariant2 } from '@/components/header-variants/HeaderVariant2';
import { HeaderVariant3, HeaderButton } from '@/components/header-variants/HeaderVariant3';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/CartDrawer';
import { cn } from '@/lib/utils';
import { fontSans } from '../src/styles/fonts';

export async function generateMetadata() {
  const site = await loadSiteData();
  // Determine the base URL (replace with environment variable for production)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006'; 
  return {
    metadataBase: new URL(baseUrl), // Added metadataBase
    title: site.meta.title,
    description: site.meta.description,
    keywords: site.meta.keywords,
    openGraph: {
      images: ['/generated/meta/og_image.webp'],
    },
  };
}

// Map of Header component variants
const headerVariantComponents: { [key: string]: React.ComponentType<any> } = {
  HeaderVariant1: HeaderVariant1,
  HeaderVariant2: HeaderVariant2,
  HeaderVariant3: HeaderVariant3,
  // Add StickyModernHeader if implemented, or map it to one of the above
  StickyModernHeader: HeaderVariant1, // Example: Mapping StickyModernHeader to HeaderVariant1
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const site = await loadSiteData();
  const contacts = await loadContactsData();
  const ui = site.ui || {};
  const footerData = site.footer || {}; // Get footer data from site object

  // --- Use header data directly from site object --- 
  const headerData = site.header; // Assuming loadSiteData correctly merged it

  // Determine Header Component based on headerData variant
  const headerVariantName = headerData?.variant || 'HeaderVariant1';
  const HeaderComponent = headerVariantComponents[headerVariantName] || HeaderVariant1;

  // Prepare props: Pass headerData directly if it exists, otherwise pass defaults
  const headerProps = headerData 
    ? { ...headerData } 
    : {
        variant: "HeaderVariant1" as const,
        logoUrl: '/placeholder.svg', 
        navigationItems: [], 
        ctaButton: undefined 
      }; 

  // Determine the current theme
  const currentTheme = site?.layout?.theme || 'light'; // Default to 'light' if not specified

  // --- DEBUG LOGGING START ---
  console.log('[RootLayout Build Log] Starting render...');
  console.log('[RootLayout Build Log] Site Data:', !!site);
  console.log('[RootLayout Build Log] Contacts Data:', !!contacts);
  console.log('[RootLayout Build Log] Header Data:', !!headerData);
  console.log('[RootLayout Build Log] Footer Data:', !!footerData);
  // console.log('[RootLayout Build Log] Selected Header Variant:', headerVariantName);
  // --- DEBUG LOGGING END ---

  return (
    <html lang={site?.meta?.language || 'th'} data-theme={currentTheme} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/generated/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <base href="./" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <HeaderComponent {...headerProps} />
        <CartDrawer />

        <div className="flex min-h-screen flex-col pt-14"> {/* Adjusted padding top */}
           {/* Ensure main content area doesn't overlap with sticky header */}
          <div className="flex flex-1">
            {/* Sidebar remains for potential mobile nav triggered differently or other uses */}
            {/* The new Headers handle their own mobile menus */}
            {/* 
            <Sidebar>
              <SidebarBody>
                ...
              </SidebarBody>
            </Sidebar>
            */}
            
            <div className="flex-1">
              {/* --- DEBUG: Rendering children --- */}
              {children}
              {/* --- DEBUG: Finished rendering children --- */}
              
              {/* Footer */}
              {/* --- DEBUG: Rendering Footer --- */}
              <footer className="bg-muted text-muted-foreground mt-16">
                <div className="container mx-auto px-4 py-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Колонка 1: О компании */}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{site.meta?.title}</h3>
                      <p className="text-sm mb-4">{site.meta?.description}</p>
                      <div className="flex space-x-4">
                        {footerData.social_media?.map((sm: any) => (
                          <a key={sm.title} href={sm.url} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                            {sm.title}
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    {/* Колонка 2: Покупателям */}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{site.ui?.customerService || "บริการลูกค้า"}</h3>
                      <ul className="space-y-2 text-sm">
                        {footerData.links?.map((link: any) => (
                          <li key={link.url}>
                            <Link href={link.url} className="hover:text-primary transition-colors">
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Колонка 3: Категории */}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{site.ui?.categoriesSectionTitle || "หมวดหมู่สินค้า"}</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/products?category=herbal-tea" className="hover:text-primary transition-colors">
                            ชาสมุนไพรแท้
                          </Link>
                        </li>
                        <li>
                          <Link href="/products?category=health-tea" className="hover:text-primary transition-colors">
                            ชาเพื่อสุขภาพ
                          </Link>
                        </li>
                        <li>
                          <Link href="/products?category=ready-to-drink" className="hover:text-primary transition-colors">
                            ชาชงสำเร็จ
                          </Link>
                        </li>
                        <li>
                          <Link href="/products?category=gift-sets" className="hover:text-primary transition-colors">
                            ชุดของขวัญ
                          </Link>
                        </li>
                        <li>
                          <Link href="/products?category=tea-accessories" className="hover:text-primary transition-colors">
                            อุปกรณ์ชงชา
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Колонка 4: Контакты */}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{site.ui?.contactsSectionTitle || "ติดต่อเรา"}</h3>
                      <ul className="space-y-3 text-sm">
                        {contacts?.address && (
                          <li className="flex items-start">
                            <MapPin className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span>{contacts.address}</span>
                          </li>
                        )}
                        {contacts?.phone && (
                          <li className="flex items-center">
                            <Phone className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            <a href={`tel:${contacts.phone}`} className="hover:text-primary transition-colors">
                              {contacts.phone}
                            </a>
                          </li>
                        )}
                        {contacts?.email && (
                          <li className="flex items-center">
                            <Mail className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            <a href={`mailto:${contacts.email}`} className="hover:text-primary transition-colors">
                              {contacts.email}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t border-border mt-12 pt-8 text-center text-xs">
                    <p>{footerData?.copyright || `© ${new Date().getFullYear()} ${site.meta?.title}`}</p>
                  </div>
                </div>
              </footer>
              {/* --- DEBUG: Finished rendering Footer --- */}
            </div>
          </div>
        </div>
        {/* Remove CartDrawer completely (even commented one) */}
        {/* --- DEBUG: Finished render --- */}
      </body>
    </html>
  );
}