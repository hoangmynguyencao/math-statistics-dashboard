import React, { useMemo } from 'react';
import katex from 'katex';

export default function MathFormula({ formula, displayMode = false, className = '' }) {
  const html = useMemo(() => {
    if (!formula) return '';
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
      });
    } catch (err) {
      console.error('KaTeX render error:', err);
      return formula;
    }
  }, [formula, displayMode]);

  return (
    <span
      className={`inline-block select-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
