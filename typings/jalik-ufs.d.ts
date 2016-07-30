declare module "meteor/jalik:ufs" {
  interface Uploader {
    start: () => void;
  }

  interface UploadFS {
    Uploader: (options: any) => Uploader;
  }

  export var UploadFS;
}
