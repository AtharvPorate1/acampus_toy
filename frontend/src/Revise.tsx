import React, { useState } from 'react';
import pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
import './Revise.css';

const Revise: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => (item as any).str).join(' ');
          text += `${pageText} `;
        }

        setPdfText(text);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="revise-container">
      <h1>Revise Page</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div className="pdf-text">
        {pdfText}
      </div>
    </div>
  );
};

export default Revise;
