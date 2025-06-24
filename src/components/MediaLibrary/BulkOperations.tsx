import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Tag, Download, X, Check } from 'lucide-react';
interface SelectedFile {
  id: string;
  path?: string;
  name?: string;
  [key: string]: any;
}

interface BulkOperationsProps {
  selectedFiles: SelectedFile[];
  onClearSelection: () => void;
  onDeleteSelected: (fileIds: string[]) => Promise<void>;
  onTagSelected: (fileIds: string[], tags: string[]) => Promise<void>;
}

export function BulkOperations({
  selectedFiles,
  onClearSelection,
  onDeleteSelected,
  onTagSelected
}: BulkOperationsProps) {
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onDeleteSelected(selectedFiles.map(file => file.id));
      setIsConfirmDelete(false);
      onClearSelection();
    } catch (error) {
      console.error('Error deleting files:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle tag addition
  const handleAddTag = useCallback(() => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  }, [tags, newTag]);

  // Handle tag removal
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag, newTag]);

  // Handle tag save
  const handleSaveTags = async () => {
    if (selectedFiles.length === 0 || tags.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onTagSelected(selectedFiles.map(file => file.id), tags);
      setIsTagging(false);
      setTags([]);
      onClearSelection();
    } catch (error) {
      console.error('Error tagging files:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // If no files are selected, don't render anything
  if (selectedFiles.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg z-30 p-4 min-w-[320px] max-w-md"
    >
      {isConfirmDelete ? (
        // Delete confirmation
        <div className="space-y-3">
          <h3 className="font-medium text-red-600 flex items-center">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete {selectedFiles.length} items?
          </h3>
          <p className="text-sm text-gray-600">
            This action cannot be undone. These files will be permanently removed.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsConfirmDelete(false)}
              className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md flex-1"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md flex-1 flex justify-center items-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      ) : isTagging ? (
        // Tag editing
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Add tags to {selectedFiles.length} items
          </h3>
          
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006297] focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                disabled={newTag.trim() === ''}
                className="bg-[#006297] text-white px-3 rounded-r-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsTagging(false)}
              className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md flex-1"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTags}
              className="px-3 py-2 text-white bg-[#006297] hover:bg-opacity-90 rounded-md flex-1 flex justify-center items-center"
              disabled={isProcessing || tags.length === 0}
            >
              {isProcessing ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Save Tags
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Main bulk operations
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">
              {selectedFiles.length} items selected
            </h3>
            <button 
              onClick={onClearSelection}
              className="text-gray-500 hover:text-gray-700"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsConfirmDelete(true)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex-1 text-sm"
            >
              <Trash2 className="w-4 h-4 mr-1 text-red-500" />
              Delete
            </button>
            
            <button
              onClick={() => setIsTagging(true)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex-1 text-sm"
            >
              <Tag className="w-4 h-4 mr-1 text-[#006297]" />
              Tag
            </button>
            
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Here you would implement a bulk download functionality
                alert('Bulk download would be implemented here');
              }}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex-1 text-sm"
            >
              <Download className="w-4 h-4 mr-1 text-gray-700" />
              Download
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
