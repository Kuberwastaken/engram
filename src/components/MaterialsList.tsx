import React from 'react';
import PDFViewer from './PDFViewer';
import { GoogleDriveFile } from '@/services/unifiedDataService';
import { studyXDataService } from '@/services/studyXDataService';

interface MaterialsListProps {
  materials: GoogleDriveFile[];
  title?: string;
  emptyMessage?: string;
  className?: string;
  subjectName?: string;
  materialType?: string;
}

const MaterialsList: React.FC<MaterialsListProps> = ({ 
  materials, 
  title, 
  emptyMessage = "No materials available for this section yet.",
  className = "",
  subjectName = "",
  materialType = ""
}) => {
  if (materials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{emptyMessage}</p>
        <p className="text-sm text-gray-500 mt-2">
          Contribute by adding materials to help fellow students!
        </p>
      </div>
    );
  }

  // Material types that should show source tags
  const shouldShowSourceTags = ['notes', 'pyqs', 'lab'].includes(materialType.toLowerCase());

  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
      )}
      {materials.map((file, index) => {
        const fileId = studyXDataService.getFileId(file);
        const fileName = studyXDataService.getFileName(file);
        const isPdf = studyXDataService.isPdfFile(fileName);
          return (
          <PDFViewer
            key={fileId ? fileId : `${file.downloadUrl}-${index}`}
            file={file}
            showPreview={isPdf}
            subjectName={subjectName}
            materialType={materialType}
            showSourceTag={shouldShowSourceTags}
          />
        );
      })}
    </div>
  );
};

export default MaterialsList;
