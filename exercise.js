const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/mongo-exercises', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB...'))
  .catch((err) => console.log('Error', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  Price: Number,
});

const Course = mongoose.model('Course', courseSchema);

async function getAllPublishedBackendCourses() {
  const courses = await Course.find({
    isPublished: true,
    tags: { $in: 'backend' },
  })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });

  console.log(courses);
}

// getAllPublishedBackendCourses();

async function getAllPublishedFrontendCourses() {
  const courses = await Course.find({
    isPublished: true,
    tags: { $in: ['backend', 'frontend'] },
  })
    .sort({ price: -1 })
    .select({ name: 1, author: 1 });

  console.log(courses);
}

// getAllPublishedFrontendCourses();

async function getAllPublishedByAndPrice() {
  const courses = await Course.find({ isPublished: true }).or([
    { price: { $gte: 15 } },
    { name: /.*by.*/i },
  ]);

  console.log(courses);
}

getAllPublishedByAndPrice();
