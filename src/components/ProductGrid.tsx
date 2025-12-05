import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface ProductGridProps {
  onProductSelect: (product: any) => void;
}

export default function ProductGrid({ onProductSelect }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const products = useQuery(api.products.list, {
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
  });
  
  const categories = useQuery(api.products.getCategories);
  const featuredProducts = useQuery(api.products.getFeatured);

  if (products === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Products */}
      {!searchTerm && !selectedCategory && featuredProducts && featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onSelect={onProductSelect}
                featured={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          {searchTerm || selectedCategory ? "Search Results" : "All Products"}
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onSelect={onProductSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: any;
  onSelect: (product: any) => void;
  featured?: boolean;
}

function ProductCard({ product, onSelect, featured = false }: ProductCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
        featured ? 'ring-2 ring-blue-200' : ''
      }`}
      onClick={() => onSelect(product)}
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-6xl">📦</div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {featured && (
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
            Featured
          </div>
        )}
        
        <h3 className="font-semibold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
