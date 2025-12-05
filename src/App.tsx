import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import ContactForm from "./components/ContactForm";
import AdminPanel from "./components/AdminPanel";
import ProductModal from "./components/ProductModal";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"products" | "contact" | "admin">("products");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isAdmin={!!loggedInUser}
      />
      
      <main className="pt-20 animate-fade-in">
        {currentPage === "products" && (
          <div className="container mx-auto px-4 py-8 animate-slide-up">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-slate-800 mb-4 animate-scale-in">
                Urban<span className="text-orange-600">Gems</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-slide-up">
                Discover premium products crafted for the modern lifestyle. 
                Quality meets style in every piece.
              </p>
            </div>
            <ProductGrid onProductSelect={setSelectedProduct} />
          </div>
        )}

        {currentPage === "contact" && (
          <div className="container mx-auto px-4 py-8 animate-slide-up">
            <ContactForm />
          </div>
        )}

        {currentPage === "admin" && (
          <Authenticated>
            <div className="container mx-auto px-4 py-8 animate-slide-up">
              <AdminPanel />
            </div>
          </Authenticated>
        )}

        <Unauthenticated>
          {currentPage === "admin" && (
            <div className="container mx-auto px-4 py-8 max-w-md animate-scale-in">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
                  Admin Access
                </h2>
                <SignInForm />
              </div>
            </div>
          )}
        </Unauthenticated>
      </main>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      <footer className="bg-slate-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">UrbanGems</h3>
              <p className="text-slate-300">
                Premium products for the modern lifestyle. Quality, style, and innovation in every piece.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li><button onClick={() => setCurrentPage("products")} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => setCurrentPage("contact")} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="text-slate-300 space-y-2">
                <p>📧 hello@urbangems.com</p>
                <p>📞 (555) 123-4567</p>
                <p>📍 123 Urban Street, City, State</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 UrbanGems. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
