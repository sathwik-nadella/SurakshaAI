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
  const [age, setAge] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [firstTransaction, setFirstTransaction] = useState(null);
  const [parentChildAccount, setParentChildAccount] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [message, setMessage] = useState("");
  const [fraudResult, setFraudResult] = useState(null);
  const [fraudLoading, setFraudLoading] = useState(false);

  const [transaction, setTransaction] = useState({
    user_id: 1,
    amount: "",
    is_new_recipient: false,
    usual_amount: "",
    transaction_time: "12:00",
    transaction_period: "PM",
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
        "https://surakshaai-t389.onrender.com/transactions/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...transaction,
            amount: Number(transaction.amount),
            usual_amount: Number(transaction.usual_amount),
            transaction_hour:
              transaction.transaction_period === "AM"
                ? Number(transaction.transaction_time.split(":")[0]) === 12
                  ? 0
                  : Number(transaction.transaction_time.split(":")[0])
                : Number(transaction.transaction_time.split(":")[0]) === 12
                  ? 12
                  : Number(transaction.transaction_time.split(":")[0]) + 12,
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

  if (showWelcome) {
    return (
      <div className="welcome-page">
        <div className="welcome-left">
          <div className="welcome-brand">
            <div className="welcome-brand-icon">
              <ShieldIcon />
            </div>

            <div>
              <h1>SurakshaAI</h1>
              <p>AI-Powered Fraud Protection</p>
            </div>
          </div>

          <div className="welcome-shield">
            <ShieldIcon />
            <LockIcon />
          </div>

          <div className="welcome-message">
            <ShieldIcon />

            <div>
              <strong>Smart Protection. Safer Transactions.</strong>
              <span>Your security, our priority.</span>
            </div>
          </div>
        </div>

        <div className="welcome-card">
          <div className="welcome-icon">
            <ShieldIcon />
          </div>

          <h2>Welcome to</h2>

          <h1>
            Suraksha<span>AI</span>
          </h1>

          <div className="welcome-divider"></div>

          <p className="welcome-description">
            Your intelligent companion for safe and secure digital transactions.
          </p>

          {accessDenied ? (
            <div className="access-denied">
              <div className="access-denied-icon">🔒</div>

              <h2>Access Restricted</h2>

              <p>
                SurakshaAI cannot be accessed by a card holder under 18 unless
                the account is a parent-child tie-up account.
              </p>

              <button
                type="button"
                className="welcome-continue"
                onClick={() => {
                  setAccessDenied(false);
                  setAge("");
                  setAgeConfirmed(false);
                  setParentChildAccount(null);
                  setFirstTransaction(null);
                }}
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="welcome-form">
              <h3>Let's get to know you</h3>

              <p>Please fill in the details to continue</p>

              <label>How old are you?</label>

              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setAgeConfirmed(false);
                  setParentChildAccount(null);
                }}
                placeholder="Enter your age"
              />

              <button
                type="button"
                className="welcome-continue"
                disabled={!age}
                onClick={() => {
                  setAgeConfirmed(true);
                }}
              >
                Confirm Age
              </button>

              {ageConfirmed && Number(age) < 18 && (
                <>
                  <div className="age-warning">
                    <strong>Account Access Restricted</strong>

                    <p>
                      Card holders under 18 can only use SurakshaAI through a
                      parent-child tie-up account.
                    </p>
                  </div>

                  <label>Is this a parent-child tie-up account?</label>

                  <div className="transaction-choice">
                    <button
                      type="button"
                      className={parentChildAccount === true ? "selected" : ""}
                      onClick={() => setParentChildAccount(true)}
                    >
                      <strong>Yes</strong>
                      <span>This is a parent-child tie-up account</span>
                    </button>

                    <button
                      type="button"
                      className={parentChildAccount === false ? "selected" : ""}
                      onClick={() => setParentChildAccount(false)}
                    >
                      <strong>No</strong>
                      <span>This is not a tie-up account</span>
                    </button>
                  </div>
                </>
              )}

              {ageConfirmed &&
                (Number(age) >= 18 || parentChildAccount === true) && (
                  <>
                    <label>Is this your first transaction?</label>

                    <div className="transaction-choice">
                      <button
                        type="button"
                        className={firstTransaction === true ? "selected" : ""}
                        onClick={() => setFirstTransaction(true)}
                      >
                        <strong>Yes</strong>
                        <span>This is my first transaction</span>
                      </button>

                      <button
                        type="button"
                        className={firstTransaction === false ? "selected" : ""}
                        onClick={() => setFirstTransaction(false)}
                      >
                        <strong>No</strong>
                        <span>I have made transactions before</span>
                      </button>
                    </div>
                  </>
                )}

              {ageConfirmed &&
                Number(age) < 18 &&
                parentChildAccount === false && (
                  <button
                    type="button"
                    className="welcome-continue"
                    onClick={() => setAccessDenied(true)}
                  >
                    Continue →
                  </button>
                )}

              {ageConfirmed &&
                (Number(age) >= 18 || parentChildAccount === true) && (
                  <button
                    type="button"
                    className="welcome-continue"
                    disabled={firstTransaction === null}
                    onClick={() => {
                      setShowWelcome(false);
                      setActivePage("home");
                    }}
                  >
                    Continue →
                  </button>
                )}

              <small className="privacy-note">
                🔒 We respect your privacy and keep you safe.
              </small>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ShieldIcon />

          <span>
            Suraksha<span>AI</span>
          </span>
        </div>

        <button
          className={`sidebar-item ${activePage === "home" ? "active" : ""}`}
          onClick={() => setActivePage("home")}
        >
          🏠 Home
        </button>

        <button
          className={`sidebar-item ${
            activePage === "transaction" ? "active" : ""
          }`}
          onClick={() => setActivePage("transaction")}
        >
          🛡 Transaction Protection
        </button>

        <button
          className={`sidebar-item ${activePage === "fraud" ? "active" : ""}`}
          onClick={() => setActivePage("fraud")}
        >
          🔍 Fraud Detection
        </button>

        <button
          className={`sidebar-item ${activePage === "safety" ? "active" : ""}`}
          onClick={() => setActivePage("safety")}
        >
          💡 Safety Tips
        </button>

        <div className="sidebar-help">
          <ShieldIcon />
          <strong>We're here to protect you.</strong>
          <span>Stay alert. Stay safe.</span>
        </div>
      </aside>

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
        {activePage === "home" && (
          <section className="home-content">
            <div className="home-welcome">
              <div>
                <h2>Hello! 👋</h2>
                <p>SurakshaAI is always watching out for you.</p>
                <span>Choose an option below to get started.</span>
              </div>

              <div className="home-shield">
                <ShieldIcon />
              </div>
            </div>

            <div className="home-cards">
              <div className="home-card">
                <div className="home-card-icon transaction-icon">₹</div>

                <h2>Transaction Protection</h2>

                <p>
                  Check if a transaction looks unusual before you complete it.
                </p>

                <button
                  className="home-button blue"
                  onClick={() => setActivePage("transaction")}
                >
                  Check Now →
                </button>
              </div>

              <div className="home-card">
                <div className="home-card-icon fraud-icon">🔍</div>

                <h2>Fraud Detection</h2>

                <p>Analyze messages, emails or links for potential fraud.</p>

                <button
                  className="home-button green"
                  onClick={() => setActivePage("fraud")}
                >
                  Scan Now →
                </button>
              </div>
            </div>

            <section className="home-security-banner">
              <ShieldIcon />

              <div>
                <strong>
                  SurakshaAI uses advanced AI to detect suspicious activity
                </strong>

                <p>and help you stay protected every step of the way.</p>
              </div>
            </section>
          </section>
        )}

        {activePage === "safety" && (
          <section className="safety-page">
            <div className="safety-header">
              <h2>Safety Tips</h2>

              <p>
                Simple habits that can help you stay safe while using digital
                banking.
              </p>
            </div>

            <div className="safety-grid">
              <div className="safety-card">
                <div className="safety-card-icon">🔐</div>
                <h3>Never Share OTPs</h3>
                <p>
                  Never share your OTP, PIN, password, or banking credentials
                  with anyone, even if they claim to be from your bank.
                </p>
              </div>

              <div className="safety-card">
                <div className="safety-card-icon">👤</div>
                <h3>Check the Recipient</h3>
                <p>
                  Before sending money, carefully verify the recipient's name
                  and payment details.
                </p>
              </div>

              <div className="safety-card">
                <div className="safety-card-icon">⚠️</div>
                <h3>Don't Trust Urgent Messages</h3>
                <p>
                  Be careful when a message pressures you to act immediately or
                  threatens that your account will be blocked.
                </p>
              </div>

              <div className="safety-card">
                <div className="safety-card-icon">🔗</div>
                <h3>Avoid Suspicious Links</h3>
                <p>
                  Don't open unknown links asking you to verify your bank
                  account. Open your bank's official app or website directly
                  instead.
                </p>
              </div>

              <div className="safety-card">
                <div className="safety-card-icon">₹</div>
                <h3>Check Before You Pay</h3>
                <p>
                  Always review the amount and recipient before confirming a
                  digital payment.
                </p>
              </div>

              <div className="safety-card">
                <div className="safety-card-icon">🛡</div>
                <h3>Use Trusted Devices</h3>
                <p>
                  Prefer your own trusted phone or computer when accessing
                  banking services or making financial transactions.
                </p>
              </div>
            </div>
          </section>
        )}

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

        {activePage === "fraud" && (
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
        )}

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

        {activePage === "transaction" && (
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
                  <label>Transaction Time</label>

                  <div className="time-inputs">
                    <select
                      value={transaction.transaction_time}
                      onChange={(e) =>
                        setTransaction({
                          ...transaction,
                          transaction_time: e.target.value,
                        })
                      }
                    >
                      {[
                        "12:00",
                        "12:15",
                        "12:30",
                        "12:45",
                        "1:00",
                        "1:15",
                        "1:30",
                        "1:45",
                        "2:00",
                        "2:15",
                        "2:30",
                        "2:45",
                        "3:00",
                        "3:15",
                        "3:30",
                        "3:45",
                        "4:00",
                        "4:15",
                        "4:30",
                        "4:45",
                        "5:00",
                        "5:15",
                        "5:30",
                        "5:45",
                        "6:00",
                        "6:15",
                        "6:30",
                        "6:45",
                        "7:00",
                        "7:15",
                        "7:30",
                        "7:45",
                        "8:00",
                        "8:15",
                        "8:30",
                        "8:45",
                        "9:00",
                        "9:15",
                        "9:30",
                        "9:45",
                        "10:00",
                        "10:15",
                        "10:30",
                        "10:45",
                        "11:00",
                        "11:15",
                        "11:30",
                        "11:45",
                      ].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>

                    <select
                      value={transaction.transaction_period}
                      onChange={(e) =>
                        setTransaction({
                          ...transaction,
                          transaction_period: e.target.value,
                        })
                      }
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
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
        )}

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
