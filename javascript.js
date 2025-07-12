console.log("script loaded");
const questions = [
    {
        title: "Question-1",
        text: "Write a program to print 'Hello, JavaScript World!' in the console."
    },
    {
        title: "Question-2",
        text: "Write a program that takes name and age as input and displays: 'Name: Alex, Age: 25'."
    },
    {
        title: "Question-3",
        text: "Create a function that checks if a number is even or odd."
    },
    {
        title: "Question-4",
        text: "Write a function to calculate the factorial of a given number."
    },
    {
        title: "Question-5",
        text: "Create an array of 5 numbers and find the largest number."
    },
    {
        title: "Question-6",
        text: "Write a function that checks if a string is a palindrome."
    },
    {
        title: "Question-7",
        text: "Write a program to reverse a given string."
    },
    {
        title: "Question-8",
        text: "Use a loop to print numbers from 1 to 20, but skip multiples of 3."
    },
    {
        title: "Question-9",
        text: "Write a function that counts the number of vowels in a string."
    },
    {
        title: "Question-10",
        text: "Create a simple calculator function that can add, subtract, multiply, or divide two numbers based on the operator given."
    },
    {
        title: "Question-11",
        text: "Create an object `person` with name, age, and city. Print the values."
    },
    {
        title: "Question-12",
        text: "Write a function that takes an array and returns a new array with only even numbers."
    },
    {
        title: "Question-13",
        text: "Demonstrate the use of `map()` to square every element in an array."
    },
    {
        title: "Question-14",
        text: "Write a program that uses `setTimeout` to print 'Hello after 2 seconds'."
    },
    {
        title: "Question-15",
        text: "Create a function that accepts a callback and executes it after a message is printed."
    }
];
// IMPORTANT: Add more starter code as needed for new languages
// You'll need to look up the Judge0 language IDs for these.
// I've used common ones, but verify on RapidAPI.
const starterCode = {
    50: "#include <stdio.h>\n\nint main() {\n    // your C code here\n    return 0;\n}",
    54: "#include <iostream>\n\nint main() {\n    // your C++ code here\n    return 0;\n}",
    62: "public class Main {\n    public static void main(String[] args) {\n        // your Java code here\n    }\n}",
    71: "# your Python code here\nprint(\"Hello, Python!\")",
    78: "// your Kotlin code here\nfun main() {\n    println(\"Hello, Kotlin!\")\n}",
    63: "// your JavaScript (Node.js) code here\nconsole.log(\"Hello, JavaScript!\");",
    82: "-- your SQL code here\nSELECT 'Hello, SQL!';",
    68: "<?php\n// your PHP code here\necho \"Hello, PHP!\";\n?>"
};

let currentQuestionIndex = 0;

const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const languageSelector = document.getElementById("languageSelector");
const codeEditorTextArea = document.getElementById("codeEditor");
const compileBtn = document.getElementById("compileBtn");
const runBtn = document.getElementById("runBtn");
const nextBtn = document.getElementById("nextBtn");
const outputBox = document.getElementById("outputBox");

const editor = CodeMirror.fromTextArea(codeEditorTextArea, {
    lineNumbers: true,
    mode: "text/x-csrc",
    theme: "monokai",
    tabSize: 4,
    indentUnit: 4,
    matchBrackets: true,
});

function getSelectedLanguageId() {
    return parseInt(languageSelector.value);
}

function setStarterCode(languageId) {
    editor.setValue(starterCode[languageId] || "");
}

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

function setButtonsDisabled(disabled) {
    compileBtn.disabled = disabled;
    runBtn.disabled = disabled;
    nextBtn.disabled = disabled;
    languageSelector.disabled = disabled;
}

languageSelector.addEventListener("change", function () {
    const mode = this.selectedOptions[0].getAttribute("data-mode");
    editor.setOption("mode", mode);
    setStarterCode(getSelectedLanguageId());
});

// === RAPIDAPI CONFIG ===
const RAPIDAPI_KEY = "7eb1ea432fmsh408e1d97c429e8ap10f9c2jsn3491fdd5d1ad";
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";

