import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import './App.css';


export default function App() {
  const [nameText, setNameText] = useState("");
  // Access your API key (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI("AIzaSyA2vdutgmI6H61Ero8-tAzEQe60OHWb41k");

  // Converts a File object to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = "Görseldeki problemi anlatarak çöz";

    const fileInputEl = document.querySelector("input[type=file]");
    const imageParts = await Promise.all(
      [...fileInputEl.files].map(fileToGenerativePart)
    );

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    setNameText(text);
  }
  return (
    <>
      <div className="container">
        <h1 className>InputPage</h1>
        <div>
          <br></br>
          <input type="file"></input>
          <button onClick={run}>Run</button>
          <div>
            {nameText && (
              <div>
                {nameText.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
