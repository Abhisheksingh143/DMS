const createFormElement = (type, classNames, attributes = {}, innerText = '') => {
    const element = document.createElement(type);
    classNames.forEach(className => element.classList.add(className));
    Object.keys(attributes).forEach(attr => element[attr] = attributes[attr]);
    if (innerText) element.innerText = innerText;
    return element;
};

function addCustomField(customField = null, isNew = true) {
    
    const customFieldsContainer = document.getElementById('customFieldsContainer');
    const fieldCount = customFieldsContainer.children.length;
    const fieldDiv = document.createElement('div');
    fieldDiv.style.display = 'flex';
    fieldDiv.style.padding = '0px 40px';
    fieldDiv.style.justifyContent = 'space-between';
    fieldDiv.style.alignItems = 'center';

    // Field Type
    const fieldTypeDiv = createFormElement('div', ['form-group']);
    const fieldTypeLabel = createFormElement('label', ['form-label'], {}, 'Field Type:');
    const fieldTypeSelect = createFormElement('select', ['form-select'], { name: `customFields[${fieldCount}][fieldType]` });

    ['Text', 'Number', 'Date', 'Email'].forEach(option => {
        const opt = createFormElement('option', [], { value: option.toLowerCase() }, option);
        if(customField && customField.fieldType === option.toLocaleLowerCase()) 
            opt.selected = true;
        fieldTypeSelect.appendChild(opt);
    });

    fieldTypeDiv.appendChild(fieldTypeLabel);
    fieldTypeDiv.appendChild(fieldTypeSelect);
    fieldDiv.appendChild(fieldTypeDiv);

    // Field Name
    const fieldNameDiv = createFormElement('div', ['form-group']);
    const fieldNameLabel = createFormElement('label', ['form-label'], {}, 'Field Name:');
    const fieldNameInput = createFormElement('input', ['form-control', 'form-input'], 
        {
            type: 'text', 
            name: `customFields[${fieldCount}][label]`, 
            required: true, 
            value: customField ? customField.label : '',
            style: 'width: auto;' 
        });

    fieldNameDiv.appendChild(fieldNameLabel);
    fieldNameDiv.appendChild(fieldNameInput);
    fieldDiv.appendChild(fieldNameDiv);

    // Field Required Status
    const fieldRequiredDiv = createFormElement('div', ['form-group']);
    const fieldRequiredLabel = createFormElement('label', ['form-label'], {}, 'Required:');
    const fieldRequiredSelect = createFormElement('select', ['form-select', 'form-select-sm'], { name: `customFields[${fieldCount}][isRequired]`, style: 'width: auto;' });

    ['Yes', 'No'].forEach(option => {
        const opt = createFormElement('option', [], { value: option === 'Yes' ? 1 : 0 }, option);
        if(customField && customField.isRequired === (option === 'Yes' ? 1 : 0) )
            opt.selected = true;
        fieldRequiredSelect.appendChild(opt);
    });

    fieldRequiredDiv.appendChild(fieldRequiredLabel);
    fieldRequiredDiv.appendChild(fieldRequiredSelect);
    fieldDiv.appendChild(fieldRequiredDiv);

    //hidden field to pass id as well
    if(customField) {
        const customFieldId = customField.id
        const hiddenInput = createFormElement('input', ['form-control', 'form-input'], 
        {
            type: 'hidden', 
            name: `customFields[${fieldCount}][id]`, 
            value: customFieldId,
            style: 'width: auto;' 
        })
        console.log(hiddenInput)
        fieldDiv.appendChild(hiddenInput);
    };


    // Delete Button
    
    const deleteButton = createFormElement('button', ['btn', 'btn-danger'], {}, 'Delete');
    deleteButton.style.marginLeft = '10px';

    //if customField exist then use form to delete
    //else dont put it in form

    if(customField) {
        //first create form and then 
        const formElement = createFormElement('form',[],
            {
            method:'post', 
            action:`/super/custom-field/${customField.id}/delete`
        });
        formElement.appendChild(deleteButton);
        fieldDiv.appendChild(formElement);
    } 
    else
   { deleteButton.addEventListener('click', () => customFieldsContainer.removeChild(fieldDiv));
    fieldDiv.appendChild(deleteButton);}
    customFieldsContainer.appendChild(fieldDiv);
}


function loadExistingFields(customFields) {

    customFields.forEach(field => addCustomField(field, false))

}