// === COMPILE BUTTON ===
compileBtn.addEventListener("click", async function () {
    const code = editor.getValue();
    const langId = getSelectedLanguageId();

    if (!code.trim()) {
        outputBox.textContent = "Please write some code before compiling.";
        return;
    }

    outputBox.textContent = "Compiling...";
    setButtonsDisabled(true);

    try {
        const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": RAPIDAPI_HOST
            },
            body: JSON.stringify({ source_code: code, language_id: langId })
        });

        if (!res.ok) {
            const errorText = await res.text();
            if (res.status === 401) {
                throw new Error("Authentication Failed (401). Check your RapidAPI Key.");
            } else {
                throw new Error(`HTTP error! Status: ${res.status}. ${res.statusText}`);
            }
        }

        const result = await res.json();

        if (result.compile_output) {
            outputBox.textContent = `Compilation Error:\n${result.compile_output}`;
        } else if (result.stderr) {
            outputBox.textContent = `Error:\n${result.stderr}`;
        } else if (result.stdout) {
            outputBox.textContent = `Output:\n${result.stdout}`;
        } else if (result.status?.description) {
            outputBox.textContent = `Status: ${result.status.description}`;
        } else {
            outputBox.textContent = "Compilation successful. No output.";
        }

    } catch (e) {
        outputBox.textContent = `Error: ${e.message}`;
    } finally {
        setButtonsDisabled(false);
    }
});

// === RUN BUTTON ===
runBtn.addEventListener("click", async function () {
    const code = editor.getValue();
    const langId = getSelectedLanguageId();

    if (!code.trim()) {
        outputBox.textContent = "Please write some code before running.";
        return;
    }

    outputBox.textContent = "Running...";
    setButtonsDisabled(true);

    try {
        const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": RAPIDAPI_HOST
            },
            body: JSON.stringify({ source_code: code, language_id: langId })
        });

        if (!res.ok) {
            const errorText = await res.text();
            if (res.status === 401) {
                throw new Error("Authentication Failed (401). Check your RapidAPI Key.");
            } else {
                throw new Error(`HTTP error! Status: ${res.status}. ${res.statusText}`);
            }
        }

        const result = await res.json();

        outputBox.textContent = "";
        if (result.status?.description) {
            outputBox.textContent += `Status: ${result.status.description}\n`;
        }
        if (result.stdout) {
            outputBox.textContent += `Output:\n${result.stdout}`;
        } else if (result.stderr) {
            outputBox.textContent += `Error:\n${result.stderr}`;
        } else if (result.compile_output) {
            outputBox.textContent += `Compilation Output:\n${result.compile_output}`;
        } else {
            outputBox.textContent += "No output returned.";
        }

    } catch (e) {
        outputBox.textContent = `Error: ${e.message}`;
    } finally {
        setButtonsDisabled(false);
    }
});

// === SUBMISSION LOGIC ===
let userScore = 0;

async function handleSubmit() {
    setButtonsDisabled(true);
    userScore = 100;

    showScorePopup(userScore);

    try {
        const response = await fetch("http://localhost:3000/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: "CodeQuestPlayer",
                score: userScore,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            console.error("Failed to save score:", await response.text());
        } else {
            console.log("Score saved!");
        }

    } catch (error) {
        console.error("Backend error:", error);
    } finally {
        setTimeout(() => {
            window.location.href = "/CodeQuest/Frontend/html/homepage.html";
        }, 3000);
    }
}

function showScorePopup(score) {
    const popup = document.createElement("div");
    popup.id = "scorePopup";
    popup.style.cssText = `
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: #282c34;
        color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        text-align: center;
        border: 2px solid #61dafb;
    `;
    popup.innerHTML = `
        <h3>Challenge Complete!</h3>
        <p>Your Score: <strong>${score}</strong></p>
        <p>Redirecting to homepage...</p>
    `;
    document.body.appendChild(popup);
}

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex === questions.length - 1) {
        handleSubmit();
    } else {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        updateQuestion();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    updateQuestion();
});
