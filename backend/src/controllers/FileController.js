const File = require('../models/File');
const Box = require('../models/Box');

module.exports = {
  async store(req, res) {
    const { id } = req.params;
    const { originalname: title, key: path } = req.file;
    const { sockets } = req.io;

    const box = await Box.findById(id);

    const file = await File.create({ title, path });

    box.files.push(file);

    await box.save();

    sockets.in(box._id).emit('file', file);

    return res.json(file);
  }
};