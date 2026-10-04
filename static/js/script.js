const form = document.getElementById("decisionForm");

const results = document.getElementById("results");
const report = document.getElementById("report");
const button = document.getElementById("analyzeBtn");


form.addEventListener("submit", async (event) => {

  event.preventDefault();


  // Get user input
  const decision =
    document.getElementById("decision").value.trim();

  const reasons =
    document.getElementById("reasons").value.trim();

  const concerns =
    document.getElementById("concerns").value.trim();

  const priority =
    document.getElementById("priority").value;


  // Basic validation
  if (decision.length < 10 || !reasons) {

    alert(
      "Please describe your decision and your reasons."
    );

    return;
  }


  // Loading state
  button.disabled = true;

  button.textContent = "Analyzing with AI...";

  report.replaceChildren();

  results.classList.remove("hidden");


  // Loading message
  const loadingMessage =
    document.createElement("p");

  loadingMessage.textContent =
    "AI is examining your reasoning...";

  report.appendChild(loadingMessage);


  try {

    // Send data to Flask backend
    const response = await fetch("/api/analyze", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        decision: decision,

        reasons: reasons,

        concerns: concerns,

        priority: priority

      })

    });


    // Read backend response
    const data = await response.json();


    // Check for backend error
    if (!response.ok) {

      throw new Error(
        data.error || "AI analysis failed."
      );

    }


    // Remove loading message
    report.replaceChildren();


    // Create result
    const message =
      document.createElement("p");

    message.textContent = data.analysis;

    message.style.whiteSpace = "pre-wrap";

    report.appendChild(message);


    // Scroll to result
    results.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });


  } catch (error) {

    // Show error
    report.replaceChildren();

    const errorMessage =
      document.createElement("p");

    errorMessage.textContent =
      "⚠️ " + error.message;

    report.appendChild(errorMessage);

  } finally {

    // Restore button
    button.disabled = false;

    button.textContent =
      "Analyze my blind spots ↗";

  }

});