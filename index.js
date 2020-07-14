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

  /* 
  ^ => String that starts with something. 
  .find({ author: /^Teac/ })
  $ => String that ends with that thing.
  .find({ author: /cher$/ })
  Add i after the pattern to make case insensative
  .find({ author: /cher$/i })
  .* .* => Contain this text
. find({ author: / .*each.* /i })
   */

  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: 'Teacher', inPublished: true })
    .limit(pageSize)
    // (pageNumber - 1) * pageSize
    .skip((pageNumber - 1) * pageSize)
    .sort({ name: 1 })
    // Only show this properties
    .select({ name: 1, tags: 1 })
    // Get the count of documents that match our filter
    .countDocuments();
  console.log(courses);
}

// getCourses();

async function updateCourse(id) {
  // Query first.
  const course = await Course.findById(id);
  if (!course) return;

  // course.isPublished = true;
  // course.author = "Another Author";

  course.set({
    isPublished: true,
    author: 'Another Author',
  });

  const result = await course.save();

  console.log(result);
}

updateCourse('5f0a24f68bc7e01f7ccc7995');
