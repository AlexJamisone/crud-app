import mongoose from "mongoose";

const ClientShema = new mongoose.Schema({
    name: String,
    email: String,
    createdAt: {
        type: Date,
        default: new Date(),
    }
})

const Client = mongoose.models.Client || mongoose.model("Client", ClientShema);

export default Client