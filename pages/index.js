import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState([""]);
  const [jobDescription, setJobDescription] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddField = () => {
    setInputText([...inputText, ""]);
  };

  const handleJobDescriptionChange = (value) => {
    setJobDescription(value);
  }

  const handleInputChange = (index, value) => {
    const newInputText = [...inputText];
    newInputText[index] = value;
    setInputText(newInputText);
    console.log(inputText);
  };

  const handleDeleteField = (index) => {
    const newInputText = [...inputText];
    newInputText.splice(index, 1);
    setInputText(newInputText);
  };

  const handleSubmit = async () => {
    if (inputText.some((text) => !text.trim()) || !jobDescription.trim()) {
      setErrorMessage("Fill in all text fields");
      return;
    }

    try {
      const response = await fetch("/api/cohereAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompts: inputText , jobDescription: jobDescription}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const formattedTextArray = data.map((gen) => {
          const formattedText = gen?.generations?.[0]?.text || "";
          const bulletPoints = formattedText
            .split("&")
            .filter((point) => point.trim() !== "");
      
          return bulletPoints
            .map((point) => point.trim())
            .filter(Boolean) 
            .join("\n");
        });

        setGeneratedText(formattedTextArray);
        setErrorMessage("");
        console.log(data);
      } else {
        setGeneratedText([]);
        setErrorMessage("No generated text recieved");
      }
    } catch (error) {
      console.error(error);
      setGeneratedText("");
      setErrorMessage("Error fetching generated text");
    }
  };
  return (
    <div>
      <h1>Generate Text</h1>
      {/* Existing code for project description */}
      {inputText.map((value, index) => (
        <div key={index}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={`Enter text for prompt ${index + 1}`}
          />
          <button onClick={() => handleDeleteField(index)}>Delete</button>
        </div>
      ))}
      <button onClick={handleAddField}>Add Text Field</button>

      {/* New field for job description */}
      <div>
        <input
          type="text"
          value={jobDescription}
          onChange={(e) => handleJobDescriptionChange(e.target.value)}
          placeholder="Enter job description"
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
      
      {/* Display generated text */}
      {generatedText.length > 0 && (
        <div>
          <h2>Generated Text</h2>
          {generatedText.map((text, index) => (
            <pre key={index}>{text}</pre>
          ))}
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
