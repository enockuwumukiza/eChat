
export interface IImage {
    id: string;
    url: string;
    name:string;
}
export interface IAudio {
    id: string;
    url: string;
    name:string;
}
export interface IVideo {
    id: string;
    url: string;
    name:string;
}

export interface INormalFile {
    id: string;
    url: string;
    name:string;
}
export interface FileFields {
    photo?: Express.Multer.File[];
    video?: Express.Multer.File[];
    audio?: Express.Multer.File[];
    normalFile?: Express.Multer.File[];
}