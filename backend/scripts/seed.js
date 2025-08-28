const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

const JSON_DATA_PATH = path.resolve(__dirname, '../public/api');
const IMAGES_BASE_PATH = path.resolve(__dirname, '../public');

// Импортируем ОБЕ модели
const Product = require('../models/product.model');
const HotDeal = require('../models/hotDeal.model');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding.');

    // --- ФАЗА 1: ОБРАБОТКА ПОДРОБНЫХ ТОВАРОВ (phones, tablets, accessories) ---
    await Product.deleteMany({});
    console.log('\n--- Processing Detailed Products ---');
    console.log('Old "products" collection cleared.');

    const detailedFiles = ['phones.json', 'tablets.json', 'accessories.json'];
    for (const fileName of detailedFiles) {
      // ... (логика обработки подробных файлов, как и раньше)
      const items = JSON.parse(
        fs.readFileSync(path.join(JSON_DATA_PATH, fileName), 'utf-8'),
      );
      for (const item of items) {
        const newImageUrls = [];
        for (const localImagePath of item.images || []) {
          const fullLocalPath = path.join(IMAGES_BASE_PATH, localImagePath);
          if (fs.existsSync(fullLocalPath)) {
            const s3Key = `catalog/${localImagePath.replace('img/', '')}`;
            await s3.send(
              new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Key,
                Body: fs.createReadStream(fullLocalPath),
                ContentType: mime.lookup(fullLocalPath),
              }),
            );
            newImageUrls.push(
              `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
            );
          }
        }
        await Product.create({
          title: item.name,
          price: item.priceDiscount,
          priceRegular: item.priceRegular,
          category: item.category,
          images: newImageUrls,
          description: JSON.stringify(item.description || ''),
          itemId: item.id,
          namespaceId: item.namespaceId,
          capacity: item.capacity,
          capacityAvailable: item.capacityAvailable,
          color: item.color,
          colorsAvailable: item.colorsAvailable,
          screen: item.screen,
          resolution: item.resolution,
          processor: item.processor,
          ram: item.ram,
          camera: item.camera,
          zoom: item.zoom,
          cell: item.cell,
        });
        console.log(`  > Saved detailed product: ${item.name}`);
      }
    }
    console.log('✅ Detailed products seeding completed!');

    // --- ФАЗА 2: ОБРАБОТКА УПРОЩЕННЫХ ТОВАРОВ (products.json для слайдера) ---
    await HotDeal.deleteMany({});
    console.log('\n--- Processing Hot Deals (Slider Items) ---');
    console.log('Old "hot_deals" collection cleared.');

    const hotDealsFile = path.join(JSON_DATA_PATH, 'products.json');
    if (fs.existsSync(hotDealsFile)) {
      const items = JSON.parse(fs.readFileSync(hotDealsFile, 'utf-8'));
      for (const item of items) {
        const fullLocalPath = path.join(IMAGES_BASE_PATH, item.image);
        let imageUrl = '';
        if (fs.existsSync(fullLocalPath)) {
          const s3Key = `catalog/${item.image.replace('img/', '')}`;
          await s3.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: s3Key,
              Body: fs.createReadStream(fullLocalPath),
              ContentType: mime.lookup(fullLocalPath),
            }),
          );
          imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        }
        await HotDeal.create({
          title: item.name,
          price: item.price,
          priceRegular: item.fullPrice,
          category: item.category,
          itemId: item.itemId,
          image: imageUrl,
        });
        console.log(`  > Saved hot deal: ${item.name}`);
      }
    }
    console.log(' Hot deals seeding completed!');
  } catch (error) {
    console.error(' Error during seeding process:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
  }
}

seedDatabase();
