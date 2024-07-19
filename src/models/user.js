const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// ------------ || Hash the password in Pre save stage || -------------------------- //
UserSchema.pre("save", async function (next) {
  try {
    /* 
      Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
      */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// ---------- || Adding a method for valid password in login time || ---------------------- //
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = new mongoose.model("user", UserSchema);
module.exports = User;
