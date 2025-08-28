const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
// #region mongoose + users + posts
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

// const User = require('./models/user.model');
const User = require("./models/user.model");
const Post = require("./models/post.model");
const Product = require("./models/product.model");
const HotDeal = require("./models/hotDeal.model");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));
// #endregion

// multer + .env variables
// const AWS = require('aws-sdk');
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Добавляем DeleteObjectCommand
const multerS3 = require("multer-s3");

// Settings of AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ИЗ S3 ---
const deleteS3Object = async (fileUrl) => {
  try {
    const key = fileUrl.split("/").pop(); // Получаем ключ файла из URL
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    await s3.send(command);
    console.log(`Successfully deleted ${key} from S3.`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${fileUrl}`, error);
  }
};
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

const app = express();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-eval'"],
    },
  })
);
const PORT = process.env.PORT || 4000; // var for environment port or 4000

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "my_shop_project_super_secret"; // Используем переменную окружения для секрета

// импортируем данные
// const phones = require('./api/phones.json');
// const products = require('./api/products.json');
// const tablets = require('./api/tablets.json');

// загрузка данных
// function loadInitialPosts() {
//   const posts = [...phones, ...products, ...tablets].map((item, i) => ({
//     id: Date.now() + i,
//     title: item.name || item.title || 'Без названия',
//     description: item.description || '',
//     price: item.price || 0,
//     ownerId: 0, // системный владелец
//   }));
//   writeData('posts.json', posts);
// }

// #region вызови функции только если posts.json пуст

// const fs = require('fs');

// const postsFile = path.join(__dirname, 'data/posts.json');
// if (fs.existsSync(postsFile)) {
//   const existing = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
//   if (existing.length === 0) {
//     loadInitialPosts();
//   }
// } else {
//   loadInitialPosts();
// }

// #endregion

// #region multer (for uploads)   DELETED AND REPLACED WITH MULTER-S3
// const multer = require('multer');

//  Папка для изображений
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Сделаем папку uploads доступной для фронта
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// #endregion

// #region multer-s3 (for uploads to AWS S3)
const multer = require("multer");

const upload = multer({
  storage: multerS3({
    s3: s3, // my S3 instance
    bucket: process.env.AWS_BUCKET_NAME, // bucket name
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // unique file name
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
// #endregion

app.use(cors()); // чтобы frontend мог делать запросы
app.use(bodyParser.json()); // чтобы сервер понимал JSON в теле запросов

// Тестовый роут, чтобы проверить сервер
app.get("/", (req, res) => {
  res.send("Backend работает и подключен к MongoDB!");
});

// #region регистрация
// app.post('/register', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email и пароль обязательны' });
//   }

//   const users = readData('users.json');

//   const userExists = users.find(u => u.email === email);
//   if (userExists) {
//     return res.status(400).json({ message: 'Пользователь уже существует' });
//   }

//   // Хэшируем пароль
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Создаём пользователя
//   const newUser = { id: Date.now(), email, password: hashedPassword };

//   users.push(newUser);
//   writeData('users.json', users);

//   res.status(201).json({ message: 'Пользователь создан' });
// });
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Пользователь успешно создан" });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка на сервере при регистрации",
      error: error.message,
    });
  }
});
// #endregion

// #region authorization (авторизация)
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email и пароль обязательны' });
//   }

//   const users = readData('users.json');
//   const user = users.find(u => u.email === email);
//   if (!user) {
//     return res.status(400).json({ message: 'Пользователь не найден' });
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) {
//     return res.status(400).json({ message: 'Неверный пароль' });
//   }

//   // ИЗМЕНЕНО: Создаём два токена
//   const userData = { id: user.id, email: user.email };

//   const accessToken = jwt.sign(userData, SECRET_KEY, {
//     expiresIn: '15m', // Короткое время жизни
//   });

//   const refreshToken = jwt.sign(userData, SECRET_KEY, {
//     expiresIn: '7d', // Длинное время жизни
//   });

//   // Здесь можно было бы сохранить refreshToken в базу данных для большей безопасности,
//   // но для простоты оставим так.

//   res.json({ accessToken, refreshToken }); // Отправляем оба токена
// });
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    // ВАЖНО: используем _id из MongoDB
    const userData = { id: user._id, email: user.email };
    const accessToken = jwt.sign(userData, SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign(userData, SECRET_KEY, { expiresIn: "7d" });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка на сервере при авторизации",
      error: error.message,
    });
  }
});
// #endregion

// #region аутентификация токена
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token)
//     return res.status(401).json({ message: 'Access токен не предоставлен' });

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) {
//       // Если ошибка в том, что токен ИСТЕК, отправляем 401
//       if (err.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: 'Токен истек' });
//       }
//       // Для всех других ошибок (неверная подпись и т.д.) - отправляем 403
//       return res.status(403).json({ message: 'Токен недействителен' });
//     }
//     req.user = user;
//     next();
//   });
// }
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access токен не предоставлен" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Токен истек" });
      }
      return res.status(403).json({ message: "Токен недействителен" });
    }
    req.user = user; // user будет содержать { id, email }
    next();
  });
}
// #endregion

// #region endpoint for token refreshment
// app.post('/refresh-token', (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) {
//     return res.status(401).json({ message: 'Refresh токен не предоставлен' });
//   }

//   jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
//     // Если refresh токен истек или невалиден - отказываем в доступе навсегда
//     if (err) {
//       return res.status(403).json({ message: 'Refresh токен недействителен' });
//     }

//     // Если все хорошо, создаем новую пару токенов
//     const userData = { id: user.id, email: user.email };

//     const newAccessToken = jwt.sign(userData, SECRET_KEY, { expiresIn: '15m' });
//     const newRefreshToken = jwt.sign(userData, SECRET_KEY, { expiresIn: '7d' });

//     res.json({
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//     });
//   });
// });
app.post("/refresh-token", (req, res) => {
  // Этот роут остается без изменений, т.к. не работает с БД напрямую
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh токен не предоставлен" });

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Refresh токен недействителен" });

    const userData = { id: user.id, email: user.email };
    const newAccessToken = jwt.sign(userData, SECRET_KEY, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign(userData, SECRET_KEY, { expiresIn: "7d" });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
});
// #endregion

// #region load posts (загрузить посты)
// app.get('/posts', (req, res) => {
//   const posts = readData('posts.json');
//   res.json(posts);
// });
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Сортируем по дате создания
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Не удалось загрузить посты", error: error.message });
  }
});
// #endregion

// create new post with image (создать новый пост с изображением)
// app.post('/posts', authenticateToken, upload.array('images', 5), (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     phoneNumber,
//     email,
//     contactPerson,
//     category,
//     quality,
//   } = req.body;

//   if (!title || !price) {
//     return res.status(400).json({ message: 'Title и price обязательны' });
//   }

//   const posts = readData('posts.json');

//   const newPost = {
//     id: Date.now(),
//     title,
//     description: description || '',
//     price,
//     phoneNumber: phoneNumber || '',
//     email: email || '',
//     contactPerson: contactPerson || '',
//     category: category || 'others',
//     quality: quality || 'used',
//     ownerId: req.user.id,
//     images: req.files.map(file => file.location), // <-- ИСПОЛЬЗУЕМ ССЫЛКУ ИЗ S3
//   };

//   posts.push(newPost);
//   writeData('posts.json', posts);

//   res.status(201).json(newPost);
// });
app.post(
  "/posts",
  authenticateToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        phoneNumber,
        email,
        contactPerson,
        category,
        quality,
      } = req.body;
      if (!title || !price) {
        return res
          .status(400)
          .json({ message: "Заголовок и цена обязательны" });
      }

      const newPost = await Post.create({
        title,
        description,
        price,
        phoneNumber,
        email,
        contactPerson,
        category,
        quality,
        ownerId: req.user.id, // ID из токена
        images: req.files.map((file) => file.location), // Ссылки из S3
      });

      res.status(201).json(newPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Не удалось создать пост", error: error.message });
    }
  }
);

// #region edit post (owner only)
// app.put(
//   '/posts/:id',
//   authenticateToken,
//   upload.array('images', 5),
//   (req, res) => {
//     const postId = Number(req.params.id);
//     const {
//       title,
//       description,
//       price,
//       phoneNumber,
//       email,
//       contactPerson,
//       category,
//       quality,
//       removeImages, // ожидаем JSON-строку с массивом URL для удаления
//     } = req.body;

//     const posts = readData('posts.json');
//     const postIndex = posts.findIndex(p => p.id === postId);

//     if (postIndex === -1) {
//       return res.status(404).json({ message: 'Пост не найден' });
//     }

//     if (posts[postIndex].ownerId !== req.user.id) {
//       return res.status(403).json({ message: 'Нет прав на редактирование' });
//     }

//     // Обрабатываем удаление картинок, если removeImages передан
//     let currentImages = posts[postIndex].images || [];

//     if (removeImages) {
//       let removeList;
//       try {
//         removeList = JSON.parse(removeImages);
//       } catch (e) {
//         return res
//           .status(400)
//           .json({ message: 'removeImages должен быть JSON-массивом' });
//       }

//       // Удаляем файлы из uploads
//       removeList.forEach(url => {
//         const filename = url.split('/uploads/')[1];
//         if (filename) {
//           const filepath = path.join(__dirname, 'uploads', filename);
//           if (fs.existsSync(filepath)) {
//             fs.unlinkSync(filepath);
//           }
//         }
//       });

//       // Фильтруем массив изображений
//       currentImages = currentImages.filter(img => !removeList.includes(img));
//     }

//     // Добавляем новые загруженные файлы
//     const newImages = req.files.map(file => file.location); // <-- ИСПОЛЬЗУЕМ ССЫЛКУ ИЗ S3

//     const updatedPost = {
//       ...posts[postIndex],
//       title: title || posts[postIndex].title,
//       description: description || posts[postIndex].description,
//       price: price !== undefined ? price : posts[postIndex].price,
//       phoneNumber: phoneNumber || posts[postIndex].phoneNumber,
//       email: email || posts[postIndex].email,
//       contactPerson: contactPerson || posts[postIndex].contactPerson,
//       category: category || posts[postIndex].category,
//       quality: quality || posts[postIndex].quality,
//       images: [...currentImages, ...newImages],
//     };

//     posts[postIndex] = updatedPost;
//     writeData('posts.json', posts);

//     res.json(updatedPost);
//   },
// );
app.put(
  "/posts/:id",
  authenticateToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
      // ВАЖНО: Сравниваем ID владельца, приведя его к строке
      if (post.ownerId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Нет прав на редактирование этого поста" });
      }

      // Удаление старых изображений из S3
      if (req.body.removeImages) {
        let removeList = JSON.parse(req.body.removeImages);
        for (const imageUrl of removeList) {
          await deleteS3Object(imageUrl); // Вызываем нашу новую функцию
        }
        post.images = post.images.filter((img) => !removeList.includes(img));
      }

      // Добавление новых изображений
      const newImages = req.files.map((file) => file.location);

      // Обновляем поля
      const {
        title,
        description,
        price,
        phoneNumber,
        email,
        contactPerson,
        category,
        quality,
      } = req.body;
      post.title = title || post.title;
      post.description = description || post.description;
      post.price = price !== undefined ? price : post.price;
      post.phoneNumber = phoneNumber || post.phoneNumber;
      post.email = email || post.email;
      post.contactPerson = contactPerson || post.contactPerson;
      post.category = category || post.category;
      post.quality = quality || post.quality;
      post.images = [...post.images, ...newImages];

      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Не удалось обновить пост", error: error.message });
    }
  }
);
// #endregion
// delete post (owner only)

// #region delete post
// app.delete('/posts/:id', authenticateToken, (req, res) => {
//   const postId = Number(req.params.id);
//   const posts = readData('posts.json');

//   const postIndex = posts.findIndex(p => p.id === postId);
//   if (postIndex === -1) {
//     return res.status(404).json({ message: 'Пост не найден' });
//   }

//   if (posts[postIndex].ownerId !== req.user.id) {
//     return res.status(403).json({ message: 'Нет прав на удаление' });
//   }

//   posts.splice(postIndex, 1);
//   writeData('posts.json', posts);
//   res.json({ message: 'Пост удалён' });
// });
app.delete("/posts/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }
    if (post.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Нет прав на удаление этого поста" });
    }

    // Удаляем все связанные изображения из S3 перед удалением поста из БД
    for (const imageUrl of post.images) {
      await deleteS3Object(imageUrl);
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: "Пост успешно удалён" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Не удалось удалить пост", error: error.message });
  }
});

// #endregion

// get current user's posts
// app.get('/my-posts', authenticateToken, (req, res) => {
//   const posts = readData('posts.json');
//   const myPosts = posts.filter(p => p.ownerId === req.user.id);
//   res.json(myPosts);
// });
app.get("/my-posts", authenticateToken, async (req, res) => {
  try {
    const myPosts = await Post.find({ ownerId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(myPosts);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось загрузить ваши посты",
      error: error.message,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось загрузить товары каталога",
      error: error.message,
    });
  }
});

// НОВЫЙ РОУТ: Получить товары для слайдера
app.get("/hot-deals", async (req, res) => {
  try {
    const deals = await HotDeal.find({});
    res.json(deals);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось загрузить горячие предложения",
      error: error.message,
    });
  }
});
// server launch
app.listen(PORT, () => {
  console.log(`Server запущен на http://localhost:${PORT}`);
});
