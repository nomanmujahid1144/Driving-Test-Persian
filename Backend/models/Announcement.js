const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
    announcement: {
        type: Array,
        default: []
    },
    announcementList: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Announcement', announcementSchema);
