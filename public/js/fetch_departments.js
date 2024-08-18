document.addEventListener('DOMContentLoaded', (event) => {

    const branchSelect = document.getElementById('branch');
    const departmentSelectElement = document.getElementById('department');                
    const subDepartmentElement = document.getElementById('sub-departments');
    
    // Assuming userRole is defined globally in your EJS template
    // const userRole = "<%= user.role %>";

    branchSelect.addEventListener('change', loadDepartments);
    if(userRole === 'admin' || userRole === 'super-admin')
    departmentSelectElement.addEventListener('change', loadSubDepartments);
   
    async function loadSubDepartments(event) {
        subDepartmentElement.innerHTML = '';
        const departmentId = event.target.value;

    
        // Fetch sub-departments 
        
        let url = `/${userRole === 'super-admin' ? 'super' : 'admin'}/sub-departments/getsubdepartment/${departmentId}`;

        // if(userRole === 'user')
        //     url = '/users/'

        const response = await fetch(url);
        const subDepartments = await response.json();

        subDepartments.forEach(subDepartment => {
            const optionElement = document.createElement('option');
            optionElement.value = subDepartment.id;
            optionElement.textContent = subDepartment.sub_department_name;
            subDepartmentElement.appendChild(optionElement);
        });

        subDepartmentElement.insertAdjacentHTML('afterbegin',
            '<option selected value="">Choose Sub Department</option>');
    }

    async function loadDepartments(event) {
       
        departmentSelectElement.innerHTML = '';
        const branchId = event.target.value;

        // Dynamically determine the URL based on the user role
       
        let url = `/${userRole === 'super-admin' ? 'super' : 'admin'}/departments/get/?branchId=${branchId}`;
            if(userRole === 'user')
                url ='/users/docs/'
            
            
        const response = await fetch(url);
        const departments = await response.json();

      
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.id;
            option.textContent = department.department_name;
            departmentSelectElement.appendChild(option);
        });

        departmentSelectElement.insertAdjacentHTML('afterbegin',
            '<option selected value="">Choose Department</option>');
    }

});
