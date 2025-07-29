import React from "react";

const BlogContentRenderer = ({ content = [] }) => {
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {block.text}
          </p>
        );
      
      case "heading": {
        const HeadingTag = `h${block.level || 1}`;
        const headingClasses = {
          1: "text-3xl font-bold mb-6 text-gray-900",
          2: "text-2xl font-bold mb-5 text-gray-900",
          3: "text-xl font-bold mb-4 text-gray-900",
          4: "text-lg font-bold mb-3 text-gray-900",
          5: "text-base font-bold mb-3 text-gray-900",
          6: "text-sm font-bold mb-2 text-gray-900"
        };
        
        return React.createElement(
          HeadingTag,
          { 
            key: index, 
            className: headingClasses[block.level || 1] 
          },
          block.text
        );
      }
      
      case "list": {
        const ListTag = block.ordered ? "ol" : "ul";
        const listClass = block.ordered 
          ? "list-decimal list-inside mb-4 text-gray-700 space-y-1"
          : "list-disc list-inside mb-4 text-gray-700 space-y-1";
        
        return (
          <ListTag key={index} className={listClass}>
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">{item}</li>
            ))}
          </ListTag>
        );
      }
      
      case "blockquote": {
        return (
          <blockquote 
            key={index} 
            className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50 rounded-r"
          >
            {block.text}
          </blockquote>
        );
      }
      
      case "code": {
        return (
          <pre 
            key={index} 
            className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto"
          >
            <code>{block.text}</code>
          </pre>
        );
      }
      
      case "image": {
        return (
          <div key={index} className="mb-6">
            <img 
              src={block.src} 
              alt={block.alt || ""} 
              className="w-full h-auto rounded-lg shadow-md"
            />
            {block.caption && (
              <p className="text-sm text-gray-500 text-center mt-2 italic">
                {block.caption}
              </p>
            )}
          </div>
        );
      }
      
      default:
        // Fallback for unknown block types
        return (
          <div key={index} className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              Unknown content type: {block.type}
            </p>
            <pre className="text-xs text-gray-600 mt-1">
              {JSON.stringify(block, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (!content || content.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No content available.
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default BlogContentRenderer; 