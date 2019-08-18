const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

taskSchema.pre('save', async function(next) {
    const task = this 
    console.log('task hash working!')
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task