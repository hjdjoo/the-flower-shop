import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema({
  _id: mongoose.Schema.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
})

const userSchema = new Schema({
  _id: mongoose.Schema.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  billing: {
    streetAddress: String,
    city: String,
    zip: Number,
    state: String,
  },
  contact: {
    phone1: Number,
    phone2: Number,
    email: String
  },
  recipients: [{
    firstName: String,
    lastName: String,
    address: {
      streetAddress: String,
      city: String,
      zip: Number,
      state: String,
    },
    contact: {
      phone1: Number,
    }
  }],
})

export const Admin = mongoose.model('Admin', adminSchema);
export const User = mongoose.model('User', userSchema);