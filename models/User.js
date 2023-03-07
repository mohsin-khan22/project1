const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: Number, // 0=user, 1=admin, 2=staff
    },
    vehicle: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.toAuthJSON = function () {
  return {
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model("User", userSchema);
