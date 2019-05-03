const mongoose = require('mongoose');

const Report = new mongoose.Schema({ 
    content: {
        type: Object,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Reports', Report);