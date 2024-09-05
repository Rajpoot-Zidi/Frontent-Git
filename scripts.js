let selectedRow = null;

function formatInput(selector, formatFunction) {
    $(selector).on('input', function () {
        let value = $(this).val().replace(/-/g, ''); // Remove existing dashes
        $(this).val(formatFunction(value));
    });
}

//fetch
document.querySelector('.save').addEventListener('click', function () {
    


   
        const registrationData = {
            firstName: document.getElementById('first-name').value,
            nameUrdu: document.getElementById('name-urdu').value,
            fatherName: document.getElementById('father-name').value,
            fatherNameUrdu: document.getElementById('father-name-urdu').value,
            phoneNumber: document.getElementById('phone-code').value + ' ' + document.getElementById('phone-number').value,
            cnic: document.getElementById('cnic').value,
            status: document.querySelector('input[name="status"]:checked')?.value,
            verified: document.querySelector('input[name="verified"]:checked')?.value === 'yes',
            department: document.getElementById('department').value,
            designation: document.getElementById('Designation').value,
            thumbScan: document.getElementById('thumb-scan').checked ? 'Yes' : 'No',
            formNumber: document.getElementById('form-number').value.toString(),
            image:  document.getElementById('image').value// Get Base64 data from the result
        };

        console.log('Request Payload:', registrationData); // Log the request payload

        fetch('https://localhost:7230/api/Registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        })
        .then(response => {
            console.log('Response Status:', response.status); // Log response status
            if (!response.ok) {
                return response.json().then(error => {
                    console.error('Error Response:', error); // Log error response
                    throw new Error(`HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            // alert('Failed to save data. Please check console for details.');
        });
});



// Function to format phone number as 303-5776608
function formatPhoneNumber(value) {
    if (value.length <= 3) {
        return value;
    } else if (value.length <= 7) {
        return value.slice(0, 3) + '-' + value.slice(3);
    } else {
        return value.slice(0, 3) + '-' + value.slice(3, 10);
    }
}

// Function to format CNIC as 35201-1132415-5
function formatCnic(value) {
    if (value.length <= 5) {
        return value;
    } else if (value.length <= 12) {
        return value.slice(0, 5) + '-' + value.slice(5);
    } else {
        return value.slice(0, 5) + '-' + value.slice(5, 12) + '-' + value.slice(12);
    }
}

// Apply formatting functions to phone number and CNIC
formatInput('#phone-number', formatPhoneNumber);
formatInput('#cnic', formatCnic);

// Save button functionality
document.querySelector('.save').addEventListener('click', function () {
    const firstName = document.getElementById('first-name').value;
    const nameUrdu = document.getElementById('name-urdu').value;
    const fatherName = document.getElementById('father-name').value;
    const fatherNameUrdu = document.getElementById('father-name-urdu').value;
    const phoneCode = document.getElementById('phone-code').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const cnic = document.getElementById('cnic').value;
    const status = document.querySelector('input[name="status"]:checked')?.value;
    const verified = document.querySelector('input[name="verified"]:checked')?.value;
    const department = document.getElementById('department').value;
    const thumbScan = document.getElementById('thumb-scan').checked ? 'Yes' : 'No';
    const formNumber = document.getElementById('form-number').value;
    const rowData = {
        firstName,
        nameUrdu,
        fatherName,
        fatherNameUrdu,
        phoneCode,
        phoneNumber,
        cnic,
        status,
        verified,
        department,
        thumbScan,
        formNumber
    };

    if (selectedRow) {
        updateRow(selectedRow, rowData);
        selectedRow = null;
    } else {
        addRow(rowData);
    }

    // resetForm();
});

// Function to add a new row to the table

// Function to add a new row to the table
function addRow(rowData) {
    const table = document.getElementById('output');
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type='checkbox' class='row-select'></td>
        <td class='Namez'>${rowData.firstName}</td>
        <td>${rowData.phoneNumber}</td>
        <td>${rowData.cnic}</td>
        <td>${rowData.verified ? 'Yes' : 'No'}</td>
        <td>${rowData.department}</td>
        <td>${rowData.status}</td>
        <td>${rowData.thumbScan}</td>
        <td class='formnumz' style='display:none'>${rowData.formNumber}</td>
        <td class='fnz' style='display:none'>${rowData.fatherName}</td>
        <td class='imagez' style='display:none'>${rowData.image}</td>
    `;

    newRow.addEventListener('click', function () {
        selectedRow = newRow;
        populateForm(rowData);
    });
}

// Function to update an existing row
function updateRow(row, rowData) {
    row.cells[1].innerText = rowData.firstName;
    row.cells[2].innerText = rowData.phoneNumber;
    row.cells[3].innerText = rowData.cnic;
    row.cells[4].innerText = rowData.status;
    row.cells[5].innerText = rowData.verified ? 'Yes' : 'No';
    row.cells[6].innerText = rowData.department;
    row.cells[7].innerText = rowData.thumbScan;
}

// Function to populate the form with data from a row
function populateForm(rowData) {
    document.getElementById('first-name').value = rowData.firstName;
    document.getElementById('name-urdu').value = rowData.nameUrdu;
    document.getElementById('father-name').value = rowData.fatherName;
    document.getElementById('father-name-urdu').value = rowData.fatherNameUrdu;
    document.getElementById('phone-code').value = rowData.phoneCode;
    document.getElementById('phone-number').value = rowData.phoneNumber;
    document.getElementById('cnic').value = rowData.cnic;
    document.querySelector(`input[name="status"][value="${rowData.status}"]`).checked = true;
    document.querySelector(`input[name="verified"][value="${rowData.verified ? 'yes' : 'no'}"]`).checked = true;
    document.getElementById('department').value = rowData.department;
    document.getElementById('thumb-scan').checked = rowData.thumbScan === 'Yes';
    document.getElementById('form-number').value = rowData.formNumber;
}

// Function to reset the form
function resetForm() {
    document.getElementById('registration-form').reset();
}

// Filter functionality
function filterTable() {
    const filterName = document.getElementById('filter-name').value.toLowerCase();
    const filterPhone = document.getElementById('filter-phone').value.toLowerCase();
    const filterCnic = document.getElementById('filter-cnic').value.toLowerCase();
    const filterStatusActive = document.getElementById('filter-status-active').checked;
    const filterStatusInactive = document.getElementById('filter-status-inactive').checked;
    const filterVerifiedYes = document.getElementById('filter-verified-yes').checked;
    const filterVerifiedNo = document.getElementById('filter-verified-no').checked;
    const filterDepartment = document.getElementById('filter-department').value.toLowerCase();
    const filterThumbScanYes = document.getElementById('filter-thumbscan-yes').checked;
    const filterThumbScanNo = document.getElementById('filter-thumbscan-no').checked;
    const rows = document.querySelectorAll('#output tr');

    rows.forEach(row => {
        const name = row.cells[1].innerText.toLowerCase();
        const phone = row.cells[2].innerText.toLowerCase();
        const cnic = row.cells[3].innerText.toLowerCase();
        const status = row.cells[4].innerText.toLowerCase();
        const verified = row.cells[5].innerText.toLowerCase();
        const department = row.cells[6].innerText.toLowerCase();
        const thumbScan = row.cells[7].innerText.toLowerCase();

        let showRow = true;

        if (filterName && !name.includes(filterName)) showRow = false;
        if (filterPhone && !phone.includes(filterPhone)) showRow = false;
        if (filterCnic && !cnic.includes(filterCnic)) showRow = false;
        if (filterStatusActive && status !== 'active') showRow = false;
        if (filterStatusInactive && status !== 'inactive') showRow = false;
        if (filterVerifiedYes && verified !== 'yes') showRow = false;
        if (filterVerifiedNo && verified !== 'no') showRow = false;
        if (filterDepartment && department !== filterDepartment) showRow = false;
        if (filterThumbScanYes && thumbScan !== 'yes') showRow = false;
        if (filterThumbScanNo && thumbScan !== 'no') showRow = false;

        row.style.display = showRow ? '' : 'none';
    });
}

document.querySelectorAll('input[type="text"], input[type="checkbox"], select').forEach(filterInput => {
    filterInput.addEventListener('input', filterTable);
});
// Update button functionality
document.querySelector('.update').addEventListener('click', function () {
    if (selectedRow) {
        selectedRow.cells[1].innerHTML = document.getElementById('first-name').value;
        selectedRow.cells[2].innerHTML = `${document.getElementById('phone-code').value} ${document.getElementById('phone-number').value}`;
        selectedRow.cells[3].innerHTML = document.getElementById('cnic').value;
        selectedRow.cells[4].innerHTML = document.querySelector('input[name="status"]:checked')?.value;
        selectedRow.cells[5].innerHTML = document.querySelector('input[name="verified"]:checked')?.value;
        selectedRow.cells[6].innerHTML = document.getElementById('department').value;
        selectedRow.cells[7].innerHTML = document.getElementById('thumb-scan').checked ? 'Yes' : 'No';

        // Reset the selectedRow
        selectedRow = null;
        document.getElementById('registration-form').reset();
    }
});

// Delete button functionality
document.querySelector('.delete').addEventListener('click', function () {
    const checkboxes = document.querySelectorAll('#output input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.closest('tr').remove();
        }
    });
    selectedRow = null;
    document.getElementById('registration-form').reset();
});

// Search button functionality
document.querySelector('.search').addEventListener('click', function () {
    const name = document.getElementById('first-name').value.toLowerCase();
    const rows = document.querySelectorAll('#output tr');
    rows.forEach(row => {
        row.style.display = row.cells[1].innerText.toLowerCase().includes(name) ? '' : 'none';
    });
});

// Reset button functionality
document.querySelector('.reset').addEventListener('click', function () {
    document.getElementById('registration-form').reset();
    selectedRow = null;
});

//image 
// function previewImage(event) {
//     const imagePreview = document.getElementById('imagePreview');
//     const file = event.target.files[0];

//     if (file) {
//         const reader = new FileReader();
        
//         reader.onload = function(e) {
//             imagePreview.src = e.target.result;
//             imagePreview.style.display = 'block';
//         }

//         reader.readAsDataURL(file);
//     } else {
//         imagePreview.src = '#';
//         imagePreview.style.display = 'none';
//     }
// }


// Row selection for editing
document.querySelector('#output').addEventListener('click', function (e) {
    if (e.target.tagName === 'TD' || e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        selectedRow = e.target.closest('tr');
        document.getElementById('first-name').value = selectedRow.cells[1].innerHTML;
        const phone = selectedRow.cells[2].innerHTML.split(' ');
        document.getElementById('phone-code').value = phone[0];
        document.getElementById('phone-number').value = phone.slice(1).join(' ');
        document.getElementById('cnic').value = selectedRow.cells[3].innerHTML;
        document.querySelector(`input[name="status"][value="${selectedRow.cells[4].innerHTML}"]`).checked = true;
        document.querySelector(`input[name="verified"][value="${selectedRow.cells[5].innerHTML}"]`).checked = true;
        document.getElementById('department').value = selectedRow.cells[6].innerHTML;
        document.getElementById('thumb-scan').checked = selectedRow.cells[7].innerHTML === 'Yes';
    }
});

// Select all functionality
document.getElementById('select-all').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('#output input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});



// load from backend 
// Function to load data from the backend and populate the table
function loadFromBackend() {
    fetch('https://localhost:7230/api/Registration')
        .then(response => response.json())
        .then(data => {
            data.forEach(rowData => addRow(rowData));
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
}


document.addEventListener('DOMContentLoaded', loadFromBackend);
document.addEventListener('DOMContentLoaded', function () {
   
});
// Display the uploaded image preview
// document.getElementById('fileToUpload').addEventListener('change', function () {
//     const img = document.getElementById('uploadedImage');
//     const reader = new FileReader();
//     reader.onload = function (event) {
//         img.src = event.target.result;
//         img.style.display = 'block';
//     };
//     reader.readAsDataURL(this.files[0]);
// });

//card 


// document.getElementById('generatePdfButton').addEventListener('click', function () {
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();

//     // Overlay text on the report
//     const name = document.getElementById('first-name').value;
//     const fatherName = document.getElementById('father-name').value;
//     const formNumber = document.getElementById('form-number').value;

//     doc.setFontSize(12);
//     doc.text(name, 50, 80); // Adjust positions accordingly
//     doc.text(fatherName, 50, 90); // Adjust positions accordingly
//     doc.text(formNumber, 50, 100); // Adjust positions accordingly

//     const img = document.getElementById('fileToUpload').files[0];
//     if (img) {
//         const reader = new FileReader();
//         reader.onload = function (event) {
//             const imgData = event.target.result;
//             // Add the image as background or wherever needed
//             doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // Adjust the dimensions accordingly
//             doc.save('Report.pdf'); // Save PDF with image
//         };
//         reader.readAsDataURL(img);
//     } else {
//         doc.save('Report.pdf'); // Save PDF without image
//     }
// });



// $(document).ready(function() {
//     $('#generatePdfButton').click(function() {
//         const departmentDropdown = $('#filter-department');
//         const departmentValue = departmentDropdown.val();
        
//         // Check if department dropdown exists and get its value
//         if (departmentDropdown.length === 0) {
//             alert('Department dropdown not found.');
//             return;
//         }
//         document.addEventListener('DOMContentLoaded', function() {
//             // Get the department select element
//             var departmentSelect = document.getElementById('department');
        
//             // Add an event listener for when the department changes
//             departmentSelect.addEventListener('change', function() {
//                 // Get the selected department value
//                 var selectedDepartment = departmentSelect.value;
        
//                 // Get all the cards (assuming you have multiple cards)
//                 var cards = document.getElementsByClassName('card');
        
//                 // Loop through each card and change the color based on the department
//                 for (var i = 0; i < cards.length; i++) {
//                     if (selectedDepartment === 'security') {
//                         cards[i].style.backgroundColor = '#ec3237'; // Red color for security
//                         cards[i].style.borderColor = '#ec3237';
//                     } else if (selectedDepartment === 'parking') {
//                         cards[i].style.backgroundColor = '#3e4095'; // Purple color for parking
//                         cards[i].style.borderColor = '#3e4095';
//                     } else if (selectedDepartment === 'pandal') {
//                         cards[i].style.backgroundColor = '#00a651'; // Green color for pandal
//                         cards[i].style.borderColor = '#00a651';
//                     }
//                 }
//             });
//         });

//         console.log("Selected Department Value:", departmentValue);

//         // Change the card's border color based on the department
//         let borderColor;
//         switch(departmentValue) {
//             case 'Pandal':
//                 borderColor = '#00a651'; // Green
//                 break;
//             case 'Parking':
//                 borderColor = '#3e4095'; // Blue
//                 break;
//             case 'Security':
//                 borderColor = '#ec3237'; // Red
//                 break;
//             default:
//                 borderColor = '#00a651'; // Default to Green
//                 break;
//         }

//         // Apply the color to the card's border
//         $('.card-container').css('border-color', borderColor);

//         // Get values from the form
//         const name = $('#first-name').val();
//         const fatherName = $('#father-name').val();
//         const formNumber = $('#form-number').val();

//         // Set values in the card
//         $('#card-name').val(name);
//         $('#card-father-name').val(fatherName);
//         $('#card-form-number').val(formNumber);
//         $('#card-duty').text(departmentValue); // Set the duty field

//         // Temporarily show the card for screenshot
//         $('#card-container').show();

//         // Generate PDF
//         html2canvas(document.querySelector('#card-container')).then(canvas => {
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', [638, 1013]); // Custom size in mm

//             pdf.addImage(imgData, 'PNG', 10, 10); // Adjust position if needed
//             pdf.save("card.pdf");

//             // Hide the card again after capturing
//             $('#card-container').hide();
//         }).catch(err => {
//             console.error("Error generating PDF:", err);
//         });
//     });
// });

const { jsPDF } = window.jspdf;

function generatePDF() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('template');

    // Ensure the image is fully loaded before proceeding
    if (!img.complete) {
        img.onload = generatePDF;
        return;
    }

    // Set canvas size to match the image size
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get form data
    
    debugger;
    // Set font properties
    ctx.font = '50px Arial';
    ctx.fillStyle = 'red';

    // Overlay text onto the image (adjust coordinates accordingly)
    test12 = document.getElementsByClassName('Namez');
    
for (let i= 0; i < test12.length; i++) {
    const firstName = document.getElementsByClassName('Namez')[i].innerHTML;
    const fatherName = document.getElementsByClassName('fnz')[i].innerHTML;
    const formNumber = document.getElementsByClassName('formnumz')[i].innerHTML;
     if (i <= 4) {
        // if (i  < 1) {let x = i+1;
        //     ctx.fillText(firstName, 350+x, 770);
        //     ctx.fillText(fatherName, 350+x, 870);
        //     ctx.fillText(formNumber, 250+x, 970);

        // } else {
        //      let x = i+400;
        //     ctx.fillText(firstName, 350+x, 770);
        //     ctx.fillText(fatherName, 350+x, 870);
        //     ctx.fillText(formNumber, 250+x, 970);
        // }
   for (let x = 1; x <= 4550; x= x+950){
         ctx.fillText(firstName, 450+x, 770);
            ctx.fillText(fatherName, 450+x, 870);
            ctx.fillText(formNumber, 250+x, 970);   
   }
   
   
}
}
    
    
    // ctx.fillText(firstName, 750, 770);
    // ctx.fillText(fatherName, 750, 870);
    // ctx.fillText(formNumber, 750, 970);

    // Handle image upload
    const fileInput = document.getElementById('image');
    const uploadedImage = new Image();
    const reader = new FileReader();

    reader.onload = function(event) {
        uploadedImage.src = event.target.result;
        uploadedImage.onload = function() {
            // Draw the uploaded image on the canvas at specified coordinates (adjust coordinates as needed)
            ctx.drawImage(uploadedImage, 50, 200, 90, 90);

            // Convert canvas to image and then to PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            const imageData = canvas.toDataURL('image/jpeg');
            console.log('Image data:', imageData); // Debugging log
            pdf.addImage(imageData, 'JPEG', 0, 0, canvas.width, canvas.height);

            // Save the PDF
            pdf.save('report.pdf');
            console.log('PDF generated and download triggered'); // Debugging log
        };
    };

    if (fileInput.files[0]) {
        console.log('Image file selected, processing...'); // Debugging log
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // If no image is uploaded, still generate the PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        const imageData = canvas.toDataURL('image/jpeg');
        console.log('Image data:', imageData); // Debugging log
        pdf.addImage(imageData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save('report.pdf');
        console.log('PDF generated and download triggered'); // Debugging log
    }
}


  
// document.getElementById('generatePdfBtn').addEventListener('click', function() {
//     // Initialize jsPDF
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();

//     // Get the content of the form
//     const formContent = document.getElementById('output-container').innerText;

//     // Add the content to the PDF
//     doc.text(formContent, 10, 10);

//     // Save the PDF with the desired name
//     doc.save('output_form.pdf');
// });


//output form pdf generation
document.getElementById('generatePdfBtn').addEventListener('click', function() {
    const element = document.getElementById('output-container');
    
    html2canvas(element).then(canvas => {
        // Convert the canvas to an image
        const imgData = canvas.toDataURL('image/png');
        
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add the image to the PDF
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save the PDF
        pdf.save('output_form.pdf');
    });
});






//fingerprint 
document.getElementById('fingerprintScan').addEventListener('click', function() {
    fetch('/Fingerprint/StartCapture')
        .then(response => response.json())
        .then(data => {
            document.getElementById('fingerprintData').value = data.fingerprintTemplate;
        });
});
