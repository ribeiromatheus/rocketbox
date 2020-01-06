const { Schema, model } = require('mongoose');

const FileSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
},
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  });

FileSchema.virtual('url').get(function () {
  return `${process.env.URL}${encodeURIComponent(this.path)}`;
});

module.exports = model('File', FileSchema);