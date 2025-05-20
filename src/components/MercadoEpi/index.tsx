import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import Sidebar from './/Sidebar';
import productsData from '../../data/products.json';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  type: string;
  image: string;
}

const MercadoEpi: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
    const uniqueCategories = Array.from(new Set(productsData.map((p) => p.category)));
    const uniqueTypes = Array.from(new Set(productsData.map((p) => p.type)));
    setCategories(uniqueCategories);
    setTypes(uniqueTypes);
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      return categoryMatch && typeMatch;
    });
    setFilteredProducts(filtered);
  }, [selectedCategories, selectedTypes, products]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Amazon Clone</h1>
          <div className="flex items-center">
            <span>Cart (0)</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <Sidebar
              categories={categories}
              types={types}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
            />
          </aside>
          <div className="w-full md:w-3/4">
            <ProductList products={filteredProducts} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MercadoEpi;