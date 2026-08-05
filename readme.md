# 🌐 Aarish Khan - Quantitative & AI Engineer Portfolio

This is the codebase for my personal portfolio website (**[aarishkhan.in](http://aarishkhan.in)**). It is designed to showcase my professional experience as a **Junior Quantitative Researcher** and my technical projects in **Quantitative Finance** and **Artificial Intelligence / Machine Learning**.

The website is a highly optimized, responsive single-page application built using semantic HTML5, custom CSS3 properties (ambient drifting grids, glassmorphism), and Vanilla Javascript.

---

## 🚀 Key Interactive Features

### 1. Quant-AI Strategy Copilot (Hero Showcase)
*   An interactive mock dashboard simulating a quantitative researcher's desk.
*   **Prompt Panel**: Simulates natural language research prompts (e.g., requesting rolling Alpha/Beta or PyTorch LSTM architectures).
*   **Solver Panel**: Simulates a Generative AI engine typing out optimized Python code blocks matching the researcher's query in real-time.

### 2. Options Expiry Stream Simulator (Projects Showcase)
*   A client-side options paper-trading simulator.
*   **Live Price Engine**: Streams random-walk spot price fluctuations and updates strike LTPs (24300, 24350, 24400) dynamically.
*   **Shorting & Long Logic**: Allows simulated Buy (`B`) and Sell (`S`) orders on Calls and Puts.
*   **Real-time Metrics**: Calculates Net PnL (including short profit math) and Portfolio Delta dynamically based on active positions on every price tick.

### 3. Contact Form (Direct Inbox Delivery)
*   Operational contact interface linked securely to my primary email inbox (`aarishk140400@gmail.com`) via AJAX fetch requests to FormSubmit.co.
*   Includes validation, submission loading states, and automated reset handlers.

---

## 🛠️ File Structure

The project is structured simply to ensure fast load times and clean maintenance:
*   **[`index.html`](index.html)**: Main HTML structure and section elements.
*   **[`style.css`](style.css)**: Theme tokens, responsive grid systems, and animations.
*   **[`script.js`](script.js)**: Core client-side engines for the options simulator and typing widgets.
*   **`profile.jpg`**: Professionally edited developer profile headshot.
*   **`CV 2026.pdf`**: Downloadable resume PDF.

---

## 💻 Running the Code Locally

No complex dependencies or node setups are needed to run my website locally. It can be started instantly with Python:

1.  Clone the repository and open a terminal inside the project directory:
    ```bash
    git clone https://github.com/aarishk140400/portfolio.git
    cd portfolio
    ```
2.  Start a local development server:
    ```bash
    python -m http.server 8000
    ```
3.  Open a browser and navigate to:
    👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🔗 Live Demo

My portfolio website is deployed and live at:
👉 **[aarishkhan.in](https://aarishkhan.in)**
