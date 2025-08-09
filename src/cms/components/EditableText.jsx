import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import Icon from 'components/AppIcon';

const EditableText = ({
  contentKey,
  defaultValue = '',
  tag = 'p',
  className = '',
  multiline = false,
  richText = false,
  placeholder = 'Click to edit...',
  children,
  ...props
}) => {
  const { isEditMode, markAsChanged } = useEditMode();
  const { content, currentLanguage, setContent } = useCMSStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const editorRef = useRef(null);
  const Tag = tag;
  
  // Get content from store or use default
  const storedValue = content[currentLanguage]?.[contentKey];
  const displayValue = storedValue || defaultValue || children;
  
  useEffect(() => {
    if (isEditing) {
      setLocalValue(displayValue);
    }
  }, [isEditing, displayValue]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        handleSave();
      }
    };
    
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, localValue]);
  
  const handleEdit = () => {
    if (!isEditMode) return;
    setIsEditing(true);
    setShowToolbar(richText);
  };
  
  const handleSave = () => {
    if (localValue !== displayValue) {
      setContent(contentKey, localValue);
      markAsChanged();
    }
    setIsEditing(false);
    setShowToolbar(false);
  };
  
  const handleCancel = () => {
    setLocalValue(displayValue);
    setIsEditing(false);
    setShowToolbar(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  const applyFormat = (format) => {
    if (!richText) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selection.toString()}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selection.toString()}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selection.toString()}</u>`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selection.toString()}</a>`;
        }
        break;
      default:
        return;
    }
    
    document.execCommand('insertHTML', false, formattedText);
    setLocalValue(editorRef.current.innerHTML);
  };
  
  if (isEditing) {
    return (
      <div className="relative" ref={editorRef}>
        {showToolbar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 left-0 flex items-center space-x-1 bg-gray-800 text-white p-2 rounded-lg shadow-lg z-50"
          >
            <button
              onClick={() => applyFormat('bold')}
              className="p-1 hover:bg-gray-700 rounded"
              title="Bold"
            >
              <Icon name="Bold" size={16} />
            </button>
            <button
              onClick={() => applyFormat('italic')}
              className="p-1 hover:bg-gray-700 rounded"
              title="Italic"
            >
              <Icon name="Italic" size={16} />
            </button>
            <button
              onClick={() => applyFormat('underline')}
              className="p-1 hover:bg-gray-700 rounded"
              title="Underline"
            >
              <Icon name="Underline" size={16} />
            </button>
            <button
              onClick={() => applyFormat('link')}
              className="p-1 hover:bg-gray-700 rounded"
              title="Link"
            >
              <Icon name="Link" size={16} />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1" />
            <button
              onClick={handleSave}
              className="p-1 hover:bg-green-700 rounded text-green-400"
              title="Save"
            >
              <Icon name="Check" size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-red-700 rounded text-red-400"
              title="Cancel"
            >
              <Icon name="X" size={16} />
            </button>
          </motion.div>
        )}
        
        {multiline ? (
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 resize-vertical ${className}`}
            placeholder={placeholder}
            autoFocus
            rows={4}
          />
        ) : richText ? (
          <div
            contentEditable
            dangerouslySetInnerHTML={{ __html: localValue }}
            onInput={(e) => setLocalValue(e.currentTarget.innerHTML)}
            onKeyDown={handleKeyDown}
            className={`p-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 min-h-[2.5rem] ${className}`}
            suppressContentEditableWarning
          />
        ) : (
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 ${className}`}
            placeholder={placeholder}
            autoFocus
          />
        )}
      </div>
    );
  }
  
  return (
    <Tag
      className={`${className} ${
        isEditMode
          ? 'relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 transition-all'
          : ''
      }`}
      onClick={handleEdit}
      {...props}
    >
      {richText ? (
        <span dangerouslySetInnerHTML={{ __html: displayValue }} />
      ) : (
        displayValue
      )}
      
      {isEditMode && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"
        >
          <Icon name="Edit2" size={12} />
        </motion.span>
      )}
    </Tag>
  );
};

export default EditableText;