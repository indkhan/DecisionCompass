"use client";
import React from "react";

function MainComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStep, setCurrentStep] = useState("home");
  const [decisionInput, setDecisionInput] = useState({
    title: "",
    description: "",
    options: [{ title: "", pros: "", cons: "" }],
  });
  const [personalityType, setPersonalityType] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [decisions, setDecisions] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showSignIn, setShowSignIn] = useState(true);

  const addOption = () => {
    setDecisionInput((prev) => ({
      ...prev,
      options: [...prev.options, { title: "", pros: "", cons: "" }],
    }));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setIsLoggedIn(true);
      setCurrentStep("quiz");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setIsLoggedIn(true);
      setCurrentStep("quiz");
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!quizAnswers.decisionStyle || !quizAnswers.riskTolerance) {
      setError("Please answer all questions");
      return;
    }
    setCurrentStep("dashboard");
  };

  const analyzeDecision = async () => {
    if (
      !decisionInput.title ||
      !decisionInput.description ||
      decisionInput.options.some((opt) => !opt.title)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const prompt = `Analyze this decision:
      Title: ${decisionInput.title}
      Description: ${decisionInput.description}
      Options: ${decisionInput.options
        .map(
          (opt) => `
        Option: ${opt.title}
        Pros: ${opt.pros || "None provided"}
        Cons: ${opt.cons || "None provided"}
      `
        )
        .join("\n")}
      
      User Profile:
      Decision Style: ${quizAnswers.decisionStyle}
      Risk Tolerance: ${quizAnswers.riskTolerance}
      
      Please provide:
      1. A summary of the decision
      2. A list of recommendations based on the user's decision style and risk tolerance`;

      const response = await CHAT_GPT.complete(prompt);
      const [summary, ...recommendations] = response
        .split("\n")
        .filter((line) => line.trim());

      setAnalysisResult({
        summary,
        recommendations,
      });

      setDecisions((prev) => [
        ...prev,
        {
          title: decisionInput.title,
          date: new Date().toLocaleDateString(),
          analysis: { summary, recommendations },
        },
      ]);

      setCurrentStep("analysis");
    } catch (error) {
      setError("Analysis failed. Please try again.");
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] dark:from-[#212529] dark:to-[#343a40]">
      {!isLoggedIn && !showSignIn && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-[#495057] rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center font-montserrat text-[#212529] dark:text-white">
                Create Account
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                />
                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full bg-[#228be6] hover:bg-[#1c7ed6] text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
              <p className="mt-4 text-center text-[#495057] dark:text-[#dee2e6]">
                Already have an account?{" "}
                <button
                  onClick={() => setShowSignIn(true)}
                  className="text-[#228be6] hover:text-[#1c7ed6] font-bold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      {!isLoggedIn && showSignIn && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-[#495057] rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center font-montserrat text-[#212529] dark:text-white">
                Welcome Back
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                />
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-[#228be6] hover:bg-[#1c7ed6] text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
              <p className="mt-4 text-center text-[#495057] dark:text-[#dee2e6]">
                Don't have an account?{" "}
                <button
                  onClick={() => setShowSignIn(false)}
                  className="text-[#228be6] hover:text-[#1c7ed6] font-bold"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      {isLoggedIn && currentStep === "quiz" && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#495057] rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 font-montserrat text-[#212529] dark:text-white">
              Personality Quiz
            </h2>
            <div className="space-y-6">
              <div className="mb-4">
                <p className="text-lg mb-2 dark:text-white">
                  How do you typically make decisions?
                </p>
                <select
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  onChange={(e) =>
                    setQuizAnswers((prev) => ({
                      ...prev,
                      decisionStyle: e.target.value,
                    }))
                  }
                  name="decision-style"
                >
                  <option value="">Select an option</option>
                  <option value="analytical">
                    I analyze all details carefully
                  </option>
                  <option value="intuitive">I trust my gut feeling</option>
                  <option value="collaborative">I seek others' opinions</option>
                </select>
              </div>
              <div className="mb-4">
                <p className="text-lg mb-2 dark:text-white">
                  What's your risk tolerance?
                </p>
                <select
                  className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                  onChange={(e) =>
                    setQuizAnswers((prev) => ({
                      ...prev,
                      riskTolerance: e.target.value,
                    }))
                  }
                  name="risk-tolerance"
                >
                  <option value="">Select an option</option>
                  <option value="conservative">I prefer safe choices</option>
                  <option value="moderate">I can handle some risk</option>
                  <option value="adventurous">
                    I'm comfortable with high risk
                  </option>
                </select>
              </div>
              <button
                onClick={submitQuiz}
                className="w-full bg-[#228be6] hover:bg-[#1c7ed6] text-white font-bold py-3 rounded-lg transition-all duration-300"
              >
                Complete Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoggedIn && currentStep === "dashboard" && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold font-montserrat text-[#212529] dark:text-white">
                Your Dashboard
              </h2>
              <button
                onClick={() => setCurrentStep("decision")}
                className="bg-[#228be6] hover:bg-[#1c7ed6] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
              >
                New Decision
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#495057] p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 font-montserrat text-[#212529] dark:text-white">
                  Your Personality Profile
                </h3>
                <div className="space-y-4">
                  <p className="text-[#495057] dark:text-[#dee2e6]">
                    Decision Style: {quizAnswers.decisionStyle}
                  </p>
                  <p className="text-[#495057] dark:text-[#dee2e6]">
                    Risk Tolerance: {quizAnswers.riskTolerance}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#495057] p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 font-montserrat text-[#212529] dark:text-white">
                  Recent Decisions
                </h3>
                <div className="space-y-4">
                  {decisions.map((decision, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-bold dark:text-white">
                        {decision.title}
                      </h4>
                      <p className="text-sm text-[#6c757d] dark:text-[#adb5bd]">
                        {decision.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoggedIn && currentStep === "decision" && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#495057] rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 font-montserrat text-[#212529] dark:text-white">
              Make a Decision
            </h2>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Decision Title"
                className="w-full p-3 border rounded-lg mb-4 dark:bg-[#343a40] dark:text-white"
                value={decisionInput.title}
                onChange={(e) =>
                  setDecisionInput({ ...decisionInput, title: e.target.value })
                }
                name="title"
              />
              <textarea
                placeholder="Describe your situation..."
                className="w-full p-3 border rounded-lg h-32 dark:bg-[#343a40] dark:text-white"
                value={decisionInput.description}
                onChange={(e) =>
                  setDecisionInput({
                    ...decisionInput,
                    description: e.target.value,
                  })
                }
                name="description"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 font-montserrat text-[#212529] dark:text-white">
                Options
              </h3>
              {decisionInput.options.map((option, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <input
                    type="text"
                    placeholder="Option Title"
                    className="w-full p-3 border rounded-lg mb-2 dark:bg-[#343a40] dark:text-white"
                    value={option.title}
                    onChange={(e) => {
                      const newOptions = [...decisionInput.options];
                      newOptions[index].title = e.target.value;
                      setDecisionInput({
                        ...decisionInput,
                        options: newOptions,
                      });
                    }}
                    name={`option-${index}-title`}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <textarea
                      placeholder="Pros"
                      className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                      value={option.pros}
                      onChange={(e) => {
                        const newOptions = [...decisionInput.options];
                        newOptions[index].pros = e.target.value;
                        setDecisionInput({
                          ...decisionInput,
                          options: newOptions,
                        });
                      }}
                      name={`option-${index}-pros`}
                    />
                    <textarea
                      placeholder="Cons"
                      className="w-full p-3 border rounded-lg dark:bg-[#343a40] dark:text-white"
                      value={option.cons}
                      onChange={(e) => {
                        const newOptions = [...decisionInput.options];
                        newOptions[index].cons = e.target.value;
                        setDecisionInput({
                          ...decisionInput,
                          options: newOptions,
                        });
                      }}
                      name={`option-${index}-cons`}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addOption}
                className="text-[#228be6] hover:text-[#1c7ed6] font-bold py-2 px-4 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i> Add Another Option
              </button>
            </div>

            <button
              onClick={analyzeDecision}
              disabled={loading}
              className="w-full bg-[#228be6] hover:bg-[#1c7ed6] text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Get AI Analysis"}
            </button>
          </div>
        </div>
      )}
      {isLoggedIn && currentStep === "analysis" && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#495057] rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 font-montserrat text-[#212529] dark:text-white">
              AI Analysis Results
            </h2>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-xl font-bold mb-4 font-montserrat text-[#212529] dark:text-white">
                  Decision Summary
                </h3>
                <p className="text-[#495057] dark:text-[#dee2e6]">
                  {analysisResult
                    ? analysisResult.summary
                    : "Analysis in progress..."}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-xl font-bold mb-4 font-montserrat text-[#212529] dark:text-white">
                  Recommendations
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-[#495057] dark:text-[#dee2e6]">
                  {analysisResult?.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setCurrentStep("dashboard")}
                className="w-full bg-[#228be6] hover:bg-[#1c7ed6] text-white font-bold py-3 rounded-lg transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;