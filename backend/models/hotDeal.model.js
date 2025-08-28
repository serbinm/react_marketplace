const mongoose = require('mongoose');

const hotDealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  priceRegular: { type: Number, required: true },
  category: { type: String, required: true },
  itemId: { type: String, required: true }, // Уникальность здесь не нужна, т.к. они могут пересекаться
  image: { type: String, required: true }, // Одна картинка
}, { timestamps: true });

const HotDeal = mongoose.model('HotDeal', hotDealSchema);

module.exports = HotDeal;