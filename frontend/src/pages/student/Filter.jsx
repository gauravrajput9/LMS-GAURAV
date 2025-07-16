import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { id: "Web Development", label: "Web Development" },
  { id: "App Development", label: "App Development" },
  { id: "Data Science", label: "Data Science" },
  { id: "Machine Learning", label: "Machine Learning" },
  { id: "Cloud Computing", label: "Cloud Computing" },
  { id: "Cyber Security", label: "Cyber Security" },
  { id: "Game Development", label: "Game Development" },
  { id: "DevOps", label: "DevOps" },
  { id: "Frontend Development", label: "Frontend Development" },
];


const Filter = ({ selectedCategories = [], onCategoryChange, sortBy, onSortChange }) => {
   
  return (
    <div className="w-full p-4 space-y-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      {/* Sort Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sort by</h2>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select price order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low-to-high">Price: Low to High</SelectItem>
            <SelectItem value="high-to-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() =>
                  onCategoryChange(category.id)
                }
              />
              <label htmlFor={category.id}>{category.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
