const db = require('../models/index');
const {Department, Branch, Document, sequelize} = db;
const fs = require('fs-extra')
const {validationResult} = require('express-validator')
const unzipper = require('unzipper');
const XLSX = require('xlsx')
const path = require('path');
const {Op} = require('sequelize')

function removeEmptyValues(obj) {
    for (const key in obj) {
      if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  }

  const getBranchForRole = async function(user){

    let branches;

    if(user.role === 'admin') {
      branches = await Branch.findAll({where:{id:user.branch_id}})
    }
    else if(user.role === 'super-admin') {
          branches = await Branch.findAll();
        }
    else{
            branches = await Branch.findAll({where:{id:user.branch_id}})
        }
        return branches;
  }

  async function formatDocument(branch){
    const documents = [];
    let data = 
       branch.departments.forEach(department => {
           department.sub_departments.forEach(subDepartment => {
               subDepartment.documents.forEach(document => { 
                   documents.push({
                       branch_name: branch.id,
                       department_name: department.id,
                       sub_department_name: subDepartment.id,
                       document_name: document.file_name,
                       id:document.id,
                   });
               });
           });
       });
     
    return documents;
  }

  async function getDeptSubDept(user){        
        //now load dept for him
        try {
          const dataForUser = await db.SubDepartmentPermission.findAll({
            where:{user_id : user.id},
            include:[
                {
                    model:db.SubDepartment,
                    include:[Department]
                }
            ]
        });

        return dataForUser
        } catch (error) {
            console.log(error)
        }
  }
  
//upload page
const createDocument = async(req, res) =>{


    const branches = await getBranchForRole(req.session.user);
    
    res.render('document/upload-document',{
        branches,
        messages: req.flash('error')});
}

// document search page
const getDocuments = async(req,res) => {

    try{
        
        const user = req.session.user;
  
        let branches = await getBranchForRole(user);       
        // let documents = await loadDocForIndex(user);
        // return res.json(documents)
        return res.render('document/index', {branches})

    }catch(err){
        console.log(err);
    }
   
}


function rDeptData(dataForUser){

  const subDepartments = Array.from(
    new Set(dataForUser.map(permission => permission.sub_department.id))
  ).map(id => dataForUser.find(permission => permission.sub_department.id === id).sub_department);
  
  // Extract unique departments from the unique sub-departments
  const departmentsData = Array.from(
    new Set(subDepartments.map(sd => sd.department.id))
  ).map(id => subDepartments.find(sd => sd.department.id === id).department);

  return departmentsData;

}

//return departemts alloted based on permission;
const test = async(req,res) => {

    try{
            const user = req.session.user;
            const dataForUser = await getDeptSubDept(user); 

            // const subDepartments = Array.from(
            //     new Set(dataForUser.map(permission => permission.sub_department.id))
            //   ).map(id => dataForUser.find(permission => permission.sub_department.id === id).sub_department);
              
            //   // Extract unique departments from the unique sub-departments
            //   const departments = Array.from(
            //     new Set(subDepartments.map(sd => sd.department.id))
            //   ).map(id => subDepartments.find(sd => sd.department.id === id).department);
            
            const departments = rDeptData(dataForUser);

            return res.json(departments)
    }catch(err){
        console.log(err);
    }
   
}

//return sub-dept alloted permissions based
const getsd = async(req, res) => {
    const user = req.session.user;
    const dataForUser = await getDeptSubDept(user);   
   const subDepartments = Array.from(
                new Set(dataForUser.map(permission => permission.sub_department.id))
              ).map(id => dataForUser.find(permission => permission.sub_department.id === id).sub_department);
              
    return res.json(subDepartments)
}


//bulk upload page
const getBulkUpload = async function(req, res){
    
    const branches = await getBranchForRole(req.session.user);
    
    res.render('document/bulk-upload',{
        branches,
        messages: req.flash('error')});
  
  
  }
        


//post create document single
const createDoc = async function(req, res){
    
    try{           
      // return res.json(req.file.path)

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file selected' });
        }
        const destinationFolder = path.join('public','uploads');

        const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array();
                const err = errorMessages.map(error => error.msg).join('<br>')
                throw new Error(err);
            }
        
         const {subDepartmentId, ...customData} = req.body;
      
        const {originalname, path:filePath} = req.file;
        const updatedName = `${Date.now()}-${originalname}`
        const cleanedData = removeEmptyValues(customData);
        const jsonData = JSON.stringify(cleanedData);
        
       const result =  await Document.create({
            subDepartmentId,
            file_name:updatedName,
            path:`${destinationFolder}/${updatedName}`,
            custom_fields_data:jsonData,
        })

        //move file from temp to uploads
        if(result){

            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder, { recursive: true });
            }
      
            const destinationPath = path.join(destinationFolder,updatedName);

            const stats = await fs.promises.lstat(req.file.path);
            if (stats.isFile()) {
                await fs.promises.rename(req.file.path, destinationPath);
                console.log(`Moved file: ${updatedName}`);
            }
        }

        res.status(200).json({ success: true, message: 'File uploaded successfully!' });
        
    }catch(error){
        
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(err);
            });
        }
        
       const errorMessage = error.message || 'Something went wrong!'
        console.error(error)
        res.status(400).json({ success: false, message: errorMessage });

    }

}



