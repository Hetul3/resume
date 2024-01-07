import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [inputText, setInputText] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [experienceText, setExperienceText] = useState([]);
  const [generatedText, setGeneratedText] = useState([]);
  const [generatedExperience, setGeneratedExperience] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [experienceInfo, setExperienceInfo] = useState([
    { title: "", company: "", date: "", description: "" },
  ]);
  const [projectInfo, setProjectInfo] = useState([
    { title: "", technology: "", date: "", description: "" },
  ]);
  const [technicalInfo, setTechnicalInfo] = useState([
    { title: "", description: "" },
  ]);
  const [userInfo, setuserInfo] = useState({
    name: "",
    address: "",
    email: "",
    number: "",
  });
  const [educationInfo, setEducationInfo] = useState([
    { university: "", date: "", degree: "" },
  ]);

  const [testing, setTesting] = useState({
    education: educationInfo.map((info) => ({
      university: info.university,
      date: info.date,
      degree: info.degree,
    })),
    experience: experienceInfo.map((info, index) => ({
      title: info.title,
      company: info.company,
      date: info.date,
      description: generatedExperience[index] || "",
    })),
    projects: projectInfo.map((info, index) => ({
      title: info.title,
      technology: info.technology,
      date: info.date,
      description: generatedText[index] || "",
    })),
    technicalSkills: technicalInfo.map((info) => ({
      title: info.title,
      description: info.description,
    })),
  });

  const createPDF = async () => {
    const doc = new jsPDF("p", "pt", "letter");
    const margin = 15;
    const startY = 0;
    const lineWidth = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFont("times", "Roman");

    // Header
    const nameText = userInfo.name;
    doc.setFontSize(20);
    const textWidth =
      doc.getStringUnitWidth(nameText) * doc.internal.getFontSize();
    const startX = (lineWidth - textWidth) / 2 + margin;
    doc.text(nameText, startX, 35);
    doc.setFontSize(12);

    // User information - Contact details
    const contactInfo = [userInfo.address, userInfo.email, userInfo.number];
    const infoHeight = 15;
    const infoY = 0;

    // Concatenate and center-align contact information
    const concatenatedInfo = contactInfo.join(" | ");
    const concatenatedWidth =
      doc.getStringUnitWidth(concatenatedInfo) * doc.internal.getFontSize();
    const concatenatedX = (lineWidth - concatenatedWidth) / 2 + margin;
    doc.text(
      concatenatedInfo,
      concatenatedX,
      infoY + infoHeight * contactInfo.length + 10
    );

    // Education section
    doc.setFontSize(16);
    doc.text("Education", margin, infoY + 100);
    doc.setLineWidth(1);
    doc.line(margin, infoY + 105, lineWidth + margin, infoY + 105);
    doc.setFontSize(12);
    let eduY = infoY + 120;

    educationInfo.forEach((edu, index) => {
      doc.setFont("bold");
      doc.text(`${edu.university}`, margin, eduY);

      const dateText = `${edu.date}`;
      const dateWidth =
        doc.getStringUnitWidth(dateText) * doc.internal.getFontSize();
      const dateX = lineWidth - dateWidth + margin;

      doc.setFont("italic");
      doc.text(`${edu.date}`, dateX, eduY);
      doc.setFont("normal");
      doc.setFontSize(10);
      doc.text(`${edu.degree}`, margin, eduY + 15);
      doc.setFontSize(12);

      eduY += 30; // Move to the next section
    });

    // Experience section
    doc.setFontSize(16);
    doc.text("Experience", margin, eduY + 10);
    doc.setLineWidth(1);
    doc.line(margin, eduY + 15, lineWidth + margin, eduY + 15);
    doc.setFontSize(12);
    let expY = eduY + 30;

    experienceInfo.forEach((exp, index) => {
      doc.setFont("bold");
      doc.text(`${exp.title}`, margin, expY);
      doc.setFont("italic");
      const dateText = `${exp.date}`;
      const dateWidth =
        doc.getStringUnitWidth(dateText) * doc.internal.getFontSize();
      const dateX = lineWidth - dateWidth + margin;
      doc.text(`${exp.date}`, dateX, expY);
      doc.setFont("normal");
      doc.setFontSize(10);
      doc.text(`${exp.company}`, margin, expY + 15);
      doc.setFontSize(12);

      expY += 30;

      const generatedExp = generatedExperience[index];
      if (generatedExp && generatedExp.length > 0) {
        generatedExp.forEach((desc) => {
          const descLines = doc.splitTextToSize(desc, lineWidth - 40);
          let isFirstLine = true;
          descLines.forEach((line) => {
            if (expY > doc.internal.pageSize.height - 20) {
              doc.addPage();
              expY = 40; // Reset Y-coordinate for a new page
            }
            if (isFirstLine) {
              doc.text("•", margin + 10, expY);
              isFirstLine = false;
            }
            doc.text(line, margin + 20, expY);
            expY += 15;
          });
        });
      }

      expY += 15;
    });

    // Projects section
    doc.setFontSize(16);
    doc.text("Projects", margin, expY + 10);
    doc.setLineWidth(1);
    doc.line(margin, expY + 15, lineWidth + margin, expY + 15);
    doc.setFontSize(12);
    let projectY = expY + 30;

    projectInfo.forEach((project, index) => {
      doc.setFont("bold");
      doc.text(`${project.title}`, margin, projectY);
      doc.setFont("normal");

      doc.setFontSize(10);
      doc.text(`${project.technology}`, margin, projectY + 15);
      doc.setFontSize(12);

      const dateText = `${project.date}`;
      const dateWidth =
        doc.getStringUnitWidth(dateText) * doc.internal.getFontSize();
      const dateX = lineWidth - dateWidth + margin;
      doc.text(dateText, dateX, projectY);

      projectY += 30;

      const generatedProj = generatedText[index];
      if (generatedProj && generatedProj.length > 0) {
        generatedProj.forEach((desc) => {
          const descLines = doc.splitTextToSize(desc, lineWidth - 40);
          let isFirstLine = true;
          descLines.forEach((line) => {
            if (projectY > doc.internal.pageSize.height - 20) {
              doc.addPage();
              projectY = 40; // Reset Y-coordinate for a new page
            }
            if (isFirstLine) {
              doc.text("•", margin + 10, projectY);
              isFirstLine = false;
            }
            doc.text(line, margin + 20, projectY);
            projectY += 15;
          });
        });
      }

      projectY += 15;
    });

    // Technical Skills section
    doc.setFontSize(16);
    doc.text("Technical Skills", margin, projectY + 10);
    doc.setFontSize(12);
    doc.setLineWidth(1);
    doc.line(margin, projectY + 15, lineWidth + margin, projectY + 15);

    let techSkillsY = projectY + 15;

    technicalInfo.forEach((techSkill, index) => {
      doc.setFont("bold");
      const textToDisplay = `${techSkill.title} | ${techSkill.description}`;
      const textLines = doc.splitTextToSize(
        textToDisplay,
        lineWidth - margin * 2
      );

      doc.setFont("normal");
      textLines.forEach((line, i) => {
        if (techSkillsY + (i + 1) * 15 > doc.internal.pageSize.height - 20) {
          doc.addPage();
          techSkillsY = 40; // Reset Y-coordinate for a new page
        }
        doc.text(line, margin, techSkillsY + 15 * (i + 1));
      });

      techSkillsY += textLines.length * 15; // Adjust based on line height
    });

    doc.save("tech_resume.pdf");
  };

  const handleAddExperienceInfo = () => {
    setExperienceInfo([
      ...experienceInfo,
      { title: "", company: "", date: "", description: "" },
    ]);
  };

  const handleAddEducationInfo = () => {
    setEducationInfo([
      ...educationInfo,
      { university: "", date: "", degree: "" },
    ]);
  };

  const handleAddTechnicalInfo = () => {
    setTechnicalInfo([...technicalInfo, { title: "", description: "" }]);
  };

  const handleAddProjectInfo = () => {
    setProjectInfo([
      ...projectInfo,
      { title: "", technology: "", date: "", description: "" },
    ]);
  };

  const handleUserInfoChange = (field, value) => {
    setuserInfo({
      ...userInfo,
      [field]: value,
    });
  };

  const handleExperienceChangeInfo = (index, field, value) => {
    const newExperienceInfo = [...experienceInfo];
    newExperienceInfo[index][field] = value;
    setExperienceInfo(newExperienceInfo);
    console.log(experienceInfo);
  };

  const handleEducationChangeInfo = (index, field, value) => {
    const newEducationInfo = [...educationInfo];
    newEducationInfo[index][field] = value;
    setEducationInfo(newEducationInfo);
    console.log(educationInfo);
  };

  const handleTechnicalChangeInfo = (index, field, value) => {
    const newTechnicalInfo = [...technicalInfo];
    newTechnicalInfo[index][field] = value;
    setTechnicalInfo(newTechnicalInfo);
    console.log(technicalInfo);
  };

  const handleProjectChangeInfo = (index, field, value) => {
    const newProjectInfo = [...projectInfo];
    newProjectInfo[index][field] = value;
    setProjectInfo(newProjectInfo);
    console.log(projectInfo);
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

  const handleDeleteExperienceInfo = (index) => {
    const newExperienceInfo = [...experienceInfo];
    newExperienceInfo.splice(index, 1);
    setExperienceInfo(newExperienceInfo);
  };

  const handleDeleteEducationInfo = (index) => {
    const newEducationInfo = [...educationInfo];
    newEducationInfo.splice(index, 1);
    setEducationInfo(newEducationInfo);
  };

  const handleDeleteTechnicalInfo = (index) => {
    const newTechnicalInfo = [...technicalInfo];
    newTechnicalInfo.splice(index, 1);
    setTechnicalInfo(newTechnicalInfo);
  };

  const handleDeleteProjectDescription = (index) => {
    const newProjectInfo = [...projectInfo];
    newProjectInfo.splice(index, 1);
    setProjectInfo(newProjectInfo);
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
      projectInfo.some((proj) => !proj.description.trim()) ||
      !jobDescription.trim() ||
      experienceInfo.some((exp) => !exp.description.trim())
    ) {
      setErrorMessage("Fill in all text fields");
      return;
    }

    try {
      const experienceDescription = experienceInfo.map(
        (exp) => exp.description
      );

      const projectDescription = projectInfo.map((proj) => proj.description);

      const response = await fetch("/api/cohereAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompts: projectDescription,
          jobDescription: jobDescription,
          experience: experienceDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      console.log(data);

      if (
        data &&
        Array.isArray(data.prompts) &&
        Array.isArray(data.experience)
      ) {
        setGeneratedText(data.prompts);
        setGeneratedExperience(data.experience);
        setErrorMessage("");
      } else {
        setGeneratedExperience([]);
        setGeneratedText([]);
        setErrorMessage("No generated text received");
      }
      console.log(generatedExperience);
      console.log(generatedText);
    } catch (error) {
      console.error(error);
      setGeneratedText([]);
      setGeneratedExperience([]);
      setErrorMessage("Error fetching generated text");
    }
  };

  return (
    <div>
      <h1>Generate Text</h1>
      <div>
        <input
          type="text"
          value={userInfo.name}
          onChange={(e) => handleUserInfoChange("name", e.target.value)}
          placeholder="Enter name"
        />
        <input
          type="text"
          value={userInfo.address}
          onChange={(e) => handleUserInfoChange("address", e.target.value)}
          placeholder="Enter address"
        />
        <input
          type="email"
          value={userInfo.email}
          onChange={(e) => handleUserInfoChange("email", e.target.value)}
          placeholder="Enter email"
        />
        <input
          type="tel"
          value={userInfo.number}
          onChange={(e) => handleUserInfoChange("number", e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <button onClick={createPDF}>Generate PDF</button>
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
      <div>
        <input
          type="text"
          value={jobDescription}
          onChange={(e) => handleJobDescriptionChange(e.target.value)}
          placeholder="Enter job description"
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>

      {educationInfo.map((edu, index) => (
        <div key={index}>
          <input
            type="text"
            value={edu.university}
            onChange={(e) =>
              handleEducationChangeInfo(index, "university", e.target.value)
            }
            placeholder={`University ${index + 1}`}
          />
          <input
            type="text"
            value={edu.degree}
            onChange={(e) =>
              handleEducationChangeInfo(index, "degree", e.target.value)
            }
            placeholder={`Degree ${index + 1}`}
          />
          <input
            type="text"
            value={edu.date}
            onChange={(e) =>
              handleEducationChangeInfo(index, "date", e.target.value)
            }
            placeholder={`Date ${index + 1}`}
          />
          <button onClick={() => handleDeleteEducationInfo(index)}>Delete</button>
        </div>
      ))}
      <button onClick={() => handleAddEducationInfo()}>Add Education</button>

      {experienceInfo.map((experience, index) => (
        <div key={index}>
          <input
            type="text"
            value={experience.title}
            onChange={(e) =>
              handleExperienceChangeInfo(index, "title", e.target.value)
            }
            placeholder={`Title ${index + 1}`}
          />
          <input
            type="text"
            value={experience.description}
            onChange={(e) =>
              handleExperienceChangeInfo(index, "description", e.target.value)
            }
            placeholder={`Description ${index + 1}`}
          />
          <input
            type="text"
            value={experience.company}
            onChange={(e) =>
              handleExperienceChangeInfo(index, "company", e.target.value)
            }
            placeholder={`Company ${index + 1}`}
          />
          <input
            type="text"
            value={experience.date}
            onChange={(e) =>
              handleExperienceChangeInfo(index, "date", e.target.value)
            }
            placeholder={`Date ${index + 1}`}
          />
          <button onClick={() => handleDeleteExperienceInfo(index)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleAddExperienceInfo}>Add Experience</button>

      {projectInfo.map((project, index) => (
        <div key={index}>
          <input
            type="text"
            value={project.title}
            onChange={(e) =>
              handleProjectChangeInfo(index, "title", e.target.value)
            }
            placeholder={`Title ${index + 1}`}
          />
          <input
            type="text"
            value={project.technology}
            onChange={(e) =>
              handleProjectChangeInfo(index, "technology", e.target.value)
            }
            placeholder={`Technology ${index + 1}`}
          />
          <input
            type="text"
            value={project.date}
            onChange={(e) =>
              handleProjectChangeInfo(index, "date", e.target.value)
            }
            placeholder={`Date ${index + 1}`}
          />
          <input
            type="text"
            value={project.description}
            onChange={(e) =>
              handleProjectChangeInfo(index, "description", e.target.value)
            }
            placeholder={`Description ${index + 1}`}
          />
          <button onClick={() => handleDeleteProjectDescription(index)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleAddProjectInfo}>Add Project</button>

      {technicalInfo.map((technical, index) => (
        <div key={index}>
          <input
            type="text"
            value={technical.title}
            onChange={(e) =>
              handleTechnicalChangeInfo(index, "title", e.target.value)
            }
            placeholder={`Title ${index + 1}`}
          />
          <input
            type="text"
            value={technical.description}
            onChange={(e) =>
              handleTechnicalChangeInfo(index, "description", e.target.value)
            }
            placeholder={`Description ${index + 1}`}
          />
          <button onClick={() => handleDeleteTechnicalInfo(index)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleAddTechnicalInfo}>Add Technical Skill</button>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
