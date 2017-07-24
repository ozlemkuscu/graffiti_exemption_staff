"use strict";

callback({
    "items": [
        {
            "title": "config",
            "summary":
            {
                'title': 'Graffiti Exemption',
                'v2': { 'title': "Graffiti Exemption" },
                'dateTimeFormat': 'MM/DD/YYYY hh:mm',
                'dateTimeFormat2': 'YYYY/MM/DD hh:mm',
                'dateTimeFormat3': 'MM/DD/YYYY hh:mm a',
                'dateFormat': 'MM/DD/YYYY',
                'dateFormat2': 'YYYY-MM-DD',
                'dateFormatView': 'YYYY/MM/DD h:mm a',
                'timeFormat': 'h:mm a',
                'default_repo': 'graffiti_exemption',
                'formName': { 'demo': 'Graffiti Exemption Form' },
                'timeOutMsg': '<br><br><p><strong>The session will time out after 15 minutes of inactivity, please save your work.</strong></p>',
                'geoURL': '//map.toronto.ca/geoservices/rest/search/rankedsearch',
                'geoParam': '&searchArea=1&matchType=1&projectionType=1&retRowLimit=10',
                'pointerType': {
                    'title': 'Pointer',
                    'choices': [{ 'text': 'Select one', 'value': '' }]
                },
                'button': {
                    'submit': 'Submit',
                    'edit': 'Edit',
                    'submitPublic': 'Submit Public',
                    'createNewEntry': 'Create New',
                    'viewSubmissions': 'View Submissions',
                    'print': 'Print',
                    'exportCsv': 'Export to CSV',
                    'exportExcel': 'Export to Excel',
                    'viewEdit': 'View / Edit',
                    'delete': 'Delete',
                    'addNewItem': 'Add New Item',
                    'removeItem': 'Remove Item',
                    'clearItem': 'Clear Item',
                    'saveReport': 'Save Draft',
                    'save': 'Save',
                    'notifyReport': 'Notify Captain',
                    'submitReport': 'Submit',
                    'submitPublicReport': 'Submit Public',
                    'approveReport': 'Approve',
                    'rejectReport': 'Reject',
                    'removeReport': 'Remove Record',
                    'removeTitle': 'Remove Item',
                    'createReport': 'Create Report',
                    'reports': 'Reports'
                },
                'sameAsAbove': {
                    'title': '',
                    'choices': [{ 'text': 'Same As Above', 'value': 'Same As Above' }]
                },
                'choices': {
                    'yesNo': [{
                        'text': 'Yes',
                        'value': 'y'
                    }, {
                        'text': 'No',
                        'value': 'n'
                    }],
                    'yesNoSelect': [{
                        'text': 'Select One',
                        'value': ''
                    }, {
                        'text': 'Yes',
                        'value': 'y'
                    }, {
                        'text': 'No',
                        'value': 'n'
                    }],
                    'yesNoFull': [{
                        'text': 'Yes',
                        'value': 'Yes'
                    }, {
                        'text': 'No',
                        'value': 'No'
                    }],
                    'yesNoNA': [{
                        'text': 'Yes',
                        'value': 'y'
                    }, {
                        'text': 'No',
                        'value': 'n'
                    }, {
                        'text': 'N/A',
                        'value': 'n/a'
                    }]
                },
                'httpHost': {
                    'rootPath': {
                        'local': '/',
                        'dev': '/webapps/work/decom/graffiti_exemption_staff/',
                        'qa': '/webapps/graffiti_exemption_staff/',
                        'prod': '/webapps/graffiti_exemption_staff/'
                    },
                    'rootPath_public': {
                        'local': '/',
                        'dev': '/webapps/work/decom/graffiti_exemption_public/',
                        'qa': '/webapps/graffiti_exemption_public/',
                        'prod': '/webapps/graffiti_exemption_public/'
                    },
                    'root': {
                        'local': 'localhost',
                        'dev': 'https://was-intra-sit.toronto.ca',
                        'qa': 'https://was-intra-qa.toronto.ca',
                        'prod': 'https://insideto-secure.toronto.ca'
                    },
                    'root_public': {
                        'local': 'localhost',
                        'dev': 'https://was-inter-sit.toronto.ca',
                        'qa': 'https://was-inter-qa.toronto.ca',
                        'prod': 'https://secure.toronto.ca'
                    },
                    'app': {
                        'local': 'https://was-intra-sit.toronto.ca',
                        'dev': 'https://was-intra-sit.toronto.ca',
                        'qa': 'https://was-intra-qa.toronto.ca',
                        'prod': 'https://insideto-secure.toronto.ca'
                    },
                    'app_public': {
                        'local': 'https://was-inter-sit.toronto.ca',
                        'dev': 'https://was-inter-sit.toronto.ca',
                        'qa': 'https://was-inter-qa.toronto.ca',
                        'prod': 'https://secure.toronto.ca'
                    },
                    'eventDispatcher': {
                        'dev': 'http://cheetah-b4.corp.toronto.ca:5680',
                        'qa': 'https://esb1qa.toronto.ca:5680',
                        'prod': 'https://esb1.toronto.ca:5680'
                    }
                },
                'api': {
                    'get': '/cc_sr_admin_v1/retrieve/eventrepo/',
                    'post': '/cc_sr_admin_v1/submit/',
                    'put': '/cc_sr_admin_v1/submit/eventrepo/',
                    'delete': '/cc_sr_admin_v1/submit/eventrepo/',
                    'email': '/cc_sr_admin_v1/submit/graffiti_exemption_email',
                    'eventDispatcher': '/rest/COTEventDispatcher_V2/REST',
                    'upload': '/cc_sr_admin_v1/upload/',
                    'session': '/cc_sr_admin_v1/session/',
                    'timeout': 60
                },
                'api_public': {
                    'post': '/cc_sr_v1/submit/',
                    'upload': '/cc_sr_v1/upload/',
                    'email': '/cc_sr_v1/submit/graffiti_exemption_email'
                },
                'members': {
                    'app_g': 'G',
                    'app_admin': 'testweb1,MLS_user,MLS_admin,okuscu,bkiri'
                },
                'admin_emails': {
                    'Ozlem Kuscu Yahoo': 'ozlemkuscu@yahoo.ca',
                    'Ozlem Kuscu Gmail': 'ozkuscu@gmail.com'
                },
                'captain_emails': {
                    'Ozlem Kuscu': 'ozlem.kuscu@toronto.ca'
                },
                'recStatus': {
                    'title': 'Status',
                    choices: [
                        { 'text': 'New', 'value': 'New' },
                        { 'text': 'Review In Progress', 'value': 'Review In Progress' },
                        { 'text': 'Approved', 'value': 'Approved' },
                        { 'text': 'Denied', 'value': 'Denied' },
                        { 'text': 'Invalid Requests', 'value': 'Invalid Requests' }
                    ]
                },
                'messages': {
                    'current': '',
                    'load': {
                        'fail': 'Unable to load! Report could not be retrieved. Please try again.'
                    },
                    'save': {
                        'done': 'Saved! This report was successfully saved.',
                        'fail': 'Unable to save! This report could not be saved. Please try again.'
                    },
                    'notify': {
                        'done': 'Notified! This report was successfully sent to the Emergency Management Captain.',
                        'fail': 'Unable to notify! This report could not be sent to the Emergency Management Captain. Please try again.',
                        'emailFrom': 'wmDev@toronto.ca',
                        'emailSubject': 'New Graffiti Exemption Document',
                        'emailBody': 'New Graffiti Bylaw regularisation application has been received.',
                        'sendNotification': true
                    },
                    'submit': {
                        'done': 'Thank you! Your request has been received.',
                        'fail': 'Unable to submit! This report could not be submitted to the Administrator. Please try again.'
                    },
                    'approve': {
                        'done': 'Approved! This report was successfully approved.</div>',
                        'fail': 'Unable to approve! This report could not be approved. Please try again.'
                    },
                    'reject': {
                        'done': 'Rejected! This report was successfully rejected and assigned back to the incident manager.',
                        'fail': 'Unable to reject! This report could not be rejected. Please try again.'
                    },
                    'delete': {
                        'done': 'Deleted! Report was successfully deleted.',
                        'fail': 'Unable to delete! This report could not be deleted. Please try again.'
                    },
                    'noSubmissionsFound': 'No submissions found.',
                    'fadeOutTime': 8000
                },
                'auth': {
                    'login': '<h2>Session timeout! Please log in to access this application.</h2>',
                    'group': '<h2>Unauthorized! You don\'t have sufficient group permissions to view this application.</h2>'
                },
                'status': {
                    'Draft': 'Yes',
                    'Submitted': 'Submitted',
                    'Approved': 'Approved',
                    'Deleted': 'Deleted',
                    'Yes': 'New',
                    'Denied': 'Denied',
                    'Invalid': 'Invalid',
                    'Search': 'Global Search',
                    'All': 'All',
                    'DraftApp': 'New',
                    'YesApp': 'New',
                    'SubmittedApp': 'Review In Progress',
                    'ApprovedApp': 'Approved',
                    'DeletedApp': 'Deleted',
                    'DeniedApp': 'Denied',
                    'InvalidApp': 'Invalid Requests'
                },
                'modal': {
                    'confirmRemoveReport': 'Are you sure you want to permanently remove this record?',
                    'confirmRemoveTitle': 'Are you sure you want to remove this item from this application?'
                },
                'admin':
                {
                    'docDropzonePublic': {
                        "acceptedFiles": "image/*,application/pdf,application/PDF,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "maxFiles": 3,
                        "dictDefaultMessage": "Drop files here or <button class='btn-link' aria-label='File Upload - Drop files here or click to upload' type='button'>select</button> to upload.",
                        "maxFilesize": 10,
                        "dictFileTooBig": "Maximum size for file attachment is 10 MB",
                        "addRemoveLinks": true,
                        "dictMaxFilesExceeded": "Maximum 3 uploaded file"
                    },
                    'docDropzoneStaff': {
                        "acceptedFiles": "image/*,application/pdf,application/PDF,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "maxFiles": 3,
                        "dictDefaultMessage": "Drop files here or <button class='btn-link' aria-label='File Upload - Drop files here or click to upload' type='button'>select</button> to upload.",
                        "maxFilesize": 10,
                        "dictFileTooBig": "Maximum size for file attachment is 10 MB",
                        "addRemoveLinks": true,
                        "dictMaxFilesExceeded": "Maximum 3 uploaded file"
                    },
                    'imageDropzonePublic': {
                        "acceptedFiles": "image/*,application/pdf,application/PDF,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "maxFiles": 3,
                        "dictDefaultMessage": "Drop files here or <button class='btn-link' aria-label='File Upload - Drop files here or click to upload' type='button'>select</button> to upload.",
                        "maxFilesize": 10,
                        "dictFileTooBig": "Maximum size for file attachment is 10 MB",
                        "addRemoveLinks": true,
                        "dictMaxFilesExceeded": "Maximum 3 uploaded file"
                    },
                    'imageDropzoneStaff': {
                        "acceptedFiles": "image/*,application/pdf,application/PDF,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "maxFiles": 3,
                        "dictDefaultMessage": "Drop files here or <button class='btn-link' aria-label='File Upload - Drop files here or click to upload' type='button'>select</button> to upload.",
                        "maxFilesize": 10,
                        "dictFileTooBig": "Maximum size for file attachment is 10 MB",
                        "addRemoveLinks": true,
                        "dictMaxFilesExceeded": "Maximum 3 uploaded file"
                    }
                }
            }
        },
        {
            "summary": "Same As Above",
            "title": "Same As Above"
        },
        {
            "summary": "Please upload minimum one image.",
            "title": "imageValidation"
        },
        {
            "title": "breadcrumbtrail",
            "summary": [{
                "name": "Living In Toronto",
                "link": "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=38bebd6fe941a510VgnVCM10000071d60f89RCRD"
            }, {
                "name": "Transportation",
                "link": "http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=e10086195a7c1410VgnVCM10000071d60f89RCRD"
            }]
        },
        {
            "summary": "Open",
            "title": "View_Edit"
        },
        {
            "summary": "Request for Regularization for Art Mural/Graffiti Art under Municipal Code Chapter 485, Graffiti",
            "title": "Form Title"
        }, {
            "summary": "Admin Section",
            "title": "Admin Section"
        }, {
            "summary": "Contact Person",
            "title": "Contact Details Section"
        }, {
            "summary": "Created",
            "title": "Profile Created"
        }, {
            "summary": "Submission Date",
            "title": "Submission Date Column"
        }, {
            "summary": "Name",
            "title": "Name"
        }, {
            "summary": "First Name",
            "title": "First Name"
        }, {
            "summary": "Last Name",
            "title": "Last Name"
        }, {
            "summary": "Address",
            "title": "Address"
        }, {
            "summary": "City",
            "title": "City"
        }, {
            "summary": "Postal Code",
            "title": "Postal Code"
        }, {
            "summary": "Phone",
            "title": "Phone"
        }, {
            "summary": "Fax",
            "title": "Fax"
        }, {
            "summary": "Email",
            "title": "Email"
        }, {
            "summary": "Descriptive Location",
            "title": "graffitiDesLocation"
        }, {
            "summary": "Mural/Graffiti Location",
            "title": "Graffiti Section"
        }, {
            "summary": "Art Address",
            "title": "Graffiti Address"
        }, {
            "summary": "City",
            "title": "Graffiti City"
        }, {
            "summary": "Postal Code",
            "title": "Graffiti Postal Code"
        }, {
            "summary": "Phone",
            "title": "Graffiti Phone"
        }, {
            "summary": "<p>(Specify North, East, West, South side of building, if the artwork is at ground level or higher, etc.)</p>",
            "title": "DescriptiveLocationText"
        }, {
            "summary": "Facing Street",
            "title": "Facing Street"
        }, {
            "summary": "Details About Art Mural/Graffiti Art",
            "title": "Details Section"
        }, {
            "summary": "Have you provided permission for this art mural/graffiti art installation?",
            "title": "permission"
        }, {
            "summary": "Permission information is required",
            "title": "permissionValidation"
        }, {
            "summary": "Have you received a Notice of Violation?",
            "title": "notice"
        }, {
            "summary": "Notice of Violation information is required",
            "title": "noticeValidation"
        }, {
            "summary": "When must your property be brought into compliance with the Bylaw?",
            "title": "compliance"
        }, {
            "summary": "Compliance Date information is required",
            "title": "complianceValidation"
        }, {
            "summary": "Do you have a maintenance agreement with the artist?",
            "title": "maintenance"
        }, {
            "summary": "Maintenance agreement information is required",
            "title": "maintenanceValidation"
        }, {
            "summary": "If Yes, please provide details of your agreement:",
            "title": "agreementDetails"
        }, {
            "summary": "Agreement Detail information is required",
            "title": "agreementDetailsValidation"
        }, {
            "summary": "Please provide information on the artist responsible for the art mural/graffiti art on your property.",
            "title": "artistDetails"
        }, {
            "summary": "Artist information information is required",
            "title": "artistDetailsValidation"
        }, {
            "summary": "How does this art mural/graffiti art enhance the surface it covers?",
            "title": "enhance"
        }, {
            "summary": "Art mural/graffiti art enhance the surface information is required",
            "title": "enhanceValidation"
        }, {
            "summary": "How does this art mural/graffiti art adhere to the local community character and standards?",
            "title": "adhere"
        }, {
            "summary": "Art mural/graffiti art adhere to the local community character and standards information is required",
            "title": "adhereValidation"
        }, {
            "summary": "Additional Comments",
            "title": "comments"
        }, {
            "summary": "Please provide good quality images of the entire piece of graffiti art that you are requesting regularization for. You may also choose to attach supporting documents for your application (for example, letters of support from Business Improvement Areas, Councillors, neighbours, a declaration from the artist etc.)",
            "title": "AttachmentText"
        }, {
            "summary": "Attachments",
            "title": "Attachments Section"
        }, {
            "summary": "Image/s",
            "title": "Images"
        }, {
            "summary": "Documents",
            "title": "Documents"
        }, {
            "summary": "<strong>Images </strong>Limit of max three (3) images. Minimum one (1) image is required.",
            "title": "ImagesText"
        }, {
            "summary": "<strong>Documents </strong>Limit of max three (3) documents.",
            "title": "DocumentsText"
        }, {
            "summary": "<strong>The personal information on this form is collected under the legal authority of the City of Toronto Act, 2006 s.136(c) and City of Toronto Municipal Code, Chapter 485, Graffiti.  The information will be used to locate and assess the location of the art mural/graffiti art noted in the application.  Questions about this collection can be directed to Project Lead, Graffiti Management Plan, 100 Queen Street West, 17th Floor East Tower, Toronto, Ontario M5H 2N2, 416-338-2951.</strong>",
            "title": "DeclarationText"
        }, {
            "summary": "STAFF AREA",
            "title": "Staff Area Footer"
        }, {
            "summary": "streeart_submissions",
            "title": "Excel File Name"
        }, {
            "summary": "Geo ID",
            "title": "Address Geo ID"
        }, {
            "summary": "Address Longitude",
            "title": "Address Longitude"
        }, {
            "summary": "Latitude",
            "title": "Latitude"
        }, {
            "summary": "Test Map Link",
            "title": "Map Address"
        }, {
            "summary": "Show Map Link",
            "title": "ShowMap"
        }, {
            "summary": "Please print a copy of this form for your records and then click Submit.",
            "title": "PrintFormText"
        }, {
            "summary": "Please review your information before submitting. Once you click submit, you will not be able to edit.",
            "title": "ReviewText"
        }, {
            "summary": "An issue has occured uploading the file to the server. Please try again. If the issue persists, please contact...",
            "title": "uploadServerErrorMessage"
        }
    ]
});
