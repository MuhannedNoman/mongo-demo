const mongoose = require('mongoose');
const env = require('./env');

mongoose
  .connect(env.DB_CONNECTION_STRING, {
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
  inPublished: Boolean,
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'React Course',
    author: 'Teacher',
    tags: ['React', 'front-end'],
    inPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // .find( {price: { $gt: 10 } } )
  // gte (greater than or equal)
  // lt (less than)
  // lte (less than or equal)
  // .find( {price: { $gt: 10, $lte: 20 } } )
  // in
  // .find( {price: { $in: [10, 15, 20] } } )
  // nin (not in)

  /*
  .find()
  .or([{author: 'Teacher'},{is Published: true} ])
  and([ ])
  */

  const courses = await Course.find({ author: 'Teacher', inPublished: true })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

getCourses();
