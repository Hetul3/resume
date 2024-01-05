import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [inputText, setInputText] = useState([""]);
  const [jobDescription, setJobDescription] = useState("");
  const [experienceText, setExperienceText] = useState([""]);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedExperience, setGeneratedExperience] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [testing, setTesting] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Tech Street, Techville",
    //removed summary
    skills: ["JavaScript", "Python", "React", "Node.js"],
    //added technical skills
    technicalSkills: [
      {
        title: "Languages",
        skills: "Java, Python, C/C++, SQL, JS, HTML/CSS, R",
      },
      {
        title: "Frameworks",
        skills: "React Nodejs, Flask, JUnit, WordPress, Material-UI, FastAPI",
      },
      {
        title: "Libraries",
        skills: "pandas, NumPy, Matplotlib",
      },
      {
        title: "Soft-Skills",
        skills: "communication, teamwork, responsibility, driven, passionate",
      },
    ],
    education: [
      {
        title: "Southwestern University",
        major: "Backhelor of Arts in Computer Science, Minor in Business",
        location: "Georgetown, TX",
        data: "Aug 2018 - May 2021",
      },
      {
        title: "Waterloo Univeristy",
        major: "Honours in Computer and Electrical Engineering",
        location: "Waterloo, ON",
        data: "Aug 2014 - May 2018",
      },
    ],

    //added location
    experience: [
      {
        title: "Software Developer",
        company: "Tech Solutions Inc.",
        date: "Jan 2019 - Present",
        description: [
          "Developed web applications using React.js and Node.js.",
          "Collaborated with cross-functional teams to deliver high-quality software products.",
          "Resolved technical issues and optimized application performance.",
        ],
      },
      {
        title: "Software Developer",
        company: "Tech Solutions Inc.",
        date: "Jan 2019 - Present",
        description: [
          "Developed web applications using React.js and Node.js.",
          "Collaborated with cross-functional teams to deliver high-quality software products.",
          "Resolved technical issues and optimized application performance.",
        ],
      },
      {
        title: "Software Developer",
        company: "Tech Solutions Inc.",
        date: "Jan 2019 - Present",
        description: [
          "Developed web applications using React.js and Node.js.",
          "Collaborated with cross-functional teams to deliver high-quality software products.",
          "Resolved technical issues and optimized application performance.",
        ],
      },
      {
        title: "Software Developer",
        company: "Tech Solutions Inc.",
        date: "Jan 2019 - Present",
        description: [
          "Developed web applications using React.js and Node.js.",
          "Collaborated with cross-functional teams to deliver high-quality software products.",
          "Resolved technical issues and optimized application performance.",
        ],
      },
      {
        title: "Information Technology Support Specialist",
        company: "Southwestern University",
        date: "Jun 2017 - Dec 2018",
        description: [
          "Built responsive and interactive user interfaces using HTML, CSS, and JavaScript.",
          "Worked closely with designers to implement UI/UX designs.",
          "Performed code reviews and provided technical guidance to junior developers.",
        ],
      },
      {
        title: "Intern",
        company: "Innovative Solutions Ltd.",
        date: "May 2016 - Aug 2016",
        description: [
          "Explored Methods to generate video game dungeons based off of The Legened of Zelda",
          "Developed a game in Java to test the generated dungeons",
          "Contributed 50K+ lines of code to an established codebase via Git",
          "Conducted a human subject study to determine which video game dungeon generation technique is enjoyable",
          "Wrote an 8-page paper and gave multiple presentations on-campus",
          "Presented virtually to the World Conference on Computational Intelligence",
        ],
      },
    ],

    //added date and technology
    projects: [
      {
        title: "E-commerce Website",
        technology: "Python, Flask, React, PostgresSQL, Docker",
        date: "June 2020 - July 2020",
        description: [
          "Developed a fullstack web application using with Flask serving a REST API with React as the frontend",
          "Implemented GitHub OAuth to get data from user's repositories",
          "Visualized GitHub data to show collaboration",
          "Used Celery and Redis for asynchronous tasks",
        ],
      },
      {
        title: "Portfolio Website",
        technology: "Python, Flask, React, PostgresSQL, Docker",
        date: "June 2020 - July 2020",
        description: [
          "Designed and developed a personal portfolio website using HTML, CSS, and JavaScript.",
          "Showcased projects, skills, and contact information.",
        ],
      },
      {
        title: "Inventory Management System",
        technology: "Python, Flask, React, PostgresSQL, Docker",
        date: "June 2020 - July 2020",
        description: [
          "Created an inventory management system with CRUD functionalities using Node.js and MongoDB.",
          "Collaborated with Minecraft server adminstrators to suggest features and get feedback about the plugins",
          "Published plugin to website gaining 2K+ downloads and an average 4.5/5-star review",
        ],
      },
    ],
  });

  const createPDF = async () => {
    const doc = new jsPDF("p", "pt", "letter");
    const margin = 20;
    const startY = 0;
    const lineWidth = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFont("times", "Roman");

    // Header
    const nameText = "John Doe";
    doc.setFontSize(20);
    const textWidth =
      doc.getStringUnitWidth(nameText) * doc.internal.getFontSize();
    const startX = (lineWidth - textWidth) / 2 + margin;
    doc.text(nameText, startX, 35);
    doc.setFontSize(12);

    // User information - Contact details
    const contactInfo = [
      "123 Tech Street, Techville",
      "john@example.com",
      "123-456-7890",
    ];
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

    // Experience section
    doc.setFontSize(16);
    doc.text("Experience", margin, startY + 80); 
    doc.setLineWidth(1);
    doc.line(margin, startY + 85, lineWidth + margin, startY + 85); 
    doc.setFontSize(12);
    let expY = startY + 100; 

    testing.experience.forEach((exp) => {
      doc.setFont("bold");
      doc.text(`${exp.title} - ${exp.company}`, margin, expY);
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

      exp.description.forEach((desc) => {
        doc.text("•", margin + 10, expY); 
        doc.text(`${desc}`, margin + 20, expY);
        expY += 15; 
      });

      expY += 15; 
    });

    // Projects section
    doc.setFontSize(16);
    doc.text("Projects", margin, expY + 10); 
    doc.setLineWidth(1);
    doc.line(margin, expY + 15, lineWidth + margin, expY + 15); 
    doc.setFontSize(12);
    let projectY = expY + 30; 

    testing.projects.forEach((project) => {
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

      project.description.forEach((desc) => {
        doc.text("•", margin + 10, projectY); 
        doc.text(`${desc}`, margin + 20, projectY); 
        projectY += 15; 
      });

      projectY += 15; 
    });

    doc.save("tech_resume.pdf");
  };

  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Tech Street, Techville",
    summary:
      "Tech-savvy individual with a passion for coding and problem-solving.",
    skills: ["JavaScript", "Python", "React", "Node.js"],
    experience: [
      {
        title: "Software Developer",
        company: "Tech Solutions Inc.",
        date: "Jan 2019 - Present",
        description: [
          "Developed web applications using React.js and Node.js.",
          "Collaborated with cross-functional teams to deliver high-quality software products.",
          "Resolved technical issues and optimized application performance.",
        ],
      },
      {
        title: "Frontend Developer",
        company: "WebTech Co.",
        date: "Jun 2017 - Dec 2018",
        description: [
          "Built responsive and interactive user interfaces using HTML, CSS, and JavaScript.",
          "Worked closely with designers to implement UI/UX designs.",
          "Performed code reviews and provided technical guidance to junior developers.",
        ],
      },
      {
        title: "Intern",
        company: "Innovative Solutions Ltd.",
        date: "May 2016 - Aug 2016",
        description: [
          "Assisted in testing and debugging software applications.",
          "Participated in team meetings and contributed ideas for product improvement.",
          "Learned about software development methodologies and best practices.",
        ],
      },
    ],
    projects: [
      {
        title: "E-commerce Website",
        description: [
          "Developed an e-commerce website using React and Redux.",
          "Implemented features like user authentication, product search, and cart functionality.",
        ],
      },
      {
        title: "Portfolio Website",
        description: [
          "Designed and developed a personal portfolio website using HTML, CSS, and JavaScript.",
          "Showcased projects, skills, and contact information.",
        ],
      },
      {
        title: "Inventory Management System",
        description: [
          "Created an inventory management system with CRUD functionalities using Node.js and MongoDB.",
          "Integrated authentication and access control for different user roles.",
        ],
      },
    ],
  });

  const generatePDF = async () => {
    const doc = new jsPDF("p", "pt", "letter");
    const margin = 40;
    const startY = 50;
    const lineWidth = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFont("times", "Roman");

    // Header
    doc.setFontSize(20);
    doc.text("John Doe", margin, startY);
    doc.setFontSize(12);
    doc.text(
      "123 Tech Street, Techville | john@example.com | 123-456-7890",
      margin,
      startY + 20
    );
    doc.line(margin, startY + 25, lineWidth + margin, startY + 25);

    // Summary
    doc.setFontSize(16);
    doc.text("Summary", margin, startY + 50);
    doc.setFontSize(12);
    doc.text(resumeData.summary, margin, startY + 70);

    // Skills
    doc.setFontSize(16);
    doc.text("Skills", margin, startY + 120);
    doc.setFontSize(12);
    let skillsY = startY + 140;
    resumeData.skills.forEach((skill) => {
      doc.text(`- ${skill}`, margin, skillsY);
      skillsY += 20;
    });

    // Experience
    doc.setFontSize(16);
    doc.text("Experience", margin, skillsY + 30);
    doc.setFontSize(12);
    let expY = skillsY + 50;
    resumeData.experience.forEach((exp) => {
      doc.setFont("bold");
      doc.text(`${exp.title} - ${exp.company}`, margin, expY);
      doc.setFont("normal");
      doc.text(`${exp.date}`, margin, expY + 20);
      exp.description.forEach((desc) => {
        doc.text(`- ${desc}`, margin, expY + 40);
        expY += 20;
      });
      expY += 30;
    });

    // Projects
    doc.setFontSize(16);
    doc.text("Projects", margin, expY + 30);
    doc.setFontSize(12);
    let projectY = expY + 50;
    resumeData.projects.forEach((project) => {
      doc.setFont("bold");
      doc.text(`${project.title}`, margin, projectY);
      doc.setFont("normal");
      project.description.forEach((desc) => {
        doc.text(`- ${desc}`, margin, projectY + 20);
        projectY += 20;
      });
      projectY += 30;
    });

    doc.save("tech_resume.pdf");
  };

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
