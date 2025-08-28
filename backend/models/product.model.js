const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Детальные характеристики из "заводских" JSON
  title: { type: String, required: true },
  price: { type: Number, required: true }, // price with discount
  priceRegular: { type: Number },         // full price without discount
  category: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String }, // Будем хранить сложный объект как JSON-строку
  
  itemId: { type: String, required: true, unique: true }, // 'apple-iphone-7-32gb-black'
  namespaceId: { type: String },
  capacity: { type: String },
  capacityAvailable: [{ type: String }],
  color: { type: String },
  colorsAvailable: [{ type: String }],
  screen: { type: String },
  resolution: { type: String },
  processor: { type: String },
  ram: { type: String },
  camera: { type: String },
  zoom: { type: String },
  cell: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;