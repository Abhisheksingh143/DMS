
const {Branch} = require('../../models/index');

const getBranches = async(req,res) => {

    let branches;
    Branch.findAll().then((result)=>{
       branches = result;
       res.render('super/branch',
        {
            branches
        })
    })
    .catch(err=>{
        console.error(err);
        res.status(500).send('Error fetching branches');
    });

}

const createBranch = (req,res) => {

    const status = 'create';

    res.render('super/branch/create-branch',{status});
}


const editBranch = async(req,res) =>{

    const branchId = req.params.id;
    const status = 'edit';
    try{
        const branch = await Branch.findByPk(branchId);

        if(!branch) throw new Error('No branch found')
        
    return res.render('super/branch/create-branch',
        {
            branch,
            status,
        })

    }
    catch(err){
        console.error(err);
        res.status(500).send('Error fetching Branch of id' + branchId);
    }
   

    res.render('super/branch/create-branch');
}



//post controller


const postCreateBranch = async(req, res) =>{

   try {
    const {branch_name, address} = req.body;
  
    const data = await Branch.create(
        {
            branch_name, 
            address,
        }
    );
    return  res.redirect('/super/branches')

   } catch (error) {
        res.status(500).send(error)
   }

}

const updateBranch = async(req, res)=>{
    
    const branchId = req.params.id;
    const {branch_name, address} =  req.body;
    try{
        const branch = await Branch.findByPk(branchId);
        console.log(branch)
        if(branch){
            branch.branch_name = branch_name;
            branch.address = address;
            await branch.save();
           return  res.redirect('/super/branches');
        }else{
            return   res.status(404).send('Branch not found');
        }
    }catch(error){
        console.log(error);
        res.status(500).send('Error Updating Branch');
    }
}

const deleteDepartment = async(req, res) => {

    try {
        const branchId = req.params.id;

        const result = await Branch.destroy({
            where:{
                id:branchId,
            }
        });

        if (!result) {
            return res.status(404).json({ message: 'No Department found with that ID.' });
        }

      return res.status(200).redirect('/super/branches');

    } catch (error) {
        console.log(error)
        res
        .status(500)
        .json({ message: 'An error occurred while trying to delete the department.' });
    }

}


module.exports = {
    getBranches,
    createBranch,
    postCreateBranch,
    editBranch,
    updateBranch,
    deleteDepartment,
}