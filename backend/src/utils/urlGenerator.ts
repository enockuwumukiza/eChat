import * as path from 'path'
import DataUriParser from 'datauri/parser'
import { FileOptions } from 'buffer';

export const getFileUrl = (file:Express.Multer.File) =>{
    const parser = new DataUriParser();
    const extname = path.extname(file.originalname).toString();
    return parser.format(extname, file.buffer);
    

}