const uploadRecordToDb = async (data, timeStamp, subDepartmentId) => {
    try {

        const records = data.map(docRecord => {

            let {file_name, ...customData} = docRecord;
            file_name = `${timeStamp}_${file_name}`;
            return {
                subDepartmentId,
                file_name,
                path:`public/uploads/${file_name}`,
                custom_fields_data : JSON.stringify(removeEmptyValues(customData))
            }
        })

       const result =  await Document.bulkCreate(records);
       
    console.log('Records uploaded to database successfully');
    } catch (err) {

        console.error('Error uploading records to database:', err);
    }
};

const postBulkUpload = async(req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    
      const zipPath = req.file.path;
      const extractedPath = path.join('public', 'temp');  // Extract files to /public/temp
    
      // Create extracted directory if it doesn't exist
      try {
        console.log('Ensuring directory exists:', extractedPath);
        await fs.ensureDir(extractedPath);
      } catch (err) {
        return res.status(500).send(`Failed to ensure directory: ${err.message}`);
      }
    
   
      // Extract the zip file, filtering out __MACOSX folder
      fs.createReadStream(zipPath)
        .pipe(unzipper.Parse())
        .on('entry', async (entry) => {
          const fileName = entry.path;
          const filePath = path.join(extractedPath, fileName);
    
          // Skip the __MACOSX folder and its contents
          if (fileName.startsWith('__MACOSX/')) {
            entry.autodrain();
          } else if (entry.type === 'Directory') {
            // Create directory to maintain file structure
            await fs.ensureDir(filePath);
            entry.autodrain(); // No data to write, just creating the directory
          } else {
            // Ensure the directory exists before writing the file
            await fs.ensureDir(path.dirname(filePath));
            entry.pipe(fs.createWriteStream(filePath)); // Write the file
          }
        })
        .on('close', async () => {
          try {
            // Get folder name and contents
            const extractFolderName = req.file.originalname.split('.')[0];
            const extractFolder = path.join(extractedPath, extractFolderName);
    
            const files = await fs.readdir(extractFolder);
            const excelFile = files.find(file => file.endsWith('.xlsx'));
    
            if (!excelFile) throw new Error('Excel file not found in zip');
    
            const workbook = XLSX.readFile(path.join(extractFolder, excelFile));
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
    
            // Extract and filter PDF files
            const pdfFiles = files.filter(file => file.endsWith('.pdf'));
            const pdfNamesInExcel = data.map(row => row['file_name']); // Assuming 'file_name' column in Excel
            const discardedPdfs = [];
            for (const pdf of pdfFiles) {
              const pdfPath = path.join(extractFolder, pdf);
              if (pdfNamesInExcel.includes(pdf)) {
                const finalPath = path.join('public', 'uploads', pdf);
                await fs.move(pdfPath, finalPath);
                console.log('Processing and moved:', pdf);
              } else {
                discardedPdfs.push(pdf)
                await fs.remove(pdfPath);
                console.log('Discarded:', pdf);
              }
            }
    
            // Clean up
            await fs.remove(zipPath);  // Remove zip
            await fs.remove(extractFolder); // Remove extracted folder
            res.json({message:'Zip file processed successfully!',notUploaded:discardedPdfs});
          } catch (err) {
            await cleanUpTemp(); // Clean up temp directory on error
            res.status(500).send(`Error processing files: ${err.message}`);
          }
        })
        .on('error', async (err) => {
          await cleanUpTemp(); // Clean up temp directory on extraction error
          res.status(500).send(`Error extracting zip file: ${err.message}`);
        });

}


const getSearchResult = async (req, res) => {
    try {
        
    const {branch_id, department_id, subDepartmentId, search_key, search_value} = req.query;

    if(!search_value) {
      const branch = await Branch.findOne({
        where: { id: branch_id },
        attributes: ['id', 'branch_name'],
        include: {
            model: Department,
            attributes: ['id', 'department_name'],
            include: {
                model: db.SubDepartment,
                attributes: ['id', 'sub_department_name'],
                include: {
                    model: Document,
                    attributes: ['id', 'file_name'] // Adjust attributes as needed
                }
            }
        }
    });
    
    const documents = await formatDocument(branch);

    return res.json(documents)
    }else{

    const documents = await Document.findAll({
        where:{
            subDepartmentId:subDepartmentId,
            custom_fields_data: {
                [Op.like]: `%${search_key}":"${search_value}%`
              },
        }
    })
    
    if (documents.length === 0) {
      return [];
  }

  // Use Promise.all to handle multiple asynchronous operations
  const data = await Promise.all(documents.map(async (doc) => {
      const subDeptId = doc.subDepartmentId;

      // Fetch related data
      const sub_department = await db.SubDepartment.findByPk(subDeptId);
      const department = await Department.findOne({ where: { id: doc.departmentId } });
      const branch = await Branch.findByPk(branch_id);

      return {
          branch_name: branch ? branch.id : 'Unknown Branch',
          department_name: department ? department.id : 'Unknown Department',
          document_name: doc.file_name,
          sub_department_name: sub_department ? sub_department.id : 'Unknown Sub-Department',
          id:doc.id,
      };
  }));
    return res.json(data)
  }
    
    } catch (error) {
        console.error(error)
    }


}

