# EcoLearn Architecture Notes

## Roles

### Visitor
- Browse and search courses
- Read course and instructor pages
- Create an account
- Apply to become an instructor
- Verify certificates

### Student
- Enroll in courses
- Save courses
- Open lessons and resources
- Complete quizzes and assignments
- Track progress
- Receive eligible certificates
- Join course discussions

### Instructor
- Maintain an instructor profile
- Create courses, modules, lessons, resources, quizzes, and assignments
- Save drafts and submit courses for review
- View learner progress and discussion questions
- Publish announcements after approval

### Administrator
- Review instructor applications
- Review and approve courses
- Manage users, categories, reviews, reports, certificates, and announcements
- Suspend accounts and remove inappropriate content
- Review audit logs and platform analytics

## Main user journeys

1. Visitor searches a topic → filters courses → reads a course page → creates an account → enrolls.
2. Student opens My Learning → continues the current lesson → completes a quiz → progress updates → certificate becomes eligible.
3. Instructor applies → administrator reviews → instructor creates a course → submits for review → administrator approves → course publishes.
4. Employer opens certificate verification → enters certificate ID → receives the verified course, learner, and issue date.

## Front-end state in this MVP

The runnable demonstration stores saved courses, enrollments, and progress in `localStorage`. This keeps the project usable without service credentials. Real accounts and multi-device synchronization require a backend.
