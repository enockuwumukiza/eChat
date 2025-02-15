
import { Button } from "@mui/material";
import { Delete} from "@mui/icons-material";



const getFileIcon = (file: File) => {

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
  
export const renderPreview = (file:any, index:any, removeFile: any) => {
  const { file: fileData, preview } = file;

  const fileIcon = getFileIcon(fileData);

  return (
    <div key={index} className="preview-item relative">
      {fileData.type.startsWith("image/") && (
        <img src={preview} alt={fileData.name} className="image-preview object-cover rounded-lg shadow-md"/>
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
        <Delete fontSize="large" />
      </Button>
    </div>

  )
};

