import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState([""]);
  const [generatedText, setGeneratedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddField = () => {
    setInputText([...inputText, ""]);
  }

  const handleInputChange = (index, value) => {
    const newInputText = [...inputText];
    newInputText[index] = value;
    setInputText(newInputText);
    console.log(inputText);
  }

  const handleDeleteField = (index) => {
    const newInputText = [...inputText];
    newInputText.splice(index, 1);
    setInputText(newInputText);
  }

  const handleSubmit = async () => {
    if(inputText.some((text)=>!text.trim())) {
      setErrorMessage("Fill in all text fields");
      return;
    }

    try {
      const response = await fetch("/api/cohereAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({prompts: inputText}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      if (data?.generations?.length > 0 && data?.generations[0]?.text) {
        const formattedText = data?.generations?.[0]?.text || '';
        const bulletPoints = formattedText.split("&").filter(point => point.trim() !== '');
        const bulletFormat = bulletPoints.map(point => `- ${point.trim()}`).join('\n');

        setGeneratedText(bulletFormat);
        setErrorMessage("");
        console.log(data);
      } else {
        setGeneratedText("");
        setErrorMessage("No generated text received");
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
      <button onClick={handleSubmit}>Submit</button>
      {generatedText && (
        <div>
          <h2>Generated Text</h2>
          <p>{generatedText}</p>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
