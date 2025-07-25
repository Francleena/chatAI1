import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./Login.module.css";
import { app } from "./firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        // Signup flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user.email);
      } else {
        // Login flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user.email);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <div className={styles.logo}>💬</div>
        <h3 className={styles.title}>
          {isSignup ? "Sign Up for AI Chat" : "Login to AI Chat"}
        </h3>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            required
          />
          <input
            className={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            type="password"
            required
          />
          <button className={styles.button} type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className={styles.toggle}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className={styles.link}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
