import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CompilePreviewProps {
  initialLatex: string;
}

export default function CompilePreview({ initialLatex }: CompilePreviewProps) {
  const [latexCode, setLatexCode] = useState(initialLatex);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  useEffect(() => {
    if (initialLatex) {
      setLatexCode(initialLatex);
      compileLatex(initialLatex);
    }
  }, [initialLatex]);

  const compileLatex = async (code: string) => {
    setIsCompiling(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/resume/compile',
        { latex: code },
        { responseType: 'blob', headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }}
      );
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
      toast.success('Resume compiled successfully');
    } catch (error) {
      console.error('Compilation failed', error);
      toast.error('Failed to compile LaTeX');
    } finally {
      setIsCompiling(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-4 p-4">
      {/* Editor Section */}
      <div className="flex flex-col w-1/2 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
          <h3 className="text-sm font-semibold text-foreground">LaTeX Editor</h3>
          <Button 
            onClick={() => compileLatex(latexCode)} 
            disabled={isCompiling}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            {isCompiling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Recompile
          </Button>
        </div>
        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage="latex"
            theme="vs-dark"
            value={latexCode}
            onChange={(value) => setLatexCode(value || '')}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col w-1/2 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex items-center px-4 py-2 border-b border-border bg-muted/50">
          <h3 className="text-sm font-semibold text-foreground">Live PDF Preview</h3>
        </div>
        <div className="flex-grow overflow-auto bg-neutral-900 p-4 flex justify-center custom-scrollbar">
          {pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page 
                  key={`page_${index + 1}`} 
                  pageNumber={index + 1} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mb-4 shadow-xl"
                  width={600}
                />
              ))}
            </Document>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {isCompiling ? 'Compiling PDF...' : 'No preview available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
