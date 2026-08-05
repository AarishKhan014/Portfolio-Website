/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.style.display === 'flex';
        mobileMenu.style.display = isOpen ? 'none' : 'flex';
        menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
}

/* ==========================================================================
   STEALTH AI COPILOT SIMULATION (HERO SECTION)
   ========================================================================== */
const audioTranscript = document.getElementById('audioTranscript');
const codeSolver = document.getElementById('codeSolver');

const copilotScenarios = [
    {
        transcript: [
            { sender: "System", text: "[System] Processing research input..." },
            { sender: "Researcher", text: "Compute the rolling Alpha and Beta of our strategy daily returns." },
            { sender: "Researcher", text: "Use a rolling window of 60 trading days against the benchmark index returns." }
        ],
        code: `import numpy as np
import pandas as pd

def rolling_alpha_beta(strat_returns, benchmark_returns, window=60):
    # 1. Compute rolling covariance and benchmark variance
    covariance = strat_returns.rolling(window).cov(benchmark_returns)
    benchmark_var = benchmark_returns.rolling(window).var()
    
    # 2. Beta = Cov(X, Y) / Var(Y)
    beta = covariance / benchmark_var
    
    # 3. Alpha = Mean(X) - Beta * Mean(Y)
    alpha = strat_returns.rolling(window).mean() - beta * benchmark_returns.rolling(window).mean()
    
    return alpha, beta

# Metrics calculated successfully for 60-day rolling window.
# Returns: Alpha (Series), Beta (Series)`
    },
    {
        transcript: [
            { sender: "System", text: "[System] Loading PyTorch neural net templates..." },
            { sender: "Researcher", text: "Build an LSTM model in PyTorch to forecast short-term volatility." },
            { sender: "Researcher", text: "Input is a sequence of 50 order book imbalance ratios (bid/ask volume)." }
        ],
        code: `import torch
import torch.nn as nn

class VolatilityLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=32, num_layers=2):
        super(VolatilityLSTM, self).__init__()
        # LSTM layer to capture sequential order book dynamics
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)
        
    def forward(self, x):
        # x shape: (batch_size, seq_len=50, input_dim=1)
        lstm_out, _ = self.lstm(x)
        last_step = lstm_out[:, -1, :] # state at last timestep
        out = self.fc(last_step)
        return torch.abs(out) # Volatility must be positive

# Model structure initialized successfully. Ready for optimization loop...`
    }
];

let currentScenarioIndex = 0;
let typingTimeout = null;

function runCopilotSimulation() {
    if (!audioTranscript || !codeSolver) return;
    
    const scenario = copilotScenarios[currentScenarioIndex];
    audioTranscript.innerHTML = '';
    codeSolver.textContent = '';
    
    let transcriptIndex = 0;
    
    function typeTranscript() {
        if (transcriptIndex < scenario.transcript.length) {
            const line = scenario.transcript[transcriptIndex];
            const lineDiv = document.createElement('div');
            
            if (line.sender === "System") {
                lineDiv.className = 'log-line system-msg';
                lineDiv.textContent = line.text;
            } else {
                lineDiv.className = 'log-line speaker';
                lineDiv.innerHTML = `<strong>${line.sender}:</strong> `;
                audioTranscript.appendChild(lineDiv);
                
                // Type transcript text character by character
                let charIndex = 0;
                function typeChar() {
                    if (charIndex < line.text.length) {
                        lineDiv.innerHTML += line.text.charAt(charIndex);
                        charIndex++;
                        typingTimeout = setTimeout(typeChar, 30);
                    } else {
                        audioTranscript.scrollTop = audioTranscript.scrollHeight;
                        transcriptIndex++;
                        typingTimeout = setTimeout(typeTranscript, 1000);
                    }
                }
                typeChar();
                return;
            }
            
            audioTranscript.appendChild(lineDiv);
            audioTranscript.scrollTop = audioTranscript.scrollHeight;
            transcriptIndex++;
            typingTimeout = setTimeout(typeTranscript, 1200);
        } else {
            // Transcript finished, start typing code solver output
            typingTimeout = setTimeout(typeCode, 500);
        }
    }
    
    function typeCode() {
        let codeCharIndex = 0;
        const codeText = scenario.code;
        
        function typeCodeChar() {
            // Speed up typing by outputting 2-3 characters at a time for longer code
            if (codeCharIndex < codeText.length) {
                const chunk = codeText.substr(codeCharIndex, 3);
                codeSolver.textContent += chunk;
                codeCharIndex += chunk.length;
                
                // Adjust styling
                audioTranscript.scrollTop = audioTranscript.scrollHeight;
                
                typingTimeout = setTimeout(typeCodeChar, 15);
            } else {
                // Done writing. Wait 6 seconds and load next scenario
                currentScenarioIndex = (currentScenarioIndex + 1) % copilotScenarios.length;
                typingTimeout = setTimeout(runCopilotSimulation, 6000);
            }
        }
        typeCodeChar();
    }
    
    typeTranscript();
}

