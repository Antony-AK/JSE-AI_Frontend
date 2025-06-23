import React, { useEffect, useState, useRef } from 'react';

const LatexPreview = ({ data }) => {
  const [htmlPreview, setHtmlPreview] = useState('');
  const previewRef = useRef();

  useEffect(() => {
    const generateHtml = async () => {
      try {
        const latexModule = await import(
          'https://cdn.jsdelivr.net/npm/latex.js@0.12.6/dist/latex.mjs'
        );
        const { parse, HtmlGenerator } = latexModule;
        const generator = new HtmlGenerator({ hyphenate: false });

        // Format paragraphs with proper LaTeX breaks + escape special characters
        const escapeLatex = (text) =>
          text.replace(/([%#&{}_$^~\\])/g, '\\$1'); // escape LaTeX-sensitive chars

        const paraText = data.paragraphs
          .map((p) => escapeLatex(p.trim()))
          .join('\\\\[12pt]\n');

        // Fill the template
        let filled = latexTemplate
          .replaceAll('{{{name}}}', escapeLatex(data.name))
          .replaceAll('{{{title}}}', escapeLatex(data.title))
          .replaceAll('{{{mail}}}', escapeLatex(data.mail))
          .replaceAll('{{{contact}}}', escapeLatex(data.contact))
          .replaceAll('{{{address}}}', escapeLatex(data.address))
          .replace('{{{paragraphs}}}', paraText);

        // Parse and generate HTML
        parse(filled, { generator });
        setHtmlPreview(generator.domFragment().innerHTML);
      } catch (err) {
        console.warn('⚠️ LaTeX parsing failed. Check your template.', err);
      }
    };

    console.log('🧪 HTML Preview Output:', htmlPreview);


    generateHtml();
  }, [data]);

  const handleDownload = async () => {
    try {
      const html2pdfModule = await import(
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
      );
      html2pdfModule.default()
        .from(previewRef.current)
        .save('cover_letter.pdf');
    } catch (err) {
      console.error('html2pdf error:', err);
    }
  };

  return (
    <div className="w-full h-[860px] flex flex-col">
      <div
        ref={previewRef}
        className="bg-white p-6 overflow-y-auto border"
        style={{ flex: 1, maxHeight: '80vh' }}
        dangerouslySetInnerHTML={{ __html: htmlPreview }}
      />
      <button
        onClick={handleDownload}
        className="mt-3 self-end bg-[#2c6472] text-white px-6 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default LatexPreview;
