const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model(
  'Course',
  new mongoose.Schema({
    name: String,
    author: {
      type: authorSchema,
      required: true,
    },
  })
);

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseID) {
  const course = await Course.findById(courseID);
  course.author.name = 'Muhanned Noman';
  course.save();
}

async function updateAuthorDirectly(courseID) {
  const course = await Course.update(
    { _id: courseID },
    {
      $set: {
        'author.name': 'Mosh Hamedani',
      },
    }
  );
}

async function removeAuthorDirectly(courseID) {
  const course = await Course.update(
    { _id: courseID },
    {
      $unset: {
        author: '',
      },
    }
  );
}

removeAuthorDirectly('5f30e5e44f69904048c307b3');

// createCourse('Node Course', new Author({ name: 'Mosh' }));
