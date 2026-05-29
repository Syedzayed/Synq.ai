import * as React from "react";

interface WelcomeEmailProps {
  name?: string;
}

/**
 * Transactional welcome email sent after successful registration.
 * Designed for Resend's React email renderer.
 *
 * Warm editorial design consistent with the Synq design system.
 * Uses only inline styles — email clients strip external CSS.
 */
export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi there,";

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Synq</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#fdfbf7",
          fontFamily:
            "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Outer wrapper */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={{ backgroundColor: "#fdfbf7", padding: "40px 16px" }}
        >
          <tbody>
            <tr>
              <td align="center">
                {/* Card */}
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  style={{
                    maxWidth: "520px",
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid #e8e2d8",
                    boxShadow: "0 4px 24px rgba(58,53,48,0.07)",
                    overflow: "hidden",
                  }}
                >
                  <tbody>
                    {/* Header strip */}
                    <tr>
                      <td
                        style={{
                          background:
                            "linear-gradient(135deg, #e07a5f 0%, #f4a261 100%)",
                          padding: "28px 40px",
                        }}
                      >
                        <table
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          role="presentation"
                        >
                          <tbody>
                            <tr>
                              <td>
                                {/* Logo mark */}
                                <div
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "10px",
                                      backgroundColor: "rgba(255,255,255,0.25)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "18px",
                                      fontWeight: "800",
                                      color: "#ffffff",
                                      lineHeight: "1",
                                    }}
                                  >
                                    S
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "700",
                                      color: "#ffffff",
                                      letterSpacing: "-0.02em",
                                    }}
                                  >
                                    Synq
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "40px 40px 32px" }}>
                        {/* Greeting */}
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "#e07a5f",
                          }}
                        >
                          Welcome aboard
                        </p>
                        <h1
                          style={{
                            margin: "0 0 20px",
                            fontSize: "28px",
                            fontWeight: "400",
                            color: "#1e1a17",
                            letterSpacing: "-0.02em",
                            lineHeight: "1.15",
                            fontFamily:
                              "Georgia, 'Times New Roman', Times, serif",
                          }}
                        >
                          {greeting}
                          <br />
                          You&apos;re in.
                        </h1>

                        <p
                          style={{
                            margin: "0 0 20px",
                            fontSize: "15px",
                            lineHeight: "1.7",
                            color: "#6b6560",
                          }}
                        >
                          Your Synq account is ready. We use AI to surface
                          the people who{" "}
                          <em style={{ color: "#e07a5f" }}>actually</em> align
                          with where you&apos;re headed — not just whoever
                          happens to be popular.
                        </p>

                        <p
                          style={{
                            margin: "0 0 32px",
                            fontSize: "15px",
                            lineHeight: "1.7",
                            color: "#6b6560",
                          }}
                        >
                          Complete your profile so our matching engine can
                          start working for you.
                        </p>

                        {/* CTA Button */}
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          role="presentation"
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  borderRadius: "100px",
                                  background:
                                    "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
                                  boxShadow:
                                    "0 2px 12px rgba(224,122,95,0.35)",
                                }}
                              >
                                <a
                                  href="https://synq.app/onboarding"
                                  style={{
                                    display: "inline-block",
                                    padding: "14px 32px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    textDecoration: "none",
                                    borderRadius: "100px",
                                    letterSpacing: "-0.01em",
                                  }}
                                >
                                  Complete your profile →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* What's next section */}
                    <tr>
                      <td
                        style={{
                          padding: "0 40px 32px",
                        }}
                      >
                        <table
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          role="presentation"
                          style={{
                            borderRadius: "16px",
                            backgroundColor: "#faf7f2",
                            border: "1px solid #ede8e0",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: "24px" }}>
                                <p
                                  style={{
                                    margin: "0 0 16px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "#9e9890",
                                  }}
                                >
                                  What happens next
                                </p>
                                {[
                                  {
                                    step: "01",
                                    text: "Complete your profile — your skills, goals, and what you're building.",
                                  },
                                  {
                                    step: "02",
                                    text: "Synq's AI generates a semantic fingerprint of who you are and where you're headed.",
                                  },
                                  {
                                    step: "03",
                                    text: "We surface your top matches — people who move at the same frequency.",
                                  },
                                ].map(({ step, text }) => (
                                  <table
                                    key={step}
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    role="presentation"
                                    style={{ marginBottom: "12px" }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          style={{
                                            width: "32px",
                                            verticalAlign: "top",
                                            paddingTop: "2px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "11px",
                                              fontWeight: "700",
                                              color: "#e07a5f",
                                            }}
                                          >
                                            {step}
                                          </span>
                                        </td>
                                        <td>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: "13.5px",
                                              lineHeight: "1.6",
                                              color: "#6b6560",
                                            }}
                                          >
                                            {text}
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: "20px 40px",
                          borderTop: "1px solid #ede8e0",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#b8b2aa",
                            lineHeight: "1.6",
                          }}
                        >
                          You received this because you signed up for Synq.
                          <br />
                          &copy; {new Date().getFullYear()} Synq. All rights
                          reserved.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
