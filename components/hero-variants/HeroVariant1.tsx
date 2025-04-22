"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Reuse existing or define consistent prop types
interface HeroImage {
  src: string;
  alt: string;
}

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

interface HeroBadgeProps {
  text: string;
  action?: {
    text: string;
    href: string;
  };
}

interface HeroVariant1Props {
  badge?: HeroBadgeProps;
  title: string;
  description: string;
  actions?: HeroAction[]; // Made optional to align with schema
  image: HeroImage;
  backgroundStyle?: "light" | "dark";
  ratingText?: string; // Added for data-driven rating text
  floatingCardTitle?: string; // Added for data-driven floating card
  floatingCardDescription?: string; // Added for data-driven floating card
  floatingCardButtonText?: string; // Added for data-driven floating card
}

const ease = [0.16, 1, 0.3, 1];

export function HeroVariant1({
  badge,
  title,
  description,
  actions = [], // Keep default empty array
  image,
  backgroundStyle = "light",
  ratingText,
  floatingCardTitle,
  floatingCardDescription,
  floatingCardButtonText,
}: HeroVariant1Props) {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: 1.05,
        transition: { duration: 0.5, ease },
      });
    } else {
      controls.start({
        scale: 1,
        transition: { duration: 0.5, ease },
      });
    }
  }, [isHovered, controls]);

  // Ensure image src is valid
  const imageSrc = image?.src ? image.src : "/placeholder.png"; // Placeholder if image is missing
  const imageAlt = image?.alt || "Hero image";

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "overflow-hidden"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Badge */}
            {badge?.text && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <Badge variant="outline" className="inline-flex gap-2 px-4 py-1.5 text-sm">
                  <span className="text-muted-foreground">{badge.text}</span>
                  {badge.action?.text && badge.action?.href && (
                    <a href={badge.action.href} className="flex items-center gap-1 text-primary">
                      {badge.action.text}
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </Badge>
              </motion.div>
            )}

            {/* Title */}
            {title && (
              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
              >
                {title}
              </motion.h1>
            )}

            {/* Description */}
            {description && (
              <motion.p
                className="text-lg text-muted-foreground max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              >
                {description}
              </motion.p>
            )}

            {/* Actions */}
            {actions && actions.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-4 mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
              >
                {actions.map((action, index) => (
                  action.text && action.href && (
                    <Button
                      key={index}
                      variant={action.variant || "default"}
                      size="lg"
                      asChild
                      className="gap-2"
                    >
                      <a href={action.href}>
                        {action.icon}
                        {action.text}
                      </a>
                    </Button>
                  )
                ))}
              </motion.div>
            )}

            {/* Rating */}
            {ratingText && (
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease }}
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span>{ratingText}</span>
              </motion.div>
            )}
          </div>

          {/* Image */}
          <motion.div
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10"
              animate={controls}
            />
            <motion.div
              className="relative h-full w-full"
              animate={controls}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            
            {/* Floating elements - Made Data-Driven */}
            {(floatingCardTitle || floatingCardDescription || floatingCardButtonText) && (
              <motion.div
                className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg z-20 flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease }}
              >
                <div>
                  {floatingCardTitle && <h3 className="font-medium">{floatingCardTitle}</h3>}
                  {floatingCardDescription && <p className="text-sm text-muted-foreground">{floatingCardDescription}</p>}
                </div>
                {floatingCardButtonText && (
                  <Button size="sm" className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    {floatingCardButtonText}
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}