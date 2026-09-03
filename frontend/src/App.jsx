import { useState } from "react";
import "./App.css";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 64 64" className="shield-icon">
      <path
        d="M32 5L53 13V29C53 43 44 54 32 59C20 54 11 43 11 29V13L32 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M22 32L28 38L43 23"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 64 64" className="lock-icon">
      <rect
        x="14"
        y="28"
        width="36"
        height="27"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M22 28V20C22 14 26 10 32 10C38 10 42 14 42 20V28"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [fraudResult, setFraudResult] = useState(null);
  const [fraudLoading, setFraudLoading] = useState(false);

  const [transaction, setTransaction] = useState({
    user_id: 1,
    amount: "",
    is_new_recipient: false,
    usual_amount: "",
    transaction_hour: 12,
    is_new_device: false,
  });

  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    setFraudLoading(true);
    setFraudResult(null);

    try {
      const response = await fetch(
        "https://surakshaai-t389.onrender.com/fraud/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        },
      );

      const data = await response.json();
      setFraudResult(data);
    } catch {
      setFraudResult({
        error: "Unable to connect to SurakshaAI backend.",
      });
    }

    setFraudLoading(false);
  };

  const analyzeTransaction = async () => {
    if (!transaction.amount || !transaction.usual_amount) return;

    setTransactionLoading(true);
    setTransactionResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/transactions/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...transaction,
            amount: Number(transaction.amount),
            usual_amount: Number(transaction.usual_amount),
            transaction_hour: Number(transaction.transaction_hour),
          }),
        },
      );

      const data = await response.json();
      setTransactionResult(data);
    } catch {
      setTransactionResult({
        error: "Unable to connect to SurakshaAI backend.",
      });
    }

    setTransactionLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-shield">
            <ShieldIcon />
          </div>

          <div>
            <h1>SurakshaAI</h1>
            <p>Smart protection for safer digital banking</p>
          </div>
        </div>

        <div className="protection-status">
          <span className="status-dot"></span>
          <div>
            <strong>Protection Active</strong>
            <small>You're protected with AI</small>
          </div>
          <ShieldIcon />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-decoration left">
            <ShieldIcon />
            <LockIcon />
          </div>

          <div className="hero-content">
            <h2>Protect Before You Pay</h2>
            <p>
              SurakshaAI analyzes transactions and suspicious messages to help
              protect you from digital financial fraud.
            </p>
          </div>

          <div className="hero-decoration right">
            <div className="people-icon">◉</div>
            <div className="people-icon second">◉</div>
          </div>
        </section>

        <section className="feature-card">
          <div className="illustration fraud-illustration">
            <div className="phone">
              <div className="phone-top"></div>
              <div className="phone-screen">
                <span>⚠</span>
                <p>Your OTP should never be shared.</p>
              </div>
            </div>
            <div className="security-badge">!</div>
          </div>

          <div className="feature-main">
            <div className="feature-title">
              <ShieldIcon />
              <h2>AI Fraud Message Scanner</h2>
            </div>

            <p className="description">
              Paste an SMS, WhatsApp message, or banking alert to check for
              possible fraud patterns.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: Send your OTP immediately or your account will be suspended."
            />

            <button
              className="primary-button"
              onClick={analyzeMessage}
              disabled={fraudLoading}
            >
              {fraudLoading ? "Analyzing..." : "⌕  Analyze Message"}
            </button>
          </div>

          <div className="tips-box">
            <h3>🛡 Tips to stay safe</h3>
            <p>
              <LockIcon /> Never share OTP, PIN, passwords or banking
              credentials.
            </p>
            <p>↗ Do not click unknown links or attachments.</p>
            <p>▣ Your bank will never ask for confidential details.</p>
            <p>♙ When in doubt, contact your bank directly.</p>
          </div>
        </section>

        {fraudResult && !fraudResult.error && (
          <section
            className={`result-card ${fraudResult.risk_level.toLowerCase()}`}
          >
            <div>
              <span className="result-label">Message Safety Assessment</span>
              <h2>{fraudResult.risk_level} Risk</h2>
            </div>

            <div className="result-score">
              {(fraudResult.fraud_probability * 100).toFixed(1)}%
              <small>fraud probability</small>
            </div>

            <div className="result-details">
              <strong>
                {fraudResult.fraud_detected
                  ? "Potential fraud detected"
                  : "No high-risk fraud detected"}
              </strong>

              <h3>Why was this flagged?</h3>

              <ul>
                {fraudResult.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>

              <div className="safety-advice">
                <strong>Safety Advice</strong>
                <p>
                  Never share OTPs, PINs, passwords, or banking credentials
                  through messages or calls.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="feature-card transaction-feature">
          <div className="illustration transaction-illustration">
            <ShieldIcon />
            <LockIcon />
            <span className="rupee">₹</span>
          </div>

          <div className="feature-main">
            <div className="feature-title">
              <ShieldIcon />
              <h2>Transaction Protection</h2>
            </div>

            <p className="description">
              Check whether a transaction looks unusual before completing it.
            </p>

            <div className="form-grid">
              <div className="field">
                <label>Transaction Amount (₹)</label>
                <input
                  type="number"
                  value={transaction.amount}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Example: 40000"
                />
              </div>

              <div className="field">
                <label>Your Usual Amount (₹)</label>
                <input
                  type="number"
                  value={transaction.usual_amount}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      usual_amount: e.target.value,
                    })
                  }
                  placeholder="Example: 2000"
                />
              </div>

              <div className="field">
                <label>Transaction Hour</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={transaction.transaction_hour}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      transaction_hour: e.target.value,
                    })
                  }
                />
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={transaction.is_new_recipient}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      is_new_recipient: e.target.checked,
                    })
                  }
                />
                New recipient
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={transaction.is_new_device}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      is_new_device: e.target.checked,
                    })
                  }
                />
                New device
              </label>
            </div>

            <button
              className="transaction-button"
              onClick={analyzeTransaction}
              disabled={transactionLoading}
            >
              {transactionLoading
                ? "Checking..."
                : "♢  Check Transaction Safety"}
            </button>
          </div>

          <div className="tips-box green">
            <h3>🛡 Safe Banking Habits</h3>
            <p>₹ Check transaction details before you pay.</p>
            <p>♙ Avoid sending money to unknown people.</p>
            <p>◷ Be extra careful with late-night transactions.</p>
            <p>▣ Use trusted devices for online banking.</p>
          </div>
        </section>

        {transactionResult && !transactionResult.error && (
          <section
            className={`result-card ${transactionResult.risk_level.toLowerCase()}`}
          >
            <div>
              <span className="result-label">
                Transaction Safety Assessment
              </span>
              <h2>{transactionResult.risk_level} Risk</h2>
            </div>

            <div className="result-score">
              {transactionResult.risk_score}
              <small>risk score</small>
            </div>

            <div className="result-details">
              <div className="action-box">
                Recommended Action: <strong>{transactionResult.action}</strong>
              </div>

              <h3>Why was this transaction flagged?</h3>

              <ul>
                {transactionResult.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>

              <div className="safety-advice">
                <strong>{transactionResult.explanation.title}</strong>
                <p>{transactionResult.explanation.message}</p>
                <p>{transactionResult.explanation.details}</p>
                <p>{transactionResult.explanation.action}</p>
              </div>
            </div>
          </section>
        )}

        <footer>
          <div>
            <strong>🛡 SurakshaAI is always watching out for you!</strong>
            <p>Our AI helps keep your money and identity safe.</p>
          </div>
          <span>🔒 Your safety is our priority</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
