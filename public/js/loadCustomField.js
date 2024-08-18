const customFieldContainer = document.getElementById('customFieldContainer');
const subDepartmentElement =  document.getElementById('sub-department')

const createFormElement = (type, classNames, attributes = {}, innerText = '') => {
    const element = document.createElement(type);
    classNames.forEach(className => element.classList.add(className));
    Object.keys(attributes).forEach(attr => element[attr] = attributes[attr]);
    if (innerText) element.innerText = innerText;
    return element;
};


subDepartmentElement.addEventListener('change', async function(event){

    //empty the previous fields
    customFieldContainer.innerHTML = ''
   
    //now make a request to fetch fields for sub-departmentId
    const subDepartmentId = event.target.value;

        if(userRole === 'user')
                userRole = 'users'
        else if(userRole === 'admin')
                userRole = 'admin'
        else if(userRole === 'super-admin')
                userRole = 'super'
            
    const fetchData = await fetch(`/${userRole}/custom-field/fetch/${subDepartmentId}/all`)
    const customFields = await fetchData.json();
    customFields.forEach(customField => {
        
        const formGroup = createFormElement('div',['form-group']);

        const asterisk = customField.isRequired ? '*' : '';
        
        const label = createFormElement('label',['form-label'], {
            for:customField.fieldName,
        }, (customField.label + asterisk))

        const input = createFormElement('input',['form-control', 'form-input'], {
            name:customField.fieldName,
            type:customField.fieldType,
        })

        if(customField.isRequired)
            input.setAttribute('required','')

        formGroup.appendChild(label)
        formGroup.appendChild(input)

        const div = document.createElement('div');
        div.classList.add('col-md-6');
        div.append(formGroup)
        customFieldContainer.appendChild(div)
        console.log(customFieldContainer)
    })

    
})