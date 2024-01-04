import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState([""]);
  const [jobDescription, setJobDescription] = useState("");
  const [experienceText, setExperienceText] = useState([""]);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedExperience, setGeneratedExperience] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddField = () => {
    setInputText([...inputText, ""]);
  };

  const handleAddExperience = () => {
    setExperienceText([...experienceText, ""]);
  };

  const handleJobDescriptionChange = (value) => {
    setJobDescription(value);
  };

  const handleExperienceChange = (index, value) => {
    const newExperienceText = [...experienceText];
    newExperienceText[index] = value;
    setExperienceText(newExperienceText);
    console.log(experienceText);
  };

  const handleInputChange = (index, value) => {
    const newInputText = [...inputText];
    newInputText[index] = value;
    setInputText(newInputText);
    console.log(inputText);
  };

  const handleDeleteExperience = (index) => {
    const newExperienceText = [...experienceText];
    newExperienceText.splice(index, 1);
    setExperienceText(newExperienceText);
  };

  const handleDeleteField = (index) => {
    const newInputText = [...inputText];
    newInputText.splice(index, 1);
    setInputText(newInputText);
  };

  const handleSubmit = async () => {
    if (
      inputText.some((text) => !text.trim()) ||
      !jobDescription.trim() ||
      experienceText.some((text) => !text.trim())
    ) {
      setErrorMessage("Fill in all text fields");
      return;
    }

    try {
      const response = await fetch("/api/cohereAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompts: inputText,
          jobDescription: jobDescription,
          experience: experienceText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      console.log(data);

      if (data && data.prompts && data.experience) {
        const formattedTextArray = [];
        const formattedExperienceArray = [];

        data.prompts.forEach((item, index) => {
          const formattedText = item?.generations?.[0]?.text || "";
          const bulletPoints = formattedText
            .split("^")
            .filter((point) => point.trim() !== "");
          formattedTextArray.push(
            bulletPoints
              .map((point) => point.trim())
              .filter(Boolean)
              .join("\n")
          );

          const formattedExperience =
            data.experience[index]?.generations?.[0]?.text || "";
          const expBulletPoints = formattedExperience
            .split("^")
            .filter((point) => point.trim() !== "");
          formattedExperienceArray.push(
            expBulletPoints
              .map((point) => point.trim())
              .filter(Boolean)
              .join("\n")
          );
        });

        setGeneratedText(formattedTextArray);
        setGeneratedExperience(formattedExperienceArray);
        setErrorMessage("");
      } else {
        setGeneratedExperience([]);
        setGeneratedText([]);
        setErrorMessage("no generated text recieved");
      }
      
    } catch (error) {
      console.error(error);
      setGeneratedText("");
      setGeneratedExperience("");
      setErrorMessage("Error fetching generated text");
    }
  };
  return (
    <div>
      <h1>Generate Text</h1>

      {experienceText.map((value, index) => (
        <div key={index}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleExperienceChange(index, e.target.value)}
            placeholder={`Enter text prompt ${index + 1}`}
          />
          <button onClick={() => handleDeleteExperience(index)}>Delete</button>
        </div>
      ))}
      <button onClick={handleAddExperience}>Add Text Field</button>

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

      {/* Display generated experiences */}
      {generatedExperience.length > 0 && (
        <div>
          <h2>Generated Experience</h2>
          {generatedExperience.map((text, index) => (
            <pre key={index}>{text}</pre>
          ))}
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