// Start simulation on load
window.addEventListener('DOMContentLoaded', () => {
    runCopilotSimulation();
});

/* ==========================================================================
   OPTION HEDGING SIMULATOR WIDGET (PROJECTS SECTION)
   ========================================================================== */
// State Variables
let spotPrice = 24352.40;
let baseExtrinsic = 40.0;
let isSimRunning = true;
let simInterval = null;
let activePositions = [];
let positionIdCounter = 0;

// Strike Prices configurations
const strikes = [24300, 24350, 24400];
const ltpElements = {
    CE: [document.getElementById('ltpCE1'), document.getElementById('ltpCE2'), document.getElementById('ltpCE3')],
    PE: [document.getElementById('ltpPE1'), document.getElementById('ltpPE2'), document.getElementById('ltpPE3')]
};
const spotPriceEl = document.getElementById('simSpotPrice');
const pnlEl = document.getElementById('simPnL');
const deltaEl = document.getElementById('simDelta');
const toggleSimBtn = document.getElementById('toggleSimBtn');
const positionsList = document.getElementById('positionsList');
const posCountEl = document.getElementById('posCount');
const clearPositionsBtn = document.getElementById('clearPositionsBtn');

// Pricing Model: Black-Scholes-like approximation for ticking options prices
function calculateOptionLTPs() {
    const ltpData = { CE: [], PE: [] };
    
    strikes.forEach((strike, index) => {
        // CE Price = Intrinsic (Spot - Strike) + Extrinsic
        const intrinsicCE = Math.max(spotPrice - strike, 0);
        // PE Price = Intrinsic (Strike - Spot) + Extrinsic
        const intrinsicPE = Math.max(strike - spotPrice, 0);
        
        // Add fluctuating extrinsic value based on distance to strike
        const distance = Math.abs(spotPrice - strike);
        const decayFactor = Math.exp(-distance / 80); // decays as strike is further out of the money
        
        // Add some random noise to the extrinsic value to make it look alive
        const noise = (Math.sin(Date.now() / 2000 + index) * 0.5) + (Math.random() * 0.3);
        const currentExtrinsic = (baseExtrinsic * decayFactor) + noise;
        
        const priceCE = Math.max(intrinsicCE + currentExtrinsic, 1.05); // options can't go below 0.05 (tick limit)
        const pricePE = Math.max(intrinsicPE + currentExtrinsic, 1.05);
        
        ltpData.CE.push(parseFloat(priceCE.toFixed(2)));
        ltpData.PE.push(parseFloat(pricePE.toFixed(2)));
    });
    
    return ltpData;
}

// Delta Approximation formulas (Normal CDF approximation)
function calculateOptionDeltas(type, strike) {
    const spot = spotPrice;
    // Logistic function to approximate normal delta distribution
    // CE Delta ranges from 0 to 1
    // PE Delta ranges from -1 to 0
    const x = (spot - strike) / 30; // 30 represents option volatility scaling factor
    const rawDelta = 1 / (1 + Math.exp(-x));
    
    if (type === 'CE') {
        return parseFloat(rawDelta.toFixed(2));
    } else {
        return parseFloat((rawDelta - 1).toFixed(2));
    }
}

// Update the Options chain table UI
function updateOptionChainUI() {
    const ltpData = calculateOptionLTPs();
    
    for (let i = 0; i < strikes.length; i++) {
        if (ltpElements.CE[i]) ltpElements.CE[i].textContent = ltpData.CE[i].toFixed(2);
        if (ltpElements.PE[i]) ltpElements.PE[i].textContent = ltpData.PE[i].toFixed(2);
    }
    
    // Update live metrics
    if (spotPriceEl) spotPriceEl.textContent = spotPrice.toFixed(2);
    
    updatePortfolioCalculations(ltpData);
}

