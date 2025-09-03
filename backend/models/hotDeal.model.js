const mongoose = require('mongoose');

const hotDealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  priceRegular: { type: Number, required: true },
  category: { type: String, required: true },
  itemId: { type: String, required: true },
  image: { type: String, required: true },
  
  // ДОБАВЛЕНЫ недостающие поля
  screen: { type: String },
  capacity: { type: String },
  color: { type: String },
  ram: { type: String },
  year: { type: Number },

}, { timestamps: true });

const HotDeal = mongoose.model('HotDeal', hotDealSchema);

module.exports = HotDeal;