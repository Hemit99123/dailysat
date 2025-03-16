import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const parseContent = (content: string) => {
    const parts = content.split(/(\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
};