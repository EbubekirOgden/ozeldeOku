import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Favorites = new Mongo.Collection('Favorites');

Favorites.attachSchema(new SimpleSchema({
  userId : {
    type : String,
    optional : false,
    index : 1
  },

  schoolId : {
    type : String,
    optional : false
  }


}), {replace : true});
