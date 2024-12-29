const ALLOWED_FILE_TYPES :any = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  video: ['video/mp4', 'video/avi', 'video/mkv'],
  audio: ['audio/mpeg', 'audio/wav','audio/mp3'],
  file: [
    'application/pdf', 
    'application/vnd.ms-powerpoint', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]
};

export function isValidFileType(fileType: string, mimeType: string): boolean {
  return ALLOWED_FILE_TYPES[fileType]?.includes(mimeType) || false;
}
