import React, { ChangeEvent } from "react";
import { Button } from "@mui/material";
import { MdDelete } from "react-icons/md";


type FilePreview = {
  file: File;
  preview: string; 
};

interface FilePickerProps {
  onFileChange: (file: File, type: string) => void;
  selectedFiles: FilePreview[];
  removeFile: (index: number) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ onFileChange, selectedFiles, removeFile }) => {
  const handleInputFileChange = (event: ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files;
    if (files) {
      const filePreviews: FilePreview[] = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file), // For images/videos
      }));

      // Call the handler passed down via props
      filePreviews.forEach((filePreview) => {
        onFileChange(filePreview.file, type); // This will be handled by the parent component
      });
    }
  };

  const getFileIcon = (file: File) => {
    // A simple switch case or mapping for icons based on file extension
    const extension = file.name.split('.').pop();
    switch (extension) {
      case 'docx':
        return 'word';
      case 'ppt':
        return 'powerpoint';
      case 'xlsx':
        return 'excel';
      case 'txt':
        return 'text';
      default:
        return 'file';
    }
  };

  const renderPreview = (file: FilePreview, index: number) => {
    const { file: fileData, preview } = file;

    const fileIcon = getFileIcon(fileData);

    return (
      <div key={index} className="preview-item relative">
        {fileData.type.startsWith("image/") && (
          <img src={preview} alt={fileData.name} className="image-preview rounded-lg shadow-md" />
        )}
        {fileData.type.startsWith("video/") && (
          <video controls className="video-preview rounded-lg shadow-md">
            <source src={preview} type={fileData.type} />
            Your browser does not support the video tag.
          </video>
        )}
        {fileData.type.startsWith("audio/") && (
          <audio controls className="audio-preview rounded-lg shadow-md">
            <source src={preview} type={fileData.type} />
            Your browser does not support the audio tag.
          </audio>
        )}
        {fileData.type === "application/pdf" && (
          <iframe src={preview} className="document-preview rounded-lg shadow-md" title={fileData.name}></iframe>
        )}
        {/* For .docx, .ppt, .xlsx, .txt files, display an icon or file name */}
        {fileData.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
          <div className="file-preview-icon">{/* Word icon */} Word File</div>
        )}
        {fileData.type === "application/vnd.ms-powerpoint" && (
          <div className="file-preview-icon">{/* PowerPoint icon */} PowerPoint File</div>
        )}
        {fileData.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
          <div className="file-preview-icon">{/* Excel icon */} Excel File</div>
        )}
        {fileData.type === "text/plain" && (
          <div className="file-preview-icon">{/* Text file icon */} Text File</div>
        )}
        
        {/* Default file icon */}
        {!fileData.type.startsWith('image') && !fileData.type.startsWith('audio') && !fileData.type.startsWith('video') && !fileData.type.startsWith('application/pdf') && (
          <div className="file-preview-icon">{fileIcon} File</div>
        )}
        
        <Button
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full"
          onClick={() => removeFile(index)}
          aria-label="Remove file"
        >
          <MdDelete />
        </Button>
      </div>
    );
  };

 
  return (
    <div className="absolute  file-uploader p-6 bg-gray-50 rounded-lg shadow-md max-w-lg mx-auto" style={{
      minWidth:'100vw'
    }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => document.getElementById("file-input")?.click()}
        fullWidth
      >
        Select Files
      </Button>

      <input
        type="file"
        id="file-input"
        accept="*"
        onChange={(e) => handleInputFileChange(e, 'normalFile')}
        className="hidden"
        aria-label="File input"
      />

      <div className="previews mt-4 flex flex-wrap gap-4">
        {selectedFiles.map((item, index) => renderPreview(item, index))}
      </div>
    </div>
  );
};

export default FilePicker;

// accept="image/*,video/*,audio/*,application/pdf,.docx,.ppt,.xlsx,.txt"