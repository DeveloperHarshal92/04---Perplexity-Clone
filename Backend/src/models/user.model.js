import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


// HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


// PASSWORD COMPARISON METHOD
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const userModel = mongoose.model("users", userSchema);

export default userModel;