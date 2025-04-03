import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IDriver extends Document {
    name: string;
    address: string;
    phone: number;
    drivingLicense: string;
    password: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const DriverSchema = new Schema<IDriver>(
    {
        name: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        phone: { type: Number, required: true, unique: true }, // Ensure phone number is unique
        drivingLicense: { type: String, required: true },
        password: { type: String, required: true }, // Store hashed password
        isDeleted: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

// 🔹 Hash password before saving
DriverSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip hashing if password isn't changed
    this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
    next();
});

// 🔹 Method to compare passwords
DriverSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const DriverModel = mongoose.model<IDriver>("Driver", DriverSchema);
export default DriverModel;
