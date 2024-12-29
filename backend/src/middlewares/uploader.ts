import multer, { Field } from "multer";

const storage = multer.memoryStorage();
export const uploader = multer({ storage: storage }).single('photo');


export const uploaderForChats = multer({ storage: storage }).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'normalFile', maxCount: 1 }
]);
