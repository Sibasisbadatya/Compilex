const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    codeData:
        [
            {
                language: {
                    type: String,
                },
                status: {
                    type: String,
                },
                stdin: {
                    type: Number,
                },
                stdout: {
                    type: String,
                },
                source_code: {
                    type: String,
                }
            }
        ]
    ,
});

module.exports = mongoose.model("Users", userSchema);