// Portfolio calculations: Net PnL and Delta updates
function updatePortfolioCalculations(currentLtpData) {
    let totalPnL = 0;
    let totalDelta = 0;
    
    activePositions.forEach(pos => {
        // Find current price in ticking data
        const strikeIndex = strikes.indexOf(pos.strike);
        let currentPrice = pos.entryPrice;
        
        if (strikeIndex !== -1) {
            const ltpList = currentLtpData || calculateOptionLTPs();
            currentPrice = pos.type === 'CE' ? ltpList.CE[strikeIndex] : ltpList.PE[strikeIndex];
        }
        
        // Calculate PnL (Buy side)
        // Calculate PnL: Buy is (current - entry), Sell is (entry - current)
        const directionMultiplier = pos.action === 'buy' ? 1 : -1;
        const pnl = (currentPrice - pos.entryPrice) * pos.qty * directionMultiplier;
        pos.currentPrice = currentPrice;
        pos.pnl = pnl;
        
        totalPnL += pnl;
        
        // Calculate Delta contribution: Sell reverses Delta sign
        const singleDelta = calculateOptionDeltas(pos.type, pos.strike);
        totalDelta += singleDelta * pos.qty * directionMultiplier;
    });
    
    // Render PnL metrics
    if (pnlEl) {
        pnlEl.textContent = `${totalPnL >= 0 ? '+' : ''}₹${totalPnL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        pnlEl.className = `value ${totalPnL > 0 ? 'green' : totalPnL < 0 ? 'red' : ''}`;
    }
    
    // Render Delta metrics
    if (deltaEl) {
        deltaEl.textContent = totalDelta.toFixed(2);
    }
    
    // Update active position items PnL live
    activePositions.forEach(pos => {
        const itemPnlEl = document.getElementById(`pos-pnl-${pos.id}`);
        if (itemPnlEl) {
            itemPnlEl.textContent = `${pos.pnl >= 0 ? '+' : ''}₹${pos.pnl.toFixed(2)}`;
            itemPnlEl.className = `pos-pnl ${pos.pnl > 0 ? 'green' : pos.pnl < 0 ? 'red' : ''}`;
        }
    });
}

// Execute options purchase in Simulator
window.executeSimTrade = function(type, strike, price, action) {
    if (!isSimRunning) {
        alert("Please start the simulation stream first!");
        return;
    }
    
    const qty = 50; // standard lot size
    const newPosition = {
        id: positionIdCounter++,
        strike: strike,
        type: type,
        action: action, // 'buy' or 'sell'
        entryPrice: price,
        qty: qty,
        currentPrice: price,
        pnl: 0
    };
    
    activePositions.push(newPosition);
    updatePositionsUI();
};

// Update active positions lists
function updatePositionsUI() {
    if (!positionsList) return;
    
    if (activePositions.length === 0) {
        positionsList.innerHTML = '<div class="empty-pos-msg">No active options positions. Click "B" (Buy) or "S" (Sell) on any strike price to open a position.</div>';
        if (posCountEl) posCountEl.textContent = '0';
        updatePortfolioCalculations();
        return;
    }
    
    if (posCountEl) posCountEl.textContent = activePositions.length.toString();
    positionsList.innerHTML = '';
    
    activePositions.forEach(pos => {
        const posDiv = document.createElement('div');
        posDiv.className = 'pos-item';
        
        // Define clean formatting styles for Buy (green highlight) and Sell (red highlight) tags
        const tagColor = pos.action === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)';
        
        posDiv.innerHTML = `
            <div class="pos-info">
                <span class="pos-tag" style="color: ${tagColor}; font-weight: 700;">
                    ${pos.action.toUpperCase()} ${pos.strike} ${pos.type}
                </span>
                <span class="pos-qty">Qty: ${pos.qty}</span>
                <span class="pos-entry">Entry: ₹${pos.entryPrice.toFixed(2)}</span>
            </div>
            <div class="pos-info">
                <span class="pos-pnl" id="pos-pnl-${pos.id}">₹0.00</span>
                <button class="pos-close" onclick="closeSimPosition(${pos.id})" aria-label="Close Position"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
        positionsList.appendChild(posDiv);
    });
    
    updatePortfolioCalculations();
}

// Close an options position
window.closeSimPosition = function(id) {
    activePositions = activePositions.filter(pos => pos.id !== id);
    updatePositionsUI();
};

// Clear all active positions
if (clearPositionsBtn) {
    clearPositionsBtn.addEventListener('click', () => {
        activePositions = [];
        updatePositionsUI();
    });
}

// Live ticking engine loops
function startSimStream() {
    if (simInterval) clearInterval(simInterval);
    
    simInterval = setInterval(() => {
        // Random walk spot price fluctuation (+/- 2.5 points)
        const tickMove = (Math.random() - 0.5) * 2.5;
        spotPrice += tickMove;
        
        // Extrinsic value fluctuates slowly
        baseExtrinsic += (Math.random() - 0.5) * 0.4;
        baseExtrinsic = Math.max(30.0, Math.min(baseExtrinsic, 55.0));
        
        updateOptionChainUI();
    }, 1000);
}

function stopSimStream() {
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
    }
}

// Toggle Stream Play/Pause
if (toggleSimBtn) {
    toggleSimBtn.addEventListener('click', () => {
        isSimRunning = !isSimRunning;
        if (isSimRunning) {
            toggleSimBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
            startSimStream();
        } else {
            toggleSimBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
            stopSimStream();
        }
    });
}

// Run Option Simulator on load
window.addEventListener('DOMContentLoaded', () => {
    startSimStream();
});

/* ==========================================================================
   CONTACT FORM SUBMISSION LOGIC
   ========================================================================== */
window.handleContactSubmit = function(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccessMsg');
    
    if (form && successMsg) {
        // Capture Form Values
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const message = document.getElementById('formMessage').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Disable submit button and change text
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        
        // Post form data to FormSubmit API via AJAX fetch
        fetch("https://formsubmit.co/ajax/aarishk140400@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("FormSubmit Response:", data);
            
            // Hide form inputs, show animated success block
            form.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. I will get back to you soon.';
            
            // Restore form inputs after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMsg.style.display = 'none';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            }, 5000);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
            alert("Oops! Something went wrong. Please try again or email directly at aarishk140400@gmail.com");
        });
    }
};
