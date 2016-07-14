import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './schoolProfileSchoolInfos.html';

import { SchoolInfos } from '/imports/api/collections/schoolInfos.js';
import { Schools } from '/imports/api/collections/schools.js';
import { Faculties } from '/imports/api/collections/faculties.js';
import { Departments } from '/imports/api/collections/departments.js';
import { FacultyDepartments } from '/imports/api/collections/facultyDepartments.js';

import { schoolInfosForComp } from '/imports/api/client/schoolInfosClass.js'
import { departmentQuotasInfos } from '/imports/api/client/departmentQuotaInfos.js';
import { depObjForRet } from '/imports/api/client/departmentObjClassForReturn.js';

import '../../../client/lib/chosen.jquery.min.js';

Template.schoolProfileSchoolInfos.onCreated(function schoolProfileSchoolInfosOnCreated() {

  this.__c__Control = new ReactiveVar(0);

})

Template.schoolProfileSchoolInfos.helpers({
  firstTime(){
    if(!Schools.find({"authorizedPersonUserId" : Meteor.userId()}).haveSchoolDetailInfo){
        return true;
    }
    else{
        return false;
    }
  },

  schoolInfos(){

    return SchoolInfos.find({"schoolId" : Schools.findOne({"authorizedPersonUserId" : Meteor.userId()})._id});

  },

  faculty(){
    return Faculties.find({});
  },

  department(){
    return Departments.find({});
  },

  facultyInfosLength(){
    if(Template.instance().__c__Control.get() == 1){
      return true;
    }
    else{
      return false;
    }
  }
})

Template.schoolProfileSchoolInfos.onRendered(() => {


  if(!Schools.findOne().haveSchoolDetailInfo){
    $(".chosen-select").chosen({
      no_results_text : "Aradığınız kriterlere uygun seçenek bulunamadı",
    });

  }
  else{
    Meteor.call('getUniDepartments', Schools.find({"authorizedPersonUserId" : Meteor.userId()})._id, (err, result) => {
      if(err){
        alert(err.reason);
      }
      else{
        const departmentIds = result;

        Meteor.call('getDepartments', departmentIds, (err, result) => {
          if(err){
            alert(err.reason);
          }
          else{
            const departments = result;

            if(departments.length > 0){
              for(let i = 0; i < departments.length; i++){

              }
            }

          }
        })
      }
    })
  }

})

Template.schoolProfileSchoolInfos.events({
  'submit #insUpSch'(event, instance){
    event.preventDefault();

    const facultyId = $('#uniFaculties').val();

    const departmentIds = $('#facDepartments').val();

    const facInfos = {
      facId : facultyId,
      departmentIdsFrom : departmentIds
    }

    schoolInfosForComp.setFacultyInfos = facInfos;

    $('#uniFaculties').prop('selectedIndex',0); /* single select reset */

    $("#facDepartments option:selected").removeAttr("selected"); /* multiple select reset */
  },

  'click #addFacultyFinish'(event, instance){
    event.preventDefault();

    const schoolInfos = schoolInfosForComp.getFacultyInfos;

    if(schoolInfosForComp.getFacultyInfosLength() >= 1){

      instance.__c__Control.set(1);

      const facultyInfos = schoolInfosForComp.getFacultyInfos;

      Meteor.call('getFaculties', facultyInfos, (err, result) => {
        if(err){
          alert(err.reason);
        }
        else{
          for(let i = 0; i < result.length; i++){
            $('#facultyQuota').append('<option>' + result[i] + '</option>');
          }
        }

      })

    }

  },

  'change #facultyQuota'(event, instance){
    const facName = $('#facultyQuota').val();

    const facInfos = schoolInfosForComp.getFacultyInfos;

    const faculty = {
      facultyName : facName,
      facultyInfos : facInfos
    }

    if(isEmpty(faculty)){

    }
    else{
      Meteor.call('getDepartmentsByFacName', faculty, (err, result) => {
        if(err){
          alert(err.reason);
        }
        else{

          $('#departmentQuota').empty();

          $('#departmentQuota').append('<option disabled selected>Departman Seçiniz</option>');
          for(let i = 0; i < result.length; i++){
            depObjForRet.setDepInfos = result[i];
            $('#departmentQuota').append('<option>' + result[i].departmentName + '</option>');
          }

          console.log(depObjForRet.getDepInfos);
        }
      })
    }
  }


})