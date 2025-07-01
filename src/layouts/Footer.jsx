"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Heart, Stethoscope } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-gradient-to-r from-background/95 to-muted/20 backdrop-blur-sm">
      <div className="container px-4 py-8 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Dr. Dieu Phan D.C
                </span>
                <p className="text-xs text-muted-foreground">
                  Your Health, Our Priority
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Providing comprehensive chiropractic care and wellness solutions
              to help you live your best life with over 20 years of experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                About Us
              </Link>
              <Link
                to="/appointments"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                Book Appointment
              </Link>
              <Link
                to="/blog"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                Health Blog
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">
              Legal & Support
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                Terms of Service
              </Link>
              <Link
                to="/faq"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="my-6 opacity-50" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              © {new Date().getFullYear()} Dr. Dieu Phan D.C. All rights
              reserved.
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
            <span>for your health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
