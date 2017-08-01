/**
 * Created by okuscu on 06/15/2017
 */
let imageDropzone = void 0;
let docDropzone = void 0;
let form;
let appParam = 'graffiti_exemption';
let DZ_remove = [];

let cookie_SID = appParam + '.sid';
let cookie_modifiedUsername = appParam + '.cot_uname';
let cookie_modifiedFirstName = appParam + '.firstName';
let cookie_modifiedLastName = appParam + '.lastName';
let cookie_modifiedEmail = appParam + '.email';
let repo = appParam;

function checkFileUploads(uploads) {
  let queryString = "";
  let binLoc = "";

  if (uploads.length > 0) {
    $.each(uploads, function (index, item) {
      if (binLoc == "") {
        binLoc = item.bin_id;
      } else {
        binLoc = binLoc + "," + item.bin_id;
      }
    })
  }

  if (binLoc != "") { queryString = "&keepFiles=" + binLoc };

  return queryString;
}
function saveReport(action, payload, msg, form_id, repo) {
  // $(".btn").prop('disabled', true);

  let uploads = (payload.image_uploads).concat(payload.doc_uploads);
  let keepQueryString = checkFileUploads(payload);

  $.ajax({
    url: config.httpHost.app[httpHost] + config.api.post + repo + '?sid=' + getCookie(cookie_SID) + keepQueryString,
    type: 'POST',
    data: JSON.stringify(payload),
    //   data: payload,
    headers: {
      'Content-Type': 'application/json; charset=utf-8;',
      'Cache-Control': 'no-cache'
    },
    dataType: 'json'
  }).done(function (data) {
    switch (action) {
      case 'save':
        if (data && data.EventMessageResponse && data.EventMessageResponse.Event && data.EventMessageResponse.Event.EventID) {
          // Route to /{id} draft page if new report is successfully saved
          hasher.setHash(data.EventMessageResponse.Event.EventID + '?alert=success&msg=' + msg.done + '&ts=' + new Date().getTime());
        } else {
          hasher.setHash('new?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
        }
        break;

      case 'notify':
        if (data && data.EventMessageResponse && data.EventMessageResponse.Event && data.EventMessageResponse.Event.EventID) {
          // Email report notice to emergency management captain and incident manager/reporters
          // if (mailSend) { emailNotice(data.EventMessageResponse.Event.EventID, action); }
        } else {
          hasher.setHash('new?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
        }
        break;

      case 'submit':
        if (data && data.EventMessageResponse && data.EventMessageResponse.Event && data.EventMessageResponse.Event.EventID) {
          let updatePayload = JSON.stringify({
            'payload': JSON.stringify(form.getData()),
            'status': config.status.Submitted
          });
          updateReport(data.EventMessageResponse.Event.EventID, action, updatePayload, msg, form.getData());
        } else {
          hasher.setHash('new?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
        }
        break;

      default:
        break;
    }
  }).fail(function (textStatus, error) {
    alert("POST Request Failed: " + textStatus + ", " + error);
    hasher.setHash('new?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
  }).always(function () {
    $(".btn").removeAttr('disabled').removeClass('disabled');
  });
}
function updateReport(fid, action, payload, msg, repo, formData) {
  //  $(".btn").prop('disabled', true);

  let uploads = (formData.image_uploads).concat(formData.doc_uploads);
  let keepQueryString = checkFileUploads(uploads);

  console.log("========keepQueryString========", keepQueryString);
  console.log("========DZ_remove========", DZ_remove);

  $.ajax({
    url: config.httpHost.app[httpHost] + config.api.put + repo + '/' + fid + '?sid=' + getCookie(cookie_SID) + keepQueryString,
    type: 'POST',
    data: payload,
    headers: {
      'Content-Type': 'application/json; charset=utf-8;',
      'Cache-Control': 'no-cache'
    },
    dataType: 'json'
  }).done(function (data) {
    //  action = 'notify';
    switch (action) {
      case 'save':
        hasher.setHash(fid + '?alert=success&msg=' + msg.done + '&ts=' + new Date().getTime());
        // code to remove deleted attachments
        if (DZ_remove.length > -1) {
          $.each(DZ_remove, function (i, deleteRowURL) {
            $.get(deleteRowURL, function (response) {
              console.log("deleted success", deleteRowURL);
            }).fail(function () {
              console.log('failed', deleteRowURL);
            });
          })
        }
        DZ_remove = [];
        break;
      case 'updateAttachments':
        break;
      case 'notify':
        break;

      case 'submit':
      case 'approve':
      case 'reject':
        hasher.setHash(fid + '?alert=success&msg=' + msg.done + '&ts=' + new Date().getTime());
        break;

      default:
        break;
    }
  }).fail(function (textStatus, error) {
    alert("POST Request Failed: " + textStatus + ", " + error);
    hasher.setHash(fid + '?alert=danger&msg=' + msg.fail + '&ts=' + new Date().getTime());
  }).always(function () {
    $(".btn").removeAttr('disabled').removeClass('disabled');
  });

}
function emailNotice(fid, action) {
  let emailTo = {};
  let emailCaptain = config.captain_emails;
  let emailAdmin = config.admin_emails;
  if (typeof emailCaptain !== 'undefined' && emailCaptain != "") {
    $.extend(emailTo, emailCaptain);
  }
  if (typeof emailAdmin !== 'undefined' && emailAdmin != "") {
    //  $.extend(emailTo, emailAdmin);
  }

  var emailRecipients = $.map(emailTo, function (email) {
    return email;
  }).filter(function (itm, i, a) {
    return i === a.indexOf(itm);
  }).join(',');

  var payload = JSON.stringify({
    'emailTo': emailRecipients,
    'emailFrom': (config.messages.notify.emailFrom ? config.messages.notify.emailFrom : 'wmDev@toronto.ca'),
    'id': fid,
    'status': action,
    'body': (config.messages.notify.emailBody ? config.messages.notify.emailBody : 'New submission has been received.'),
    'emailSubject': config.messages.notify.emailSubject
  });

  $.ajax({
    url: config.httpHost.app[httpHost] + config.api.email,
    type: 'POST',
    data: payload,
    headers: {
      'Content-Type': 'application/json; charset=utf-8;',
      'Cache-Control': 'no-cache'
    },
    dataType: 'json'
  }).done(function (data, textStatus, jqXHR) {
    if (action === 'notify') {
      hasher.setHash(fid + '?alert=success&msg=notify.done&ts=' + new Date().getTime());
    }
  }).fail(function (jqXHR, textStatus, error) {
    console.log("POST Request Failed: " + textStatus + ", " + error);
    if (action === 'notify') {
      hasher.setHash(fid + '?alert=danger&msg=notify.fail&ts=' + new Date().getTime());
    }
  });
}
function getJSONStatus(statusVal) {
  var jsonStatusVal = "";
  /*
         'DraftApp': 'New',
         'SubmittedApp': 'Review In Progress',
         'ApprovedApp': 'Approved',
         'DeniedApp': 'Denied',
         'InvalidApp': 'Invalid Requests'
         */
  switch (statusVal) {
    case config.status.DraftApp:
      jsonStatusVal = config.status.Draft;
      break;
    case config.status.SubmittedApp:
      jsonStatusVal = config.status.Submitted;
      break;
    case config.status.ApprovedApp:
      jsonStatusVal = config.status.Approved;
      break;
    case config.status.DeniedApp:
      jsonStatusVal = config.status.Denied;
      break;
    case config.status.InvalidApp:
      jsonStatusVal = config.status.Invalid;
      break;
    default:
      jsonStatusVal = config.status.Draft;
  }
  return jsonStatusVal;
}
function processForm(action, form_id, repo) {
  let fid = $("#fid").val();
  let msg, payload;

  setGeoParams();

  let f_data = form.getData();
  f_data.image_uploads = processUploads(imageDropzone, repo, true);
  f_data.doc_uploads = processUploads(docDropzone, repo, true);

  switch (action) {
    case 'save':
      msg = {
        'done': 'save.done',
        'fail': 'save.fail'
      };

      var payloadStatusVal = getJSONStatus($('input[name="lsteStatus"]:checked').val());

      payload = JSON.stringify({
        'payload': JSON.stringify(f_data),
        'status': payloadStatusVal
      });

      // Update report and move to Submitted state
      if (fid) {
        updateReport(fid, action, payload, msg, repo, f_data);
      }
      // Create new report and move to Submitted state
      else {
        // payload = JSON.stringify(f_data);
        payload = f_data;
        saveReport(action, payload, msg, form_id, repo);
      }
      break;
    case 'notify':
    case 'updateAttachments':
      msg = {
        'done': 'save.done',
        'fail': 'save.fail'
      };
      // Update report and notify emergency management captain for status 'notify'
      if (fid) {
        payload = JSON.stringify({
          'payload': JSON.stringify(f_data)
        });
        updateReport(fid, action, payload, msg, repo, f_data);
      }
      // Create new report and notify emergency management captain for status 'notify'
      else {
        //  payload = JSON.stringify(f_data);
        payload = f_data;
        saveReport(action, payload, msg, form_id, repo);
      }
      break;

    case 'submit':
      msg = {
        'done': 'submit.done',
        'fail': 'submit.fail'
      };

      // Update report and move to Submitted state
      if (fid) {
        var payloadStatusVal = getJSONStatus($('input[name="lsteStatus"]:checked').val());
        payload = JSON.stringify({
          'payload': JSON.stringify(f_data),
          'status': payloadStatusVal
        });
        updateReport(fid, action, payload, msg, repo, f_data);
      }
      // Create new report and move to Submitted state
      else {
        //  payload = JSON.stringify(f_data);
        payload = f_data;
        saveReport(action, payload, msg, form_id, repo);
      }
      break;
    case 'approve':
      msg = {
        'done': 'approve.done',
        'fail': 'approve.fail'
      };
      // Update report and move to Approved state
      if (fid) {
        payload = JSON.stringify({
          'payload': JSON.stringify(f_data),
          'status': config.status.Approved
        });
        updateReport(fid, action, payload, msg, repo, f_data);
      }
      break;
    case 'reject':
      msg = {
        'done': 'reject.done',
        'fail': 'reject.fail'
      };
      // Update report and move back to Draft (Yes) state
      if (fid) {
        payload = JSON.stringify({
          'payload': JSON.stringify(f_data),
          'status': config.status.Draft
        });
        updateReport(fid, action, payload, msg, repo, f_data);
      }
      break;
    default:
      break;
  }
}
function loadForm(destinationSelector, data, fid, status, form_id, repo, allJSON, docMode) {
  let adminForm = true;
  let showAdminHeader = true;
  let showContactSections = false;
  let showAttachmentSection = false;
  let debugMode = false;

  DZ_remove = [];

  //$(destinationSelector).empty();
  let sections = $.merge(getAdminSectionsTop(), getSubmissionSections());

  //  form = new CotForm({
  form = new CotForm({
    id: form_id,
    title: '',
    useBinding: false,
    rootPath: config.httpHost.rootPath[httpHost],
    sections: sections,
    success: function (e) {
      // Pass callback function based on submit button clicked
      let action = $("#action").val();
      if (['save', 'notify', 'submit', 'approve', 'reject'].indexOf(action) !== -1) {
      } else {
        //  console.log('Error: Form action is not set');
      }
      e.preventDefault();
    }
  });

  app.addForm(form, 'bottom');

  //getSessionStorage(data);

  initForm(data);
  // imageDropzone = new Dropzone("div#" + upload_selector, setupDropzone({ fid: fid, form_id: form_id, url: config.api.upload + config.default_repo + '/' + repo }));

  imageDropzone = new Dropzone("div#image_dropzone", $.extend(config.admin.imageDropzoneStaff, {
    "dz_id": "image_dropzone", "fid": fid, "form_id": form_id,
    "url": config.api.upload + config.default_repo + '/' + repo,
    "init": function () {
      // Adding extra validation to imageDropzone field by using txtPicName field
      // Min 1 file needs to be uploaded
      let attFieldname = "txtPicName";
      this
        .on("addedfile", function (file) { validateUpload("addedfile", attFieldname, file.name); })
        .on("success", function (file) { validateUpload("success", attFieldname, file.name); })
        .on("removedfile", function () { validateUpload("removedFile", attFieldname, ""); })
        .on("error", function () { validateUpload("error", attFieldname, ""); });
    }
  }));
  //"dz_id": "admin_dropzone", "fid": fid, "form_id": form_id,
  docDropzone = new Dropzone("div#document_dropzone", $.extend(config.admin.docDropzoneStaff, {
    "dz_id": "document_dropzone", "fid": fid, "form_id": form_id,
    "url": config.api.upload + config.default_repo + '/' + repo,
  }));

  $(".dz-hidden-input").attr("aria-hidden", "true");
  $(".dz-hidden-input").attr("aria-label", "File Upload Control");

  // Set datetime picker for Date of Action field
  $(".datetimepicker.wir\\[0\\]\\[dateAction\\]").datetimepicker({ "format": "DD/MM/YYYY" });

  let modifiedUsername = decodeURIComponent(getCookie(cookie_modifiedUsername));
  let modifiedName = decodeURIComponent(getCookie(cookie_modifiedFirstName)) + ' ' + decodeURIComponent(getCookie(cookie_modifiedLastName));
  let modifiedEmail = decodeURIComponent(getCookie(cookie_modifiedEmail));

  // New report
  if (!data) {
    // Set created by and modified by to current user
    $("#createdBy, #modifiedBy").val(modifiedUsername);
    var dataCreated = new Date();
    $("#recCreated").val(dataCreated);
    $("#lsteStatus").val(config.status.DraftApp);

    $("#modifiedEmail").val('{"' + modifiedName + '":"' + modifiedEmail + '"}');
  }
  // View/Edit existing report
  else {

    if ($("#recCreated").val() == "") {
      $("#recCreated").val(moment(allJSON.created).format(config.dateTimeFormat));
    }

    showUploads(imageDropzone, 'image_uploads', data, repo, true, true);
    showUploads(docDropzone, 'doc_uploads', data, repo, true, true);

    // Populate existing form with JSON object from GET request

    form.setData(data);

    if (fid) { $("#fid").val(fid); }

    $("#modifiedBy").val(modifiedUsername);
    if (!$("#modifiedEmail").val()) {
      $("#modifiedBy").val(modifiedUsername);
      $("#modifiedEmail").val('{"' + modifiedName + '":"' + modifiedEmail + '"}');
    }
    else if ($("#modifiedEmail").val().indexOf(modifiedEmail) == -1) {
      if ($("#modifiedEmail").val()) {
        let emailObj = JSON.parse($("#modifiedEmail").val());
        emailObj[modifiedName] = modifiedEmail;
        $("#modifiedEmail").val(JSON.stringify(emailObj));
      } else {
        $("#modifiedEmail").val('{"' + modifiedName + '":"' + modifiedEmail + '"}');
      }
    }
  }

  if (docMode == "read") {
    // Open the document in read-only mode
    $("#" + form_id).find("input, textarea, select, button").attr('disabled', 'disabled');
    $(".dz-hidden-input").prop("disabled", true);
    $(".dz-remove").hide();
    $(".save-action").hide();
    $("#savebtn").hide();
    $("#setbtn").hide();
    $("#image_uploads").hide();
    $("#doc_uploads").hide();
  } else {
    $(".edit-action").hide();
  }

  // New or existing Draft report
  if (status === config.status.Draft || !status) {
    // Remove Approve and Reject buttons
    $("#approveReportElement, #rejectReportElement").remove();
  }
  // Submitted or Approved report
  else if (status === config.status.Submitted || status === config.status.Approved) {

    // Disable all fields and remove submission buttons if not administator
    if ($.inArray(config.groups.graffiti_exemption_admin, groupMemberships) === -1) {
      /// //    $("#" + form_id).find("input, textarea, select, button").attr('disabled', 'disabled');
      $("#saveSubmit").remove();
    } else {
      $(".btn-save").html($(".btn-save").html().replace(config.button.saveReport, config.button.save));
      $("#notifyReportElement, #submitReportElement").remove();
    }
  }
}
function initForm(data) {

  //$("button .removeUpload").hide();
  $(".save-action").off('click').on('click', function () {
    $(".edit-action").hide();
    $("#action").val($(this).attr('id'));
    var form_fv = $('#' + form.cotForm.id).data('formValidation');
    if (auth()) {
      form_fv.validate();
      if (form_fv.isValid()) {
        submitForm();
      }
    } else {
      $("#savebtn").hide();
    }
  });

  $(".edit-action").off('click').on('click', function () {
    $("#" + form_id).find("input, textarea, select, button").attr('disabled', false);
    //$("button .removeUpload").hide();
    $(".dz-hidden-input").prop("disabled", false);
    $(".dz-remove").show();
    $(".edit-action").hide();
    $(".save-action").show();
    $("#savebtn").show();
    $("#setbtn").show();
    $("#image_uploads").show();
    $("#doc_uploads").show();
    docMode = "edit";
  });

  $("#closebtn").click(function () { window.close(); });
  $("#printbtn").click(function () { window.print(); });
  $("#setbtn").click(function () { setAddressSame(); });
  $('input[name="eNotice"]').on('change',
    function () {
      var checkVal = $('input[name="eNotice"]:checked').val();
      (checkVal == "Yes") ? $("#ComplianceDateElement .optional").first().text("") : $("#ComplianceDateElement .optional").first().text("(optional)");
      $('#' + form_id).formValidation('revalidateField', $('#ComplianceDate'));
    });
  $('input[name="eMaintenance"]').on('change',
    function () {
      var checkVal = $('input[name="eMaintenance"]:checked').val();
      (checkVal == "Yes") ? $("#eMaintenanceAgreementElement .optional").first().text("") : $("#eMaintenanceAgreementElement .optional").first().text("(optional)");
      $('#' + form_id).formValidation('revalidateField', $('#eMaintenanceAgreement'));
    });

  $(".dz-hidden-input").attr("aria-hidden", "true");
  $(".dz-hidden-input").attr("aria-label", "File Upload Control");

  // manual fix for "optional" parameter on label for relaed fields
  $("#ePermissionElement .optional").first().text("");
  $("#eNoticeElement .optional").first().text("");
  $("#eMaintenanceElement .optional").first().text("");
  $("#eArtistInfoElement .optional").first().text("");
  $("#eArtSurfaceEnhanceElement .optional").first().text("");
  $("#eArtLocalCharacterElement .optional").first().text("");

  $(".dz-hidden-input").attr("aria-hidden", "true");
  $(".dz-hidden-input").attr("aria-label", "File Upload Control");

  $("#savebtn").click(function () {
    $(".edit-action").hide();
    $("#action").val($(this).attr('id'));
    var form_fv = $('#' + form.cotForm.id).data('formValidation');
    if (auth()) {
      form_fv.validate();
      if (form_fv.isValid()) {
        submitForm();
        scroll(0, 0);
      }
    } else {
      $("#savebtn").hide();
      scroll(0, 0);
    }

  });

  $('#' + form_id).data('formValidation').addField('txtPicName', { excluded: false, validators: { notEmpty: { message: app.data["imageValidation"] } } })

  if (data) {
    // HIDE/SHOW FIELDS BASED ON OTHER FIELD VALUES
  } else {
    var dataCreated = new Date();
    dataCreated = moment(dataCreated).format(config.dateTimeFormat);
    $("#recCreated").val(dataCreated);
    $("#lsteStatus").val(config.status.DraftApp);
  }

}
function setAddressSame() {
  $("#emAddress").val($("#eAddress").val());
  $("#emCity").val($("#eCity").val());
  $("#emPostalCode").val($("#ePostalCode").val());
  $("#emPrimaryPhone").val($("#ePrimaryPhone").val());
  $('#' + form_id).formValidation('revalidateField', $('#emAddress'));
}
function submitForm() {
  //verify user still has a session

  if (auth()) {
    processForm('save', form.cotForm.id, config.default_repo);
  } else {
    scroll(0, 0);
  }
}
function validateUpload(event, field, value) {
  //placeholder for additional logic based on the event
  switch (event) {
    case "addedfile":
      break;
    case "success":
      break;
    case "removedfile":
      break;
    case "error":
      console.log("custom error code")
      $('#' + form_id).data('formValidation').updateMessage(field, 'notEmpty', app.data.uploadServerErrorMessage)
      break;
    default:
  }
  $('#' + field).val(value);
  $('#' + form_id).data('formValidation').revalidateField(field);
}
function getSubmissionSections() {

  let section = [
    {
      id: "contactSec",
      title: app.data["Contact Details Section"],
      className: "panel-info",
      rows: [
        // for testing purposes
        /*
        {fields: [
          {
            id: "actionBar",
            type: "html",
            html: `<div className="col-xs-12 col-md-12"><button class="btn btn-success" id="savebtntemp"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> ` + config.button.submitReport + `</button>
                 <button class="btn btn-success" id="printbtn"><span class="glyphicon glyphicon-print" aria-hidden="true"></span>Print</button>
                  <button class="btn btn-info" id="makePDFbtn"><span class="glyphicon glyphicon-print" aria-hidden="true"></span>Print PDF</button></div>`
          }]},*/
        {
          fields: [
            { id: "eFirstName", title: app.data["First Name"], className: "col-xs-12 col-md-6", required: true },
            { id: "eLastName", title: app.data["Last Name"], className: "col-xs-12 col-md-6", required: true },
            { id: "eAddress", title: app.data["Address"], className: "col-xs-12 col-md-6", required: true },
            { id: "eCity", title: app.data["City"], value: "Toronto", className: "col-xs-12 col-md-6" }
          ]
        },
        {
          fields: [
            { id: "ePostalCode", title: app.data["Postal Code"], validationtype: "PostalCode", className: "col-xs-12 col-md-6" },
            { id: "ePrimaryPhone", title: app.data["Phone"], validationtype: "Phone", className: "col-xs-12 col-md-6", required: true },
            { id: "eFax", title: app.data["Fax"], validationtype: "Phone", className: "col-xs-12 col-md-6" },
            { id: "eEmail", title: app.data["Email"], validationtype: "Email", validators: { regexp: { regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'This field must be a valid email. (###@###.####)' } }, className: "col-xs-12 col-md-6" }
          ]
        }
      ]
    },
    {
      id: "graffitiSec",
      title: app.data["Graffiti Section"],
      className: "panel-info",
      rows: [
        {
          fields: [
            { id: "emSameAddress", title: "", type: "html", html: `<div className="col-xs-12 col-md-12"><button class="btn btn-info" id="setbtn"><span class="" aria-hidden="true"></span> ` + app.data["Same As Above"] + `</button></div>` }
          ]
        },
        {
          fields: [
            { id: "emAddress", title: app.data["Address"], className: "col-xs-12 col-md-6", required: true },
            { id: "emCity", title: app.data["City"], value: "Toronto", className: "col-xs-12 col-md-6" }
          ]
        },
        {
          fields: [
            { id: "emPostalCode", title: app.data["Postal Code"], className: "col-xs-12 col-md-6" },
            { id: "emPrimaryPhone", title: app.data["Phone"], validationtype: "Phone", className: "col-xs-12 col-md-6" },
            { id: "emFacingStreet", title: app.data["Facing Street"], className: "col-xs-12 col-md-6", required: true },
            { id: "emDescriptiveLocation", "posthelptext": app.data["DescriptiveLocationText"], title: app.data["graffitiDesLocation"], className: "col-xs-12 col-md-6", "required": true }
          ]
        }
      ]
    },
    {
      id: "detailsSec",
      title: app.data["Details Section"],
      className: "panel-info",
      rows: [
        {
          fields: [
            {
              id: "ePermission", title: app.data["permission"], type: "radio", className: "col-xs-12 col-md-6", "choices": config.choices.yesNoFull, "orientation": "horizontal",
              validators: {
                callback: {
                  message: app.data["permissionValidation"],
                  callback: function (value, validator, $field) {
                    return ($field[0].checked);
                  }
                }
              }
            }]
        },
        {
          fields: [
            {
              id: "eNotice", title: app.data["notice"], type: "radio", "value": "No", className: "col-xs-12 col-md-6", "choices": config.choices.yesNoFull, "orientation": "horizontal",
              validators: {
                callback: {
                  message: app.data["noticeValidation"],
                  callback: function (value, validator, $field) {
                    return ((value == "") ? false : true);
                  }
                }
              }
            }, {
              id: "ComplianceDate", title: app.data["compliance"], type: "datetimepicker", "placeholder": config.dateFormat, className: "col-xs-12 col-md-6", "options": { format: config.dateFormat },
              validators: {
                callback: {
                  message: app.data["complianceValidation"],
                  // this is added to formValidation
                  callback: function (value, validator, $field) {
                    var checkVal = $('input[name="eNotice"]:checked').val();
                    return ((checkVal !== "Yes") ? true : (value !== ''));
                  }
                }
              }
            }]
        },
        {
          fields: [
            {
              id: "eMaintenance", title: app.data["maintenance"], type: "radio", "value": "No", className: "col-xs-12 col-md-6", "choices": config.choices.yesNoFull, "orientation": "horizontal",
              validators: {
                callback: {
                  message: app.data["maintenanceValidation"],
                  callback: function (value, validator, $field) {
                    return ((value == "") ? false : true);
                  }
                }
              }
            },
            {
              id: "eMaintenanceAgreement", title: app.data["agreementDetails"], className: "col-xs-12 col-md-12",
              validators: {
                callback: {
                  message: app.data["agreementDetailsValidation"],
                  callback: function (value, validator, $field) {
                    var checkVal = $('input[name="eMaintenance"]:checked').val();
                    return ((checkVal !== "Yes") ? true : (value !== ''));
                  }
                }
              }
            },
            {
              id: "eArtistInfo", title: app.data["artistDetails"], className: "col-xs-12 col-md-12",
              validators: {
                callback: {
                  message: app.data["artistDetailsValidation"],
                  callback: function (value, validator, $field) {
                    return ((value == "") ? false : true);
                  }
                }
              }
            },
            {
              id: "eArtSurfaceEnhance", title: app.data["enhance"], className: "col-xs-12 col-md-12",
              validators: {
                callback: {
                  message: app.data["enhanceValidation"],
                  callback: function (value, validator, $field) {
                    return ((value == "") ? false : true);
                  }
                }
              }
            },
            {
              id: "eArtLocalCharacter", title: app.data["adhere"], className: "col-xs-12 col-md-12",
              validators: {
                callback: {
                  message: app.data["adhereValidation"],
                  callback: function (value, validator, $field) {
                    return ((value == "") ? false : true);
                  }
                }
              }
            },
            { id: "eAdditionalComments", title: app.data["comments"], className: "col-xs-12 col-md-12" },
          ]
        }]
    },
    {
      id: "attSec",
      title: app.data["Attachments Section"],
      className: "panel-info",
      rows: [
        {
          fields: [
            { id: "AttachmentText", title: "", type: "html", html: app.data["AttachmentText"], className: "col-xs-12 col-md-12" },
            {
              id: "Images", "prehelptext": app.data["ImagesText"], title: app.data["Images"], type: "html", "aria-label": "Dropzone File Upload Control Field for Images",
              html: '<section aria-label="File Upload Control Field for Images" id="attachment"><div class="dropzone" id="image_dropzone" aria-label="Dropzone File Upload Control for Images Section"></div></section><input type="hidden" name="txtPicName" id="txtPicName" value="" /><section id="image_uploads"></section>', className: "col-xs-12 col-md-12"
            },
            {
              id: "Documents", "prehelptext": app.data["DocumentsText"], title: app.data["Documents"], type: "html", "aria-label": "Dropzone File Upload Control Field for Documents",
              html: '<section aria-label="File Upload Control Field for Documents" id="attachment"><div class="dropzone" id="document_dropzone" aria-label="Dropzone File Upload Control for Document Section"></div></section><section id="doc_uploads"></section>', className: "col-xs-12 col-md-12"
            },
            { id: "DeclarationText", title: "", type: "html", html: app.data["DeclarationText"], className: "col-xs-12 col-md-12" },
            // { id: "submitHelp", title: "", type: "html", html: app.data["SubmitText"], className: "col-xs-12 col-md-12" },
            {
              id: "actionBar",
              type: "html",
              html: `<div className="col-xs-12 col-md-12"><button class="btn btn-success" id="savebtn"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> ` + config.button.submitReport + `</button></div>`
            },
            { id: "successFailRow", type: "html", className: "col-xs-12 col-md-12", html: `<div id="successFailArea" className="col-xs-12 col-md-12"></div>` },
            { id: "fid", type: "html", html: "<input type=\"text\" id=\"fid\" aria-label=\"Document ID\" aria-hidden=\"true\" name=\"fid\">", class: "hidden" },
            { id: "action", type: "html", html: "<input type=\"text\" id=\"action\" aria-label=\"Action\" aria-hidden=\"true\" name=\"action\">", class: "hidden" },
            { id: "createdBy", type: "html", html: "<input type=\"text\" id=\"createdBy\" aria-label=\"Complaint Created By\" aria-hidden=\"true\" name=\"createdBy\">", class: "hidden" },
            { id: "recCreated", type: "html", html: "<input type=\"text\" id=\"recCreated\" aria-label=\"Record Creation Date\" aria-hidden=\"true\" name=\"recCreated\">", class: "hidden" },
            { id: "AddressGeoID", type: "html", html: "<input type=\"hidden\" aria-label=\"Address Geo ID\" aria-hidden=\"true\" id=\"AddressGeoID\" name=\"AddressGeoID\">", class: "hidden" },
            { id: "AddressLongitude", type: "html", html: "<input type=\"hidden\" aria-label=\"Address Longitude\" aria-hidden=\"true\" id=\"AddressLongitude\" name=\"AddressLongitude\">", class: "hidden" },
            { id: "AddressLatitude", type: "html", html: "<input type=\"hidden\" aria-label=\"Address Latitude\" aria-hidden=\"true\" id=\"AddressLatitude\" name=\"AddressLatitude\">", class: "hidden" },
            { id: "MapAddress", type: "html", html: "<input type=\"hidden\" aria-label=\"Map Address\" aria-hidden=\"true\" id=\"MapAddress\" name=\"MapAddress\">", class: "hidden" },
            { id: "ShowMap", type: "html", html: "<input type=\"hidden\" aria-label=\"Show Map\" aria-hidden=\"true\" id=\"ShowMap\" name=\"ShowMap\">", class: "hidden" },
          ]
        }
      ]
    }
  ]
  return section;
}
function getAdminSectionsTop() {
  var section = [{
    id: "adminSec",
    title: app.data["Admin Section"],
    className: "panel-info",
    rows: [{
      fields: [
        {
          "id": "lsteStatus",
          "title": config.recStatus.title,
          "required": true,
          "type": "radio",
          "orientation": "horizontal",
          "choices": config.recStatus.choices,
          "class": "col-xs-12 col-md-6"
        }]
    }]
  }];
  return section;
}
function getAdminSectionsBottom() {
  var section = [
    {
      id: "hiddenSec",
      title: "",
      className: "panel-info",
      rows: [{ fields: [] }]
    }]
  return section;
}
function setGeoParams() {
  let queryStr = "?searchString=" + encodeURIComponent($("#emAddress").val() + " " + $("#emCity").val() + " " + $("#emPostalCode").val());
  $.ajax({
    url: config.geoURL + queryStr + config.geoParam, // geoURL,
    type: "GET",
    cache: "true",
    dataType: "json",
    async: false,
    success: function (data) {
      let resultLoc = data.result.bestResult;
      if (resultLoc.length > 0) {
        $("#AddressGeoID").val(resultLoc[0]["geoId"]);
        $("#AddressLongitude").val(resultLoc[0]["longitude"]);
        $("#AddressLatitude").val(resultLoc[0]["latitude"]);
      } else {
        $("#AddressGeoID").val("");
        $("#AddressLongitude").val("");
        $("#AddressLatitude").val("");
      }
    },
    error: function () {
      $("#AddressGeoID").val("");
      $("#AddressLongitude").val("");
      $("#AddressLatitude").val("");
    }
  })
}
CotForm.prototype.setData = function (data) {
  // STANDARD FIELD OPERATION
  function standardFieldOp(field, val) {
    if (field.length === 1) { // SINGLE FIELD ELMENT
      if (Array.isArray(val)) { // MULTIPLE VALUE ELEMENT - AKA SELECT
        for (var i = 0, l = val.length; i < l; i++) {
          field.find('[value="' + val[i] + '"]').prop('selected', true);
        }
      } else { // STANDARD TEXT-LIKE FIELD
        if (field.is('[type="checkbox"]') || field.is('[type="radio"]')) { // EXCEPT FOR THIS
          if (field.val() === val) {
            field.prop('checked', true);
          }
        } else {
          field.val(val);
        }
      }
    } else { // MULTIPLE FIELD ELEMENT - GROUP OF CHECKBOXS, RADIO BUTTONS
      if (Array.isArray(val)) {
        for (var i = 0, l = val.length; i < l; i++) {
          field.filter('[value="' + val[i] + '"]').prop('checked', true);
        }
      } else { // SINGLE FIELD ELEMENT - STAND ALONE CHECKBOX, RADIO BUTTON
        field.filter('[value="' + val + '"]').prop('checked', true);
      }
    }
    // PLUGIN REBUILD
    field.filter('.multiselect').multiselect('rebuild');
    field.filter('.daterangevalidation').daterangepicker('update');
  }
  // GO THROUGH DATA
  var form = $('#' + this.cotForm.id);
  for (var k in data) {
    if (k === 'rows') { // GRID FIELDS
      for (var i = 0, l = data[k].length; i < l; i++) {
        if (i > 0) { // ADD ROW IF NEEDED
          var fields = $();
          for (var k2 in data[k][i]) {
            fields = fields.add(form.find('[name="row[0].' + k2 + '"]'));
          }
          fields.closest('tr').find('button.grid-add').trigger('click');
        }

        for (var k2 in data[k][i]) { // ASSIGN VALUES
          standardFieldOp(form.find('[name="row[' + i + '].' + k2 + '"]'), data[k][i][k2]);
        }
      }
    } else { // STANDARD FIELDS
      standardFieldOp(form.find('[name="' + k + '"]'), data[k]);
    }
  }
};

CotForm.prototype.getData = function () {
  var data = {}, blanks = {}, rowIndexMap = {}; // {stringIndex: intIndex}
  $.each($('#' + this.cotForm.id).serializeArray(), function (i, o) {
    if (o.name.indexOf('row[') !== -1) {
      var sRowIndex = o.name.substring(o.name.indexOf('[') + 1, o.name.indexOf(']'));
      if (sRowIndex !== 'template') {
        var rows = data['rows'] || [];
        var iRowIndex = rowIndexMap[sRowIndex];
        if (iRowIndex === undefined) {
          rows.push({});
          iRowIndex = rows.length - 1;
          rowIndexMap[sRowIndex] = iRowIndex;
        }
        rows[iRowIndex][o.name.split('.')[1]] = o.value;
        data['rows'] = rows;
      }
    } else {
      if (data.hasOwnProperty(o.name)) {
        data[o.name] = $.makeArray(data[o.name]);
        data[o.name].push(o.value);
      } else {
        data[o.name] = o.value;
      }
    }
  });

  var _blanks = $('#' + this.cotForm.id + ' [name]')
  $.each(_blanks, function () {
    if (!data.hasOwnProperty(this.name)) {
      blanks[this.name] = '';
    }
  });
  return $.extend(data, blanks);
};

CotSession.prototype.expireIn = function (minutes) {
  //set how long the current session cookies should last before expiring, in minutes
  //returns true if the session cookie expiry times were updated, false if not (because there is no session data)
  //NOTE: not entirely sure what should happen if the current session cookies are expired...
  if (this.sid) {
    this._storeLogin({
      passwordExpiryDate: (new Date()).getTime() + (minutes * 60 * 1000),
      sid: this.sid,
      userID: this.username || '',
      email: this.email || '',
      cotUser: {
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        division: this.division || '',
        groupMemberships: this.groups || ''
      }
    });
    return true;
  }
  return false;
};

