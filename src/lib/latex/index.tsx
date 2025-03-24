import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const parseContent = (content: string) => {
  // This regex matches block math wrapped in \[ ... \] or inline math wrapped in $ ... $
  const regex = /\\\[(.+?)\\\]|\$([^$]+?)\$/g;
  const parts: Array<{ type: 'block' | 'inline', content: string } | string> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Push any text that appears before the math marker.
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // match[1] holds block math (from \[ ... \])
    if (match[1]) {
      parts.push({ type: 'block', content: match[1].trim() });
    } 
    // match[2] holds inline math (from $ ... $)
    else if (match[2]) {
      parts.push({ type: 'inline', content: match[2].trim() });
    }
    lastIndex = regex.lastIndex;
  }

  // Push any remaining text after the last match.
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  // Map over the parts and render the math using the correct component.
  return parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={index}>{part}</span>;
    } else if (part.type === 'block') {
      return <BlockMath key={index} math={part.content} />;
    } else if (part.type === 'inline') {
      return <InlineMath key={index} math={part.content} />;
    }
    return null;
  });
};