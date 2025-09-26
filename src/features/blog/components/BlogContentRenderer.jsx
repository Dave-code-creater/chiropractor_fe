import React from "react";

const BlogContentRenderer = ({ content = [] }) => {
  const renderContent = () => {
    if (!content) {
      return (
        <div className="text-gray-500 italic">
          No content available.
        </div>
      );
    }

    if (typeof content === 'string') {
      if (content.trim() === '') {
        return (
          <div className="text-gray-500 italic">
            No content available.
          </div>
        );
      }

      const paragraphs = content.split('\n\n').filter(p => p.trim());

      return paragraphs.map((paragraph, index) => {
        const trimmedParagraph = paragraph.trim();

        if (trimmedParagraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-bold mb-4 text-gray-900">
              {trimmedParagraph.replace('### ', '')}
            </h3>
          );
        } else if (trimmedParagraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-bold mb-5 text-gray-900">
              {trimmedParagraph.replace('## ', '')}
            </h2>
          );
        } else if (trimmedParagraph.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900">
              {trimmedParagraph.replace('# ', '')}
            </h1>
          );
        } else if (trimmedParagraph.startsWith('> ')) {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50 rounded-r"
            >
              {trimmedParagraph.replace('> ', '')}
            </blockquote>
          );
        } else if (trimmedParagraph.startsWith('```')) {
          const codeContent = trimmedParagraph.replace(/```[\w]*\n?/, '').replace(/```$/, '');
          return (
            <pre
              key={index}
              className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto"
            >
              <code>{codeContent}</code>
            </pre>
          );
        } else {
          if (trimmedParagraph.includes('\n- ') || trimmedParagraph.startsWith('- ')) {
            const listItems = trimmedParagraph.split('\n').filter(item => item.trim().startsWith('- '));
            return (
              <ul key={index} className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item.replace('- ', '')}
                  </li>
                ))}
              </ul>
            );
          } else if (trimmedParagraph.includes('\n1. ') || /^\d+\.\s/.test(trimmedParagraph)) {
            const listItems = trimmedParagraph.split('\n').filter(item => /^\d+\.\s/.test(item.trim()));
            return (
              <ol key={index} className="list-decimal list-inside mb-4 text-gray-700 space-y-1">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item.replace(/^\d+\.\s/, '')}
                  </li>
                ))}
              </ol>
            );
          } else {
            const lines = trimmedParagraph.split('\n');
            return (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {lines.map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
          }
        }
      });
    }

    if (Array.isArray(content)) {
      if (content.length === 0) {
        return (
          <div className="text-gray-500 italic">
            No content available.
          </div>
        );
      }

      return content.map((block, index) => renderBlock(block, index));
    }

    if (typeof content === 'object' && content !== null) {
      if (content.text) {
        return (
          <div className="mb-4 text-gray-700 leading-relaxed">
            {content.text}
          </div>
        );
      }

      if (content.blocks && Array.isArray(content.blocks)) {
        return content.blocks.map((block, index) => renderBlock(block, index));
      }

      if (content.content) {
        return <BlogContentRenderer content={content.content} />;
      }

      return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800 mb-2">
            Content object detected:
          </p>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <div className="text-gray-500 italic">Unable to render content format. Content type: {typeof content}
      </div>
    );
  };

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
        if (block.content && Array.isArray(block.content)) {
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {block.content.map((item, itemIndex) => {
                if (item.type === "text") {
                  return <span key={itemIndex}>{item.text}</span>;
                }
                return null;
              }).filter(Boolean)}
            </p>
          );
        }
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

        let headingText = block.text;
        if (block.content && Array.isArray(block.content)) {
          headingText = block.content.map(item => {
            if (item.type === "text") return item.text;
            return "";
          }).join("");
        }

        return React.createElement(
          HeadingTag,
          {
            key: index,
            className: headingClasses[block.level || 1]
          },
          headingText
        );
      }

      case "bullet_list":
      case "list": {
        const isOrdered = block.type === "ordered_list" || block.ordered;
        const ListTag = isOrdered ? "ol" : "ul";
        const listClass = isOrdered
          ? "list-decimal list-inside mb-4 text-gray-700 space-y-1"
          : "list-disc list-inside mb-4 text-gray-700 space-y-1";

        if (block.content && Array.isArray(block.content)) {
          return (
            <ListTag key={index} className={listClass}>
              {block.content.map((listItem, itemIndex) => {
                if (listItem.type === "list_item" && listItem.content) {
                  const itemText = listItem.content.map(contentItem => {
                    if (contentItem.type === "paragraph" && contentItem.content) {
                      return contentItem.content.map(textItem => {
                        if (textItem.type === "text") return textItem.text;
                        return "";
                      }).join("");
                    }
                    return "";
                  }).join("");

                  return (
                    <li key={itemIndex} className="leading-relaxed">
                      {itemText}
                    </li>
                  );
                }
                return null;
              }).filter(Boolean)}
            </ListTag>
          );
        }

        return (
          <ListTag key={index} className={listClass}>
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">{item}</li>
            ))}
          </ListTag>
        );
      }

      case "ordered_list": {
        const listClass = "list-decimal list-inside mb-4 text-gray-700 space-y-1";

        if (block.content && Array.isArray(block.content)) {
          return (
            <ol key={index} className={listClass}>
              {block.content.map((listItem, itemIndex) => {
                if (listItem.type === "list_item" && listItem.content) {
                  const itemText = listItem.content.map(contentItem => {
                    if (contentItem.type === "paragraph" && contentItem.content) {
                      return contentItem.content.map(textItem => {
                        if (textItem.type === "text") return textItem.text;
                        return "";
                      }).join("");
                    }
                    return "";
                  }).join("");

                  return (
                    <li key={itemIndex} className="leading-relaxed">
                      {itemText}
                    </li>
                  );
                }
                return null;
              }).filter(Boolean)}
            </ol>
          );
        }

        return (
          <ol key={index} className={listClass}>
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">{item}</li>
            ))}
          </ol>
        );
      }

      case "blockquote": {
        let quoteText = block.text;
        if (block.content && Array.isArray(block.content)) {
          quoteText = block.content.map(item => {
            if (item.type === "text") return item.text;
            return "";
          }).join("");
        }

        return (
          <blockquote
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50 rounded-r"
          >
            {quoteText}
          </blockquote>
        );
      }

      case "code": {
        let codeText = block.text;
        if (block.content && Array.isArray(block.content)) {
          codeText = block.content.map(item => {
            if (item.type === "text") return item.text;
            return "";
          }).join("");
        }

        return (
          <pre
            key={index}
            className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto"
          >
            <code>{codeText}</code>
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

  return (
    <div className="prose prose-lg max-w-none">
      {renderContent()}
    </div>
  );
};

export default BlogContentRenderer; 