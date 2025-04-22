'use client';
import React, { useEffect, useState } from 'react';
import { HeroVariant1 } from "@/components/hero-variants/HeroVariant1";
import { HeroAnimated } from "@/components/ui/animated-hero";
import { HeroVariant2 } from "@/components/hero-variants/HeroVariant2";
import { HeroVariant3 } from "@/components/hero-variants/HeroVariant3";
import { HeroVariant4 } from "@/components/hero-variants/HeroVariant4";
import { HeroVariant5 } from "@/components/hero-variants/HeroVariant5";
import { HeroVariant6 } from "@/components/hero-variants/HeroVariant6";
import { HeroVariant7 } from "@/components/hero-variants/HeroVariant7";
import { HeroVariant8 } from "@/components/hero-variants/HeroVariant8";
import { HeroVariant9 } from "@/components/hero-variants/HeroVariant9";
import { HeroVariant10 } from "@/components/hero-variants/HeroVariant10";
import { CategoriesSection } from '@/components/blocks/categories-section';
import { ReviewsVariant1 } from '@/components/reviews-variants/ReviewsVariant1';
import { CategoryGrid } from '@/components/ui/category-grid';
import { PromoBannerGrid } from '@/components/ui/promo-banner-grid';
import { ProductGridVariant1 } from '@/components/product-grid-variants/ProductGridVariant1';
import { ProductGridVariant2 } from '@/components/product-grid-variants/ProductGridVariant2';
import { ProductGridVariant3 } from '@/components/product-grid-variants/ProductGridVariant3';
import { CountdownBanner } from "@/components/sections/CountdownBanner";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { SimpleCtaBanner } from "@/components/sections/SimpleCtaBanner";
import { FAQSection } from "@/components/sections/FAQSection";
import ClientProductGridSection from '@/components/ClientProductGridSection';

const heroVariantComponents: Record<string, React.ComponentType<any>> = {
  HeroVariant1,
  HeroVariant2,
  HeroVariant3,
  HeroVariant4,
  HeroVariant5,
  HeroVariant6,
  HeroVariant7,
  HeroVariant8,
  HeroVariant9,
  HeroVariant10,
};

const sectionComponents: Record<string, React.ComponentType<any>> = {
  CountdownBanner: CountdownBanner,
  FeatureGrid: FeatureGrid,
  SimpleCta: SimpleCtaBanner,
  ProductGridVariant1: ProductGridVariant1,
  ProductGridVariant2: ProductGridVariant2,
  ProductGridVariant3: ProductGridVariant3,
  FAQSection: FAQSection,
  ReviewsVariant1: ReviewsVariant1,
};

