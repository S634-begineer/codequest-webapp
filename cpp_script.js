 const questions = [
      { title: "Question-1", text: "Create a class `Book` with attributes title, author, and price. Write a program to input and display the details of a book." },
      { title: "Question-2", text: "Write a program to demonstrate constructor overloading using a `Rectangle` class." },
      { title: "Question-3", text: "Create a class `Counter` with a static variable to count the number of objects created. Display the count after creating multiple objects." },
      { title: "Question-4", text: "Create a class `Complex` with real and imaginary parts. Overload the `+` operator to add two complex numbers." },
      { title: "Question-5", text: "Write a program using STL `vector` to store N integers, delete the last element, and display the remaining." },
      { title: "Question-6", text: "Create a class `Employee` with attributes name and salary. Use a friend function to display employee details." },
      { title: "Question-7", text: "Write a program to demonstrate single inheritance: Create a class `Person` and derive a class `Student`." },
      { title: "Question-8", text: "Create a class with a pure virtual function and demonstrate runtime polymorphism using a base class pointer." },
      { title: "Question-9", text: "Write a program to reverse a string using a `stack` from STL." },
      { title: "Question-10", text: "Create a text file `student.txt` and write student names and marks. Then read and display the content." },
      { title: "Question-11", text: "Write a program to find the frequency of characters in a string using `map`." },
      { title: "Question-12", text: "Use a `queue` to simulate a ticket booking system where users join and leave the queue." },
      { title: "Question-13", text: "Create a `Shape` class and derive `Circle` and `Rectangle` from it. Use virtual functions to calculate area." },
      { title: "Question-14", text: "Demonstrate how to use exception handling with `try`, `catch`, and `throw` to handle division by zero." },
      { title: "Question-15", text: "Write a program to input N integers into a `set` and print them in sorted (ascending) order." }
  ];

  // Starter code snippets per language id (Judge0 IDs)
  const starterCode = {
      50: `#include <stdio.h>\n\nint main() {\n    // your C code here\n    return 0;\n}`,
      54: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your C++ code here\n    return 0;\n}`,
      62: `public class Main {\n    public static void main(String[] args) {\n        // your Java code here\n    }\n}`,
      71: `# your Python code here\nprint("Hello, Python!")`,
      78: `// your Kotlin code here\nfun main() {\n    println("Hello, Kotlin!")\n}`,
      63: `// your JavaScript (Node.js) code here\nconsole.log("Hello, JavaScript!");`,
      82: `-- your SQL code here\nSELECT 'Hello, SQL!';`,
      68: `<?php\n// your PHP code here\necho "Hello, PHP!";\n?>`
  };

  let currentQuestionIndex = 0;

  // DOM Elements
  const questionTitle = document.getElementById("question-title");
  const questionText = document.getElementById("question-text");
  const languageSelector = document.getElementById("languageSelector");
  const outputBox = document.getElementById("outputBox");
  const compileBtn = document.getElementById("compileBtn");
  const runBtn = document.getElementById("runBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Initialize CodeMirror editor
  const editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
      lineNumbers: true,
      mode: "text/x-c++src",
      theme: "monokai",
      tabSize: 4,
      indentUnit: 4,
      matchBrackets: true,
  });

  // Update question and editor with starter code
  function updateQuestion() {
      const q = questions[currentQuestionIndex];
      if (q) {
          questionTitle.textContent = `${q.title}.`;
          questionText.textContent = q.text;
          setStarterCode(getSelectedLanguageId());
          outputBox.textContent = "// Output will appear here";
          nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
      } else {
          questionTitle.textContent = "No More Questions";
          questionText.textContent = "Please add more questions to the list.";
          editor.setValue("");
          outputBox.textContent = "";
          nextBtn.style.display = "none";
      }
  }

  // Get selected language id from selector
  function getSelectedLanguageId() {
      return parseInt(languageSelector.value);
  }

  // Set starter code to editor based on language
  function setStarterCode(languageId) {
      editor.setValue(starterCode[languageId] || "");
  }

  // Change editor mode on language change
  languageSelector.addEventListener("change", function () {
      const mode = this.selectedOptions[0].getAttribute("data-mode");
      editor.setOption("mode", mode);
      setStarterCode(getSelectedLanguageId());
  });

  // Disable or enable buttons and selector
  function setButtonsDisabled(disabled) {
      compileBtn.disabled = disabled;
      runBtn.disabled = disabled;
      nextBtn.disabled = disabled;
      languageSelector.disabled = disabled;
  }

  // RAPIDAPI config for Judge0
  const RAPIDAPI_KEY = "7eb1ea432fmsh408e1d97c429e8ap10f9c2jsn3491fdd5d1ad";
  const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";
  const RAPIDAPI_URL = "https://judge0-ce.p.rapidapi.com";

  let submissionToken = null;  // To store token after compile/run request

  // Compile button handler (actually sends code to Judge0 for execution)
  compileBtn.addEventListener("click", async () => {
      const code = editor.getValue();
      const languageId = getSelectedLanguageId();

      if (!code.trim()) {
          alert("Please write some code to compile.");
          return;
      }

      setButtonsDisabled(true);
      outputBox.textContent = "Submitting code... Please wait.";

      try {
          // Submit code to Judge0
          const response = await fetch(RAPIDAPI_URL + "/submissions?base64_encoded=false&wait=false", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "X-RapidAPI-Key": RAPIDAPI_KEY,
                  "X-RapidAPI-Host": RAPIDAPI_HOST,
              },
              body: JSON.stringify({
                  source_code: code,
                  language_id: languageId,
                  stdin: ""
              }),
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || "Error submitting code.");
          }

          submissionToken = data.token;
          outputBox.textContent = `Code submitted. Submission token: ${submissionToken}\nClick "Run" to get the output.`;

      } catch (err) {
          outputBox.textContent = "Error: " + err.message;
      } finally {
          setButtonsDisabled(false);
      }
  });

  // Run button handler: polls Judge0 for result and shows output
  runBtn.addEventListener("click", async () => {
      if (!submissionToken) {
          alert("Please compile (submit) code first.");
          return;
      }

      setButtonsDisabled(true);
      outputBox.textContent = "Fetching output... Please wait.";

      try {
          // Polling loop for submission result
          let result = null;
          while (true) {
              const response = await fetch(RAPIDAPI_URL + `/submissions/${submissionToken}?base64_encoded=false&fields=status,stdout,stderr,compile_output`, {
                  method: "GET",
                  headers: {
                      "X-RapidAPI-Key": RAPIDAPI_KEY,
                      "X-RapidAPI-Host": RAPIDAPI_HOST,
                  }
              });

              const data = await response.json();
              if (!response.ok) {
                  throw new Error(data.message || "Error fetching output.");
              }

              // status.id 1 = In Queue, 2 = Processing, 3+ = Done
              if (data.status.id <= 2) {
                  // still processing, wait and poll again
                  await new Promise(r => setTimeout(r, 1000));
                  continue;
              }

              result = data;
              break;
          }

          // Show output or errors
          if (result.stdout) {
              outputBox.textContent = result.stdout;
          } else if (result.stderr) {
              outputBox.textContent = "Runtime Error:\n" + result.stderr;
          } else if (result.compile_output) {
              outputBox.textContent = "Compilation Error:\n" + result.compile_output;
          } else {
              outputBox.textContent = "No output received.";
          }

      } catch (err) {
          outputBox.textContent = "Error: " + err.message;
      } finally {
          setButtonsDisabled(false);
      }
  });

  // Score tracking
  let score = 0;

  // Next button handler
  nextBtn.addEventListener("click", () => {
      // On last question, submit score and redirect
      if (currentQuestionIndex === questions.length - 1) {
          // For demo, we increment score for each next click (replace with actual scoring logic)
          score++;
          alert(`Your total score is: ${score} out of ${questions.length}`);
          window.location.href = "thankyou.html";  // Redirect to your chosen page
          return;
      }

      // Move to next question
      currentQuestionIndex++;
      updateQuestion();
  });

  // Initialize
  updateQuestion();