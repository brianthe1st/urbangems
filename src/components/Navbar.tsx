import { useState } from "react";
import { SignOutButton } from "../SignOutButton";

interface NavbarProps {
  currentPage: "products" | "contact" | "admin";
  onPageChange: (page: "products" | "contact" | "admin") => void;
  isAdmin: boolean;
}

export default function Navbar({ currentPage, onPageChange, isAdmin }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onPageChange("products")}
            className="text-2xl font-bold text-slate-800 hover:text-orange-600 transition-colors"
          >
            Urban<span className="text-orange-600">Gems</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onPageChange("products")}
              className={`font-medium transition-colors ${
                currentPage === "products" 
                  ? "text-orange-600 border-b-2 border-orange-600 pb-1" 
                  : "text-slate-600 hover:text-orange-600"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => onPageChange("contact")}
              className={`font-medium transition-colors ${
                currentPage === "contact" 
                  ? "text-orange-600 border-b-2 border-orange-600 pb-1" 
                  : "text-slate-600 hover:text-orange-600"
              }`}
            >
              Contact
            </button>
            {isAdmin && (
              <button
                onClick={() => onPageChange("admin")}
                className={`font-medium transition-colors ${
                  currentPage === "admin" 
                    ? "text-orange-600 border-b-2 border-orange-600 pb-1" 
                    : "text-slate-600 hover:text-orange-600"
                }`}
              >
                Admin
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => onPageChange("admin")}
                className="text-slate-600 hover:text-orange-600 font-medium transition-colors"
              >
                Admin Login
              </button>
            )}
            {isAdmin && <SignOutButton />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-slate-600 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`h-0.5 bg-slate-600 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-slate-600 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onPageChange("products");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === "products" ? "text-orange-600" : "text-slate-600"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => {
                  onPageChange("contact");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === "contact" ? "text-orange-600" : "text-slate-600"
                }`}
              >
                Contact
              </button>
              {isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      onPageChange("admin");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left font-medium transition-colors ${
                      currentPage === "admin" ? "text-orange-600" : "text-slate-600"
                    }`}
                  >
                    Admin
                  </button>
                  <SignOutButton />
                </>
              ) : (
                <button
                  onClick={() => {
                    onPageChange("admin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
