import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "contacts">("products");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Manage your products, orders, and customer inquiries</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "products"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "orders"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "contacts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Contact Messages
          </button>
        </div>

        <div className="p-6">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "contacts" && <ContactsTab />}
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const products = useQuery(api.products.list, {});
  const deleteProduct = useMutation(api.products.remove);

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ id: productId as any });
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (products === undefined) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Products ({products.length})</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Product
        </button>
      </div>

      {showAddForm && (
        <ProductForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            toast.success("Product added successfully");
          }}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            toast.success("Product updated successfully");
          }}
        />
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">📦</div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <p className="text-slate-600 text-sm">${product.price.toFixed(2)} • {product.category}</p>
                <p className="text-slate-500 text-xs">{product.inStock ? "In Stock" : "Out of Stock"}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-600 hover:text-red-700 px-3 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab() {
  const orders = useQuery(api.orders.list);
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({ id: orderId as any, status: status as any });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (orders === undefined) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Orders ({orders.length})</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-slate-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">{order.customerName}</h3>
                <p className="text-slate-600 text-sm">{order.customerEmail}</p>
                <p className="text-slate-500 text-xs">
                  {new Date(order._creationTime).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
                <p className="text-slate-600 text-sm">Qty: {order.quantity}</p>
              </div>
            </div>
            
            {order.product && (
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium">{order.product.name}</p>
                <p className="text-slate-600 text-sm">${order.product.price.toFixed(2)} each</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                order.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                order.status === "shipped" ? "bg-purple-100 text-purple-800" :
                "bg-green-100 text-green-800"
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsTab() {
  const contacts = useQuery(api.contacts.list);
  const updateContactStatus = useMutation(api.contacts.updateStatus);

  const handleStatusUpdate = async (contactId: string, status: string) => {
    try {
      await updateContactStatus({ id: contactId as any, status: status as any });
      toast.success("Contact status updated");
    } catch (error) {
      toast.error("Failed to update contact status");
    }
  };

  if (contacts === undefined) {
    return <div className="text-center py-8">Loading contacts...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Messages ({contacts.length})</h2>
      
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-slate-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">{contact.name}</h3>
                <p className="text-slate-600 text-sm">{contact.email}</p>
                <p className="text-slate-500 text-xs">
                  {new Date(contact._creationTime).toLocaleDateString()}
                </p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                contact.status === "new" ? "bg-red-100 text-red-800" :
                contact.status === "read" ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              }`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </span>
            </div>
            
            <div className="mb-4 p-4 bg-white rounded border">
              <p className="text-slate-700">{contact.message}</p>
            </div>

            <select
              value={contact.status}
              onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSuccess }: { 
  product?: any; 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    featured: product?.featured || false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageId = product?.imageId;

      if (imageFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const json = await result.json();
        if (!result.ok) throw new Error("Upload failed");
        imageId = json.storageId;
      }

      if (product) {
        await updateProduct({
          id: product._id,
          ...formData,
          imageId,
        });
      } else {
        await createProduct({
          ...formData,
          imageId,
        });
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800">
            {product ? "Edit Product" : "Add New Product"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">
              Featured Product
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
