const documentController = require('../controllers/documentController')
const express = require('express')
const router = express.Router();
const multer = require('multer')
const util =  require('../controllers/utility/documentValidation')
const superDepartmentController = require('../controllers/super-admin/departmentController')
const checkPermissions = require('../middlewares/common')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/temp')
//     },
//     filename: function (req, file, cb) {
//       const fileName = Date.now() + '_' + file.originalname
//       cb(null, fileName)
//     }
//   })
  
  const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 * 1024 } // 50GB
  });



router.get('/',documentController.getDocuments)
router.get('/upload-document', documentController.createDocument)
router.get('/bulk-upload',
    documentController.getBulkUpload
);

router.get('/search', documentController.getSearchResult);

///post routes
router.post('/upload', 
    upload.single('file'), 
    util.fetchCustomFields,
    documentController.createDoc
);

router.post('/bulk-upload', 
    checkPermissions.checkCreatePermission,
    upload.single('bulkUploadFile'),
    documentController.postBulkUpload,
)

router.get('/get',superDepartmentController.findDepartment)
router.get('/findDep/:id', documentController.getDepartmentForUser);

//users/documents/:id/edit
router.get('/:id/edit', checkPermissions.checkEditPermission , documentController.getEditPage)
router.post('/:id/delete',
  checkPermissions.checkDeletePermission,
   documentController.deleteDocument)
//users/documents/:id/update
router.post('/:id/update',
  upload.single('file'),
  documentController.updateDocument);

module.exports = router;