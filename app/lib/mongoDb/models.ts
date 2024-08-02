// import mongoose from 'mongoose';

// const { Schema } = mongoose;

// const userSchema = new Schema({
//   email: { type: String, index: 1 },
//   password: String,
//   isAdmin: Boolean,
//   firstName: String,
//   lastName: String,
//   billing: {
//     streetAddress: String,
//     city: String,
//     zip: Number,
//     state: String,
//   },
//   contact: {
//     phone1: Number,
//     phone2: Number,
//     email: String
//   },
//   recipients: [{
//     firstName: String,
//     lastName: String,
//     address: {
//       streetAddress: String,
//       city: String,
//       zip: Number,
//       state: String,
//     },
//     contact: {
//       phone1: Number,
//     }
//   }],
// })

// const User = mongoose.models.User || mongoose.model('User', userSchema);

// export default User