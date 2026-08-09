# CGPA & GPA Calculator Pro 🎓

A modern, responsive, and feature-rich **CGPA & GPA Calculator** web application built using standard **HTML, CSS, and JavaScript**. Designed with an aesthetic dark glassmorphism interface, real-time calculation meters, dynamic credit weighting, dual scale toggles, and target performance planning.

---

## 🌟 Key Features

- **🎨 Modern Dark Glassmorphism UI**: Crafted with smooth radial gradients, backdrop blur effects, neon accents, and clean typography (`Plus Jakarta Sans` & `Outfit`).
- **⚡ Dual Scale Support**:
  - **10.0 Scale (CGPA)**: Letter grades `O`, `A+`, `A`, `B+`, `B`, `C`, `P`, `F`.
  - **4.0 Scale (GPA)**: Letter grades `A`, `A-`, `B+`, `B`, `B-`, `C+`, `C`, `C-`, `D`, `F`.
- **📊 Real-time Visual Gauge**: Animated SVG progress ring displaying your exact score, total credits, total grade points, and automatic classification badge (e.g., *First Class with Distinction*, *First Class*, *Second Class*).
- **🎯 Target CGPA Planner**: Enter your target CGPA and remaining semester credits to instantly find out what average GPA you need to maintain.
- **🔢 Percentage Converter**: Automatically calculates percentage equivalent using standard academic conversion rules.
- **📱 Fully Responsive**: Seamless layout adaptation for mobile, tablet, and desktop screens.
- **📖 Grade Reference Table**: Built-in scale breakdown showing grade point values, percentages, and performance levels.

---

## 🧮 How Calculations Work

### 1. Cumulative Grade Point Average (CGPA / GPA)
$$\text{CGPA} = \frac{\sum_{i=1}^{n} (\text{Credits}_i \times \text{Grade Point}_i)}{\sum_{i=1}^{n} \text{Credits}_i}$$

### 2. Percentage Equivalent
- **10.0 Scale Formula**:
  $$\text{Percentage (\%)} = (\text{CGPA} - 0.75) \times 10$$
- **4.0 Scale Formula**:
  $$\text{Percentage (\%)} = \left(\frac{\text{GPA}}{4.0}\right) \times 100$$

### 3. Target CGPA Required GPA
$$\text{Required GPA} = \frac{(\text{Target CGPA} \times \text{Total Future Credits}) - \text{Total Points Earned}}{\text{Remaining Credits}}$$

---

## 📁 Project Structure

```text
CGPA_CALCULATOR/
├── index.html        # Semantic HTML structure & accessible form components
├── styles.css        # CSS variables, glassmorphism card styling, responsive grid & animations
├── script.js        # Core logic, scale switching, grade calculation, and progress ring meter
└── README.md         # Comprehensive project documentation
```

---

## 💻 Tech Stack

- **HTML5**: Semantic tags, accessibility attributes, custom select forms.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, SVG styling, animations, and keyframes.
- **Vanilla JavaScript**: Lightweight DOM manipulation, dynamic row insertion, mathematical calculations, and event handlers.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
