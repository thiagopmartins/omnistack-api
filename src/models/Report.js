const mongoose = require('mongoose');

const Report = new mongoose.Schema({
    content: {
        type: Object,
        required: true
    },
    id_obra: {
        type: String,
        required: true,
        unique: true
    }
}, {
        timestamps: true
});

const ReportUpdated = new mongoose.Schema({
    oldContent: {
        type: Object,
        required: true
    },
    newContent: {
        type: Object,
        required: true
    },
    difference: {
        type: Object,
        required: true
    },
    idObra: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true }]
}, {
    timestamps: true
});

module.exports = {
    Report:  mongoose.model('Reports', Report),
    ReportUpdated: mongoose.model('ReportUpdated', ReportUpdated)
}