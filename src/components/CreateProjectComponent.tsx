'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createProject } from '@/lib/ProjectFunctions/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
  
}

const CreateProjectComponent = ({ isOpen, onClose}: CreateProjectProps) => {
  // Hooks must be called at the top level, before any early returns
  const [projectName, setProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const colorOptions = [
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Blue', class: 'bg-blue-600' },
    { name: 'Yellow', class: 'bg-yellow-500' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Pink', class: 'bg-pink-500' },
    { name: 'Cyan', class: 'bg-cyan-500' },
    { name: 'Lime', class: 'bg-lime-500' },
    { name: 'Indigo', class: 'bg-indigo-500' }
  ];

  const CreateProjectFn = useMutation({
     mutationFn: createProject,
      onSuccess: () => {
        toast.success("Signup sucess");
        setProjectName("");
       setSelectedColor("");
        onClose();
      },
    });
  
  const handleSubmit = () => {
    if (projectName.trim() && selectedColor) {
      
      const data = {
        name:projectName.trim(),
        color:selectedColor
      }
      CreateProjectFn.mutate(data)
    }
  };

  // Render nothing if not open, but AFTER all hooks are called
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="w-2/5 bg-white rounded-md shadow-lg flex flex-col p-4 relative">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create New Project</p>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Project name input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input 
            type="text" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name" 
            className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Color selection */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Choose Project Accent Color</p>
          <div className="grid grid-cols-5 gap-3 p-2">
            {colorOptions.map((color) => (
              <div 
                key={color.name}
                className={`${color.class} h-16 rounded cursor-pointer transition-all duration-200 ${
                  selectedColor === color.name ? 'ring-4 ring-offset-2 ring-blue-500' : 'hover:opacity-80'
                }`}
                onClick={() => setSelectedColor(color.class)}
                title={color.name}
              />
            ))}
          </div>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!projectName.trim() || !selectedColor}
            className={`px-4 py-2 rounded font-medium ${
              projectName.trim() && selectedColor
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectComponent;