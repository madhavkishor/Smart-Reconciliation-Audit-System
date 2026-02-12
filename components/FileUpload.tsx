
import React, { useState } from 'react';
import { UserRole, TransactionRecord, MappingField } from '../types';
import MappingStage from './MappingStage';

interface FileUploadProps {
  onUploadComplete: (records: TransactionRecord[]) => void;
  userRole: UserRole;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete, userRole }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [stage, setStage] = useState<'upload' | 'mapping'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        setPreview(rows.slice(0, 20)); // Show first 20 rows
      };
      reader.readAsText(selectedFile);
    }
  };

  if (userRole === UserRole.VIEWER) {
    return (
      <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
        <p className="text-slate-500">You do not have permission to upload files. Please contact an admin.</p>
      </div>
    );
  }

  if (stage === 'mapping') {
    return (
      <MappingStage 
        preview={preview} 
        onComplete={(mappedRecords) => onUploadComplete(mappedRecords)} 
        onBack={() => setStage('upload')}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              📤
            </div>
            <h3 className="text-lg font-bold text-slate-800">Upload Transaction File</h3>
            <p className="text-slate-500 text-sm mt-1">Support for .csv and .xlsx files (Max 50k records)</p>
          </div>
          
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-10 hover:border-blue-400 transition-colors">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            {file ? (
              <div className="text-sm">
                <p className="font-semibold text-blue-600">{file.name}</p>
                <p className="text-slate-400 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="text-slate-400">
                <p className="font-medium">Click to browse or drag and drop</p>
                <p className="text-xs mt-2">Only CSV files supported in this demo version</p>
              </div>
            )}
          </div>

          {file && (
            <button 
              onClick={() => setStage('mapping')}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Continue to Mapping
            </button>
          )}
        </div>
      </div>

      {preview.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h4 className="font-bold text-slate-700">Preview (First 20 rows)</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  {preview[0]?.map((cell: string, i: number) => (
                    <th key={i} className="px-6 py-3 font-semibold">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preview.slice(1).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="px-6 py-3 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
