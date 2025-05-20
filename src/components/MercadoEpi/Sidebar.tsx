import React from 'react';

interface SidebarProps {
  categories: string[];
  types: string[];
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, types, onCategoryChange, onTypeChange }) => {
  return (
    <div className="bg-gray-100 text-gray-600 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-6">
        <h3 className="font-medium mb-2">Categories</h3>
        {categories.map((category) => (
          <div key={category} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => onCategoryChange(category)}
              />
              <span className="ml-2">{category}</span>
            </label>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-medium mb-2">Types</h3>
        {types.map((type) => (
          <div key={type} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => onTypeChange(type)}
              />
              <span className="ml-2">{type}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;