/* eslint-disable prettier/prettier */
export class Helper {
    static customFileName(req, file, cb) {
      let customFile = file.originalname.split('.')[0];
      customFile =
        customFile + Date.now() + '-' + Math.round(Math.random() * 1e9);
      let fileExtention = '';
      if (file.mimetype.indexOf('jpeg') > -1) {
        fileExtention = '.jpeg';
      } else if (file.mimetype.indexOf('png') > -1) {
        fileExtention = '.png';
      } else if (file.mimetype.indexOf('jpg') > -1) {
        fileExtention = '.jpg';
      }
  
      customFile = customFile + fileExtention;
      cb(null, customFile);
    }
  
    static filePath(req, file, cb) {
      cb(null, './images/')
    }
  }
  