"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CartIcon from '@/components/CartIcon';

export function HeaderVariant1({ 
  logoUrl = '/logo.svg', 
  navigationItems = [], 
  ctaButton,
  authLinks = [] // Destructure authLinks, default to empty array
}) { // Use HeaderData type directly for props destructuring
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Find specific auth links
  const loginLink = authLinks.find(link => link.type === 'login');
  const signupLink = authLinks.find(link => link.type === 'signup');

  // Custom style for nav link glow
  const navLinkGlowStyle = { '--glow-color': 'hsl(var(--primary) / 0.3)' } as React.CSSProperties;
  // Custom style for button glow
  const buttonGlowStyle = { '--glow-color': 'hsl(var(--primary) / 0.4)' } as React.CSSProperties;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image 
            src={logoUrl} 
            alt="EyeVision Logo" 
            width={120} 
            height={30}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 md:flex">
          {/* Use label and href from HeaderData -> navigationItems */}
          {navigationItems.map((item) => (
            <Link
              key={item.label} // Use label as key
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:shadow-glow px-1 py-0.5 rounded-sm"
              style={navLinkGlowStyle} // Apply glow style
            >
              {item.label} {/* Display label */}
            </Link>
          ))}
        </nav>

        {/* Right side: Auth Buttons, CTA Button, CartIcon and Mobile Menu Trigger */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {/* Auth Buttons - Desktop (Hidden on small screens) */}
          <div className="hidden md:flex items-center space-x-2">
            {loginLink && (
              <Button variant="outline" size="sm" asChild>
                  <Link href={loginLink.href}>
                      <LogIn className="mr-2 h-4 w-4" /> {loginLink.label}
                  </Link>
              </Button>
            )}
            {signupLink && (
              <Button variant="ghost" size="sm" asChild>
                  <Link href={signupLink.href}>
                      <UserPlus className="mr-2 h-4 w-4" /> {signupLink.label}
                  </Link>
              </Button>
            )}
          </div>
          
          {/* CTA Button - Desktop */}
          {ctaButton && (
             <Button 
                asChild 
                className="hidden md:inline-flex transition-shadow duration-300 hover:shadow-glow"
                size="sm"
                style={buttonGlowStyle} // Apply glow style
              >
                <Link href={ctaButton.href}>{ctaButton.text}</Link>
            </Button>
          )}
          {/* Cart Icon */}
          <CartIcon />
          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              {/* Mobile Logo */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
                  <Image 
                    src={logoUrl} 
                    alt="EyeVision Logo" 
                    width={100} 
                    height={25}
                    className="h-6 w-auto"
                  />
                </Link>
                <button 
                  className="rounded-full p-1 hover:bg-muted" 
                  onClick={() => setIsSheetOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-4">
                {/* Use label and href from HeaderData -> navigationItems */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.label} // Use label as key
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:shadow-glow px-1 py-0.5 rounded-sm"
                    style={navLinkGlowStyle} // Apply glow style
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {item.label} {/* Display label */}
                  </Link>
                ))}
                
                {/* Auth Buttons - Mobile */}
                {(loginLink || signupLink) && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
                      {loginLink && (
                        <Button variant="outline" size="sm" asChild onClick={() => setIsSheetOpen(false)}>
                            <Link href={loginLink.href}>
                                <LogIn className="mr-2 h-4 w-4" /> {loginLink.label}
                            </Link>
                        </Button>
                      )}
                      {signupLink && (
                        <Button variant="ghost" size="sm" asChild onClick={() => setIsSheetOpen(false)}>
                            <Link href={signupLink.href}>
                                <UserPlus className="mr-2 h-4 w-4" /> {signupLink.label}
                            </Link>
                        </Button>
                      )}
                  </div>
                )}

                {/* CTA Button - Mobile */}
                {ctaButton && (
                    <Button 
                      asChild 
                      className="mt-4 transition-shadow duration-300 hover:shadow-glow"
                      style={buttonGlowStyle} // Apply glow style
                    >
                        <Link href={ctaButton.href} onClick={() => setIsSheetOpen(false)}>{ctaButton.text}</Link>
                    </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}