const getDepartmentForUser = async(req, res) => {

    return res.json([{abhisek:'e'}]);
    
}


const getEditPage = async(req, res) => {

  try{
    const docId = req.params.id;
    const {branch:branch_id, department_name, sub_department_name} = req.query;

    const metaData = [
      branch_id,
        department_name,
        sub_department_name
      ]
     
      const document = await Document.findOne({
        where: { id: docId },
        include: [
            {
                model: db.SubDepartment,
                attributes: ['id', 'sub_department_name'],
                include:[
                 { model:Department,
                  attributes:["id","department_name"],
                  include:[{
                   model: Branch,
                  attributes:['id','branch_name']
                  }]
                }
                ]
            }
        ]
    });

   
    const user = req.session.user;
    let branches = await getBranchForRole(user); 
    const dataForUser = await getDeptSubDept(user); //this is for user 
    let departments;
    let subDepartments;
    subDepartments = await db.SubDepartment.findAll({where:{department_id:document.sub_department.department.id}})  
    if(user.role === 'super-admin'){
     departments = await Department.findAll({where:{branchId:branch_id}})
    }
    else if(user.role === 'user'){
      departments = rDeptData(dataForUser);
      //  subDepartments = await db.SubDepartment.findAll({where:{id:document.sub_department.id}})  
      }
    else if(user.role === 'admin'){
    //  subDepartments = await db.SubDepartment.findAll({where:{id:document.sub_department.id}})  
     departments = await Department.findAll({where:{branchId:user.branch_id}})

    }
    
    

    let customFieldsData = JSON.parse(document.custom_fields_data);
    
    const customFields = await db.CustomField.findAll({where:{sub_department_id:document.sub_department.id}})
    return res.render('document/edit', {branches, document, metaData, customFields, departments,subDepartments, customFieldsData })

}catch(err){
    console.log(err);
}


}

const updateDocument = async(req, res) => {

  const docId = req.params.id;
  const {branch:branchId, 
    department:departmentId, 
    subDepartmentId, ...customFields} = req.body;
    const destinationFolder = path.join('public','uploads');

  const cleanedData = removeEmptyValues(customFields);
  const jsonData = JSON.stringify(cleanedData);

  let updateFields = {
    subDepartmentId,
    custom_fields_data:jsonData
};
let updatedName;
if (req.file) {
    // If a file is uploaded, update the document with file details
    const fileName = req.file.originalname;
    const filePath = req.file.path;
    updatedName = `${Date.now()}-${fileName}`;
    updateFields = {
        ...updateFields,
        file_name:updatedName,
        path:`${destinationFolder}/${updatedName}`
    };

    const document = await Document.findByPk(docId);
    if(document && document.path){
      fs.unlink(document.path);
    }

}
  try {
      
    const [affectedRows] = await Document.update(updateFields, {
      where: { id: docId }
  });

   //move file from temp to uploads
   if(affectedRows > 0){

    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
    }

    const destinationPath = path.join(destinationFolder,updatedName);

    const stats = await fs.promises.lstat(req.file.path);
    if (stats.isFile()) {
        await fs.promises.rename(req.file.path, destinationPath);
        console.log(`Moved file: ${updatedName}`);
    }
}else{
  return res.status(404).json({ message: 'Document not found' });
}

  return res.redirect('back')

  } catch (error) {
      console.log(error)
  }

}



const deleteDocument = async(req, res) => {

  try {
    const docId = req.params.id;
    if(!docId) throw new Error('No doc ID found for delete');

    const documment = await Document.destroy({
      where: {
        id: docId
      }
    });

    

    if(!documment) throw new Error('No document Found');
    console.log('Document deleted successfully');

    return res.status(200).redirect('back')
    // await document.delete

  } catch (error) {
    console.log(error);
  }

}



module.exports = {
    createDocument,
    getDocuments,
    createDoc,
    getBulkUpload,
    postBulkUpload,
    getSearchResult,
    getDepartmentForUser,
    test,
    getsd,
    getEditPage,
    deleteDocument,
    updateDocument,
}