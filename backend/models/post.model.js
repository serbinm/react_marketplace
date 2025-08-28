const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Поля, которые заполняет пользователь
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  phoneNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  category: { type: String, default: 'others' },
  quality: { type: String, default: 'used' },
  images: [{ type: String }], // Массив URL-адресов картинок
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;