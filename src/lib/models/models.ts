import mongoose from 'mongoose';

export const adminSchema = new mongoose.Schema({
  driver: mongoose.Schema.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
})

export const userSchema = new mongoose.Schema({
  driver: mongoose.Schema.ObjectId,
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