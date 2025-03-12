
import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-3 md:max-w-xs">
            <Link to="/" className="text-xl font-bold text-gradient">
              MathMind
            </Link>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              Your AI-powered learning companion for Mathematics, Physics, and Chemistry.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/subjects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Subjects</Link>
              <Link to="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Tutor</Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            </div>
          </div>
          
          {/* Resources */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="font-semibold">Resources</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          
          {/* Legal */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center md:items-end space-y-4 md:space-y-0">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MathMind. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for students</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
