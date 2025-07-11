# 🎓 Slotify - Time Table Scheduler

## Overview
Welcome to **Slotify**! 🚀  
A powerful time table scheduling application built with React. Easily manage your academic schedule, handle course selections, and avoid time slot clashes. Perfect for students and academic institutions looking to streamline their course scheduling process! 😎

---

## Features
- **Course Selection**: Intuitive interface for selecting multiple courses. 📚
- **Clash Detection**: Automatic detection and warning for time slot conflicts. ⚠️
- **PDF Upload**: Support for uploading and parsing course timetables. 📄
- **Visual Grid**: Clear visual representation of your schedule. 📅
- **Dynamic Updates**: Real-time schedule updates as you select courses. ⚡
- **Responsive Design**: Works seamlessly across all devices. 📱
- **Error Handling**: Robust validation and error messaging. 🛡️
- **User-Friendly**: Clean and intuitive interface for easy navigation. 🎯

---

## Technologies Used
- **Frontend**: React.js
- **State Management**: React Hooks
- **Styling**: CSS Modules
- **PDF Processing**: PDF.js
- **Build Tool**: Vite
- **Package Manager**: npm
- **Version Control**: Git

---

## File Structure
```
src/
  App.jsx              # Main application component
  index.css            # Global styles
  main.jsx             # Entry point
  assets/              # Static assets
  components/          # React components
    ClashWarning.jsx   # Conflict warning component
    CourseSelector.jsx # Course selection interface
    Fileuploader.jsx   # PDF upload component
    SelectedCourses.jsx# Selected courses display
    SlotGrid.jsx       # Time table grid display
  data/
    slotMapping.js     # Time slot mapping data
  utils/
    parser.js          # PDF parsing utilities
```

---

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/notvenu/slotify
   cd Slotify
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```
   The application will start at [http://localhost:5173](http://localhost:5173)

---

## Usage

1. **Upload Timetable**
   - Click on the upload button
   - Select your course timetable PDF
   - Wait for the parsing to complete

2. **Select Courses**
   - Browse through available courses
   - Click to select desired courses
   - View them in the schedule grid

3. **Manage Conflicts**
   - Watch for clash warnings
   - Adjust selections as needed
   - Ensure a conflict-free schedule

---

## Screenshots

### Course Selection Interface
![Course Selection](./screenshots/course-selection.png)
*The main interface where users can select their courses*

### Time Table Grid
![Time Table](./screenshots/timetable-grid.png)
*Visual representation of the selected course schedule*

### Clash Detection
![Clash Warning](./screenshots/clash-warning.png)
*Warning displayed when time slot conflicts are detected*

### PDF Upload
![PDF Upload](./screenshots/pdf-upload.png)
*Interface for uploading course timetable PDFs*

---

## Dependencies

- Node.js (v16+ recommended)
- Modern web browser
- PDF reader support
- npm or yarn

---

## Notes

- Supports standard academic timetable formats
- Optimized for both desktop and mobile viewing
- Regular updates and maintenance
- Community contributions welcome

---

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Venu K](https://github.com/notvenu)