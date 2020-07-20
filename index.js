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
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  category: {
    type: String,
    enum: ['web', 'mobile', 'network'],
    required: true,
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: (value) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('Some Stuff...');
            const result = value && value.length > 0;
            if (result) {
              resolve();
            } else {
              reject(new Error('A Course should have at least one tag'));
            }
          }, 1000);
        }),
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      // If isPublish then this will be required.
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'React Course',
    category: 'Web',
    author: 'Teacher',
    tags: ['frontend'],
    isPublished: true,
    price: 15.8,
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
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

async function updateCourseFirst(id) {
  // Update first.
  // When you know what you are doing and your sure you want to upate.
  // const result = await Course.update(
  //   { _id: id },
  //   {
  //     $set: {
  //       author: 'Else',
  //       isPublished: false,
  //     },
  //   }
  // );

  // To get the object back
  const result = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: 'Jake',
        isPublished: false,
      },
    },
    // Pass this to get the latest change, not the previous value.
    { new: true }
  );
  console.log(result);
}

async function removeCourse(id) {
  // Delete one
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}

// removeCourse('5f0a24f68bc7e01f7ccc7995');

createCourse();