export default function HomePage() {
  const [site, setSite] = useState<any>(null);
  const [heroData, setHeroData] = useState<any>(null);
  const [sectionsData, setSectionsData] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // --- Function to fetch and parse JSON with error handling ---
        const fetchAndCleanJson = async (url: string) => {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
            // Получаем данные напрямую как JSON
            return await res.json();
          } catch (parseError) {
            console.error(`Error parsing ${url}:`, parseError);
            // Если не удалось напрямую, пробуем с очисткой текста
            try {
              const res = await fetch(url);
              const text = await res.text();
              console.log(`Debug - Raw response for ${url}:`, text.substring(0, 100)); // Логируем для отладки
              
              // Удаляем возможный BOM символ, невидимые символы и экзотические пробелы
              let cleanedText = text.replace(/^\uFEFF/, ''); // BOM
              cleanedText = cleanedText.replace(/[\u2000-\u200F]/g, ' '); // Экзотические пробелы
              
              // Удаляем любые символы после последней закрывающей скобки
              const lastBraceIndex = cleanedText.lastIndexOf('}');
              const lastBracketIndex = cleanedText.lastIndexOf(']');
              const lastValidCharIndex = Math.max(lastBraceIndex, lastBracketIndex);
              
              if (lastValidCharIndex !== -1) {
                cleanedText = cleanedText.substring(0, lastValidCharIndex + 1);
              }
              
              console.log(`Debug - Cleaned text for ${url}:`, cleanedText.substring(0, 100)); // Логируем для отладки
              return JSON.parse(cleanedText);
            } catch (error) {
              console.error(`Failed to parse ${url} after cleanup:`, error);
              throw new Error(`Failed to parse ${url}`);
            }
          }
        };

        // First load site configuration to determine hero variant
        const siteJson = await fetchAndCleanJson('/content/site.json');
        setSite(siteJson);
        
        // Determine hero variant from site.json
        const heroVariant = siteJson?.layout?.hero?.variant || 'HeroVariant1';
        const heroVariantNumber = heroVariant.replace('HeroVariant', '');
        
        // Load hero, products in parallel
        const [heroData, productsData] = await Promise.all([
          // Load specific hero variant file based on site.json configuration
          fetchAndCleanJson(`/content/hero/hero-${heroVariantNumber}.json`).catch(err => { 
              console.error(`Failed to load hero-${heroVariantNumber}.json, falling back to hero.json:`, err);
              return fetchAndCleanJson('/content/hero/hero.json');
          }),
          fetchAndCleanJson('/generated/products/products.json').catch(err => { 
              console.error("Failed to load or parse products:", err); 
              return []; // Return empty array on product fetch error
          })
        ]);
        
        // Ensure the hero data has the correct variant if not already specified
        if (heroData && !heroData.variant) {
          heroData.variant = heroVariant;
        }
        
        setHeroData(heroData);
        setProducts(productsData);

        // --- Load all section files --- 
        // Список известных файлов секций (можно расширить)
        const sectionFiles = [
            'features.json',
            'sales-promotion.json',
            'product-grid-variant1.json',
            'reviews-1.json',
            'faq-section.json',
            // 'newsletter-signup.json' // Удален, так как это теперь отдельная страница
        ];

        const sectionPromises = sectionFiles.map(file => 
            fetchAndCleanJson(`/content/sections/${file}`)
              .catch(err => {
                  console.warn(`Failed to load or parse section ${file}:`, err);
                  return null; // Return null for failed sections
              })
        );
        
        const loadedSectionsRaw = await Promise.all(sectionPromises);
        const loadedSections = loadedSectionsRaw.filter(section => section !== null); // Убираем ошибки
        
        // Сортируем секции по order
        loadedSections.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        console.log("Loaded and sorted sections:", loadedSections); // <-- Добавлен лог
        setSectionsData(loadedSections);

      } catch (e: any) {
        console.error("Failed to fetch data for HomePage:", e);
        setError(e.message || "Failed to load page data");
        setSite(null); setHeroData(null); setSectionsData([]); setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (error) return <div>Error loading page: {error}</div>;
  
  if (!site || !heroData) {
      console.error("Render error: site or heroData is null after loading.", { site: !!site, heroData: !!heroData });
      return <div>Failed to load site data (Check console for details).</div>;
  }

  const ui = site.ui || {};
  // Use the variant from the actual hero data
  const heroVariantKey = heroData?.variant || site?.layout?.hero?.variant || 'HeroVariant1'; 
  const HeroComponent = heroVariantComponents[heroVariantKey] || heroVariantComponents.HeroVariant1; // Default to V1 if not found
  
  console.log("Rendering HomePage. Selected Hero Variant:", heroVariantKey);
  console.log("Rendering HomePage. Sections data:", sectionsData);

  return (
    <main className="min-h-screen bg-background font-sans flex flex-col">
      {HeroComponent ? (
        <HeroComponent {...heroData} />
      ) : (
        <div>Error: Hero component not found for variant {heroVariantKey || 'default'}</div>
      )}

      {sectionsData.map((section: any, index: number) => {
        console.log(`Mapping section ${index}:`, section);
        const SectionComponent = sectionComponents[section.type];
        console.log(`  - Found component for type '${section.type}':`, !!SectionComponent);
        if (!SectionComponent) {
          return <div key={index}>Error: Unknown section type: {section.type}</div>;
        }

        let sectionProps: any = { ...section };

        if (section.type.startsWith("ProductGridVariant")) {
           const limit = section.limit || 3; 
           sectionProps.products = products.slice(0, limit);
          }
        
        if (section.type === "ProductGridVariant1") {
          return <ClientProductGridSection key={index} {...sectionProps} buttonText={ui.addToCart || "Добавить в корзину"} />;
        }

        return <SectionComponent key={index} {...sectionProps} />;
      })}
    </main>
  );
}