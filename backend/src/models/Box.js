const { Schema, model } = require('mongoose');

const BoxSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'File'
    }
  ]
},
  {
    timestamps: true
  });

module.exports = model('Box', BoxSchema);