# Mockhard — Mock Test Platform 🎯

> **Tagline:** Practice Hard. Crack Hard.  
> **Live Site:** [https://amirhashmilive.github.io/mocktest/](https://amirhashmilive.github.io/mocktest/)

Mockhard is a feature-rich, high-performance static web application for taking mock practice tests across 10 of India's major competitive and entrance examinations.

---

## 🌟 Key Features

- **10 Exam Categories (500 Questions Total):**
  1. **UPSC** (Civil Services — History, Polity, Geography, Economy)
  2. **SSC** (CGL / CHSL — GK, Quantitative, English, Reasoning)
  3. **Railways** (RRB NTPC & Group D — Science, Math, GK, Reasoning)
  4. **NEET** (Medical UG — Biology, Physics, Chemistry)
  5. **NORCET** (AIIMS Nursing Officer — Fundamentals, Med-Surg, Pharmacology)
  6. **JEE** (Engineering Main — Mathematics, Physics, Chemistry)
  7. **GATE** (Postgraduate Engineering — Math, Aptitude & Fundamentals)
  8. **CLAT** (Law Entrance — Legal Aptitude, Reasoning, English)
  9. **Board Exams** (Class 10 & 12 Academic — Science, Math, Social Studies, English)
  10. **Defence** (NDA & CDS — Math, English, GK, Science)

- **Real Exam Simulation:**
  - 60-minute configurable countdown timer (1.2 mins per question).
  - Question palette with live status indicators (Answered, Bookmarked, Skipped, Current).
  - Bookmark & flag questions for review during or after tests.
  - Clear response option & auto-save to `localStorage`.
  - Keyboard shortcuts (`A`/`B`/`C`/`D` for options, `←`/`→` for navigation).

- **Comprehensive Score Analysis:**
  - Animated canvas donut score gauge & performance badges.
  - Detailed answer key with step-by-step explanations for every single question.
  - Filter review by All, Correct, Incorrect, or Bookmarked questions.

- **Personal Analytics Dashboard:**
  - Canvas-rendered score trend line chart & category accuracy bar chart.
  - Daily study streak counter with best streak tracker (🔥).
  - Focus area detection highlighting weak categories.
  - Full history table with review links.

- **Random Mixed Test Generator:**
  - Customize question count (10, 25, 50 questions).
  - Selectively mix questions from chosen exam categories.

- **Modern UX/UI:**
  - Fully responsive mobile-first layout.
  - Dark Mode & Light Mode support.
  - Pure Vanilla JS, HTML5, and CSS3 (Zero external dependencies).

---

## 📁 File Structure

```
mocktest/
├── index.html              # Homepage with hero, stats, and featured categories
├── categories.html         # Exam category browser with live search
├── test.html               # Main test-taking interface & timer
├── results.html            # Score review & explanations
├── dashboard.html          # Performance charts, streak & test history
├── random.html             # Custom random test generator
├── css/
│   └── style.css           # Design tokens, theme system & component styles
└── js/
    ├── app.js              # Shared app utilities, toasts & theme toggle
    ├── storage.js          # localStorage manager for test history & streaks
    ├── timer.js            # Countdown timer module with auto-submit
    ├── charts.js           # Pure canvas charting engine (Line, Bar, Donut)
    └── data/               # Question banks (50 questions each)
        ├── upsc.js
        ├── ssc.js
        ├── railways.js
        ├── neet.js
        ├── norcet.js
        ├── jee.js
        ├── gate.js
        ├── clat.js
        ├── board.js
        └── defence.js
```

---

## 🚀 How to Run Locally

1. Clone or open the repository folder:
   ```bash
   git clone https://github.com/amirhashmilive/mocktest.git
   cd mocktest
   ```
2. Open `index.html` in any web browser, or use a local development server such as VS Code Live Server or python http server:
   ```bash
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`.

---

## 🌐 Deployment

The project is designed as a static website ready for GitHub Pages:
- Target repository: `amirhashmilive/mocktest`
- Branch: `main` or `gh-pages`
- Live URL: `https://amirhashmilive.github.io/mocktest/`

---

## 📄 License

Open-source under the MIT License.
