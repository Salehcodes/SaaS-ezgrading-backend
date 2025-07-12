# 🎤 **SaaS ezgrading**: Automated Grading & Mapping System

**SaaS ezgrading** is an innovative tool designed to assist teachers in **grading exams** and **mapping scores** into Excel files using **speech-to-text** technology. Rather than manually filling out rows for each student’s score, this platform automates the process, saving time and reducing errors. Simply speak the scores, and the system will generate the Excel file for you!

---

## 🚀 Features

- 🎓 **Easy Speech-to-Text Input**  
  Teachers can **speak the scores** for each question in the exam, and the system will transcribe it and map it to each student automatically.

- 📊 **Automatic Excel Generation**  
  The platform generates an **Excel file** that includes:
  - Scores for each student
  - **Average score per question**
  - **Average score for the entire exam**

- 🔢 **Student-wise Mapping**  
  Each student's row in the Excel sheet is automatically populated with their scores for all questions in the exam.

- 🧑‍🏫 **Fast and Accurate**  
  The system minimizes human error by eliminating manual data entry and using speech recognition for fast input.

- 🧑‍💻 **SaaS-based Platform**  
  Cloud-hosted for easy access from any device with an internet connection, providing teachers with a smooth and scalable solution.

- 📝 **Customizable Grading**  
  Support for different exam formats—teachers can map answers to any question, and the system adjusts accordingly.

---

## 🔧 Tech Stack

| Technology      | Description                                             |
|-----------------|---------------------------------------------------------|
| 🧑‍💻 **Node.js** | Backend JavaScript runtime for API services             |
| 🎤 **Speech-to-Text** | API integration for transcribing spoken words into text |
| 📊 **ExcelJS**    | Library to create, read, and modify Excel files         |
| 🗃️ **MongoDB**    | NoSQL database to store student data and exam details   |
| ⚡ **Express.js**  | Fast and flexible backend framework                     |
| 🧑‍💻 **React.js** | Frontend library for building the user interface        |

---

## 📸 Screenshots

_Coming soon!_ (You can add screenshots or videos of how the system works, showcasing the frontend and Excel file results.)

---

## 🚀 Getting Started

### Frontend (Client)

1. **Clone the Client Repository**
   ```bash
   git clone https://github.com/Salehcodes/client.git
   ```

2. **Install Dependencies**
   Navigate to the client folder and install the necessary dependencies:
   ```bash
   cd client
   npm install
   ```

3. **Run the Client**
   Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend (API)

1. **Clone the Backend Repository**
   ```bash
   git clone https://github.com/Salehcodes/SaaS-ezgrading-backend.git
   ```

2. **Install Dependencies**
   Navigate to the backend folder and install dependencies:
   ```bash
   cd SaaS-ezgrading-backend
   npm install
   ```

3. **Setup Environment Variables**
   Configure your `.env` file with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/ezgrading
   SPEECH_TO_TEXT_API_KEY=your_speech_to_text_api_key
   PORT=5000
   ```

4. **Run the Backend API**
   Start the backend server:
   ```bash
   npm start
   ```
   The backend will be available at [http://localhost:5000](http://localhost:5000).

---

## 📁 Project Structure

### Frontend (Client)

```bash
client/
├── src/
│   ├── components/          # React components for UI
│   ├── services/            # API services and logic
│   ├── pages/               # Different views for users (teacher dashboard, etc.)
│   └── App.js               # Main app component
└── .env                     # Environment configuration file
```

### Backend (API)

```bash
SaaS-ezgrading-backend/
├── controllers/             # Logic for handling API requests (grading, speech to text)
├── models/                  # Mongoose models for data structures
├── routes/                  # API route definitions
├── middleware/              # Authentication and other middleware
├── .env                     # Environment configuration file
└── server.js                # Main server file to start the app
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project, please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request to the main repository.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

**Saleh**  
🔗 [GitHub Profile](https://github.com/Salehcodes)

---

## ⭐ Show Your Support

If you find this project useful, please give it a ⭐️ on GitHub and share it with others!

---

### Future Enhancements

- **Multi-language Support**: Support for speech-to-text in multiple languages.
- **Improved Accuracy**: Implement machine learning algorithms to enhance speech recognition accuracy.


