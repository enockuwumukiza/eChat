import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileExcel,
  FaFileAlt,
} from 'react-icons/fa';

type FilePreview = {
  file: File;
  preview: string; 
};

export const renameFile = (name: string) => {
  const nameCharsLength = name.split('').length;

  let newName = nameCharsLength > 30 ? name.split('').slice(0, 30).join('') + "..." : name;
  

  return newName
}

export const handleDownload = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Create and trigger a download link
    const anchor = document.createElement('a');
    anchor.href = blobUrl; // Use blobUrl instead of url
    anchor.download = fileName || 'download';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Release the blob URL after a short delay to ensure download starts
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Failed to download the file:', error);
  }
};


/**
 * Component to render a file link with an icon
 */
const FileLink = ({ fileUrl, fileName }: { fileUrl: { url: any }; fileName: string }) => {
  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'docx':
      case 'doc':
        return <FaFileWord className="text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500" />;
      case 'xlsx':
        return <FaFileExcel className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span>{getFileIcon(fileName)}</span>
      <a
        href={fileUrl?.url}
        download={fileName}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {fileName}
      </a>
    </div>
  );
};

/**
 * Maps file types to a string representation for default icons
 */
const getFileTypeIcon = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'docx':
      return '📄 Word File';
    case 'ppt':
      return '📊 PowerPoint File';
    case 'xlsx':
      return '📈 Excel File';
    case 'txt':
      return '📜 Text File';
    default:
      return '📁 Unknown File';
  }
};

/**
 * Renders a document preview based on the file type
 */
export const renderDocument = (file: File) => {
  const filePreview: FilePreview = {
    file,
    preview: URL.createObjectURL(file),
  };

  const fileTypeIcon = getFileTypeIcon(file);

  return (
    <div className="preview-item relative">
      {file.type === 'application/pdf' ? (
        <iframe
          src={filePreview.preview}
          className="document-preview rounded-lg shadow-md"
          title={file.name}
        ></iframe>
      ) : file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
        <div className="file-preview-icon">{fileTypeIcon}</div>
      ) : file.type === 'application/vnd.ms-powerpoint' ? (
        <div className="file-preview-icon">{fileTypeIcon}</div>
      ) : file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
        <div className="file-preview-icon">{fileTypeIcon}</div>
      ) : file.type === 'text/plain' ? (
        <div className="file-preview-icon">{fileTypeIcon}</div>
      ) : !file.type.startsWith('image') &&
        !file.type.startsWith('audio') &&
        !file.type.startsWith('video') &&
        !file.type.startsWith('application/pdf') ? (
        <div className="file-preview-icon">{fileTypeIcon}</div>
      ) : null}
    </div>
  );
};

export default FileLink;
