// import React, { useState, useRef, useEffect } from "react";
// import WaveSurfer from "wavesurfer.js";
// import "./App.css";

// function App() {
//   const [recording, setRecording] = useState(false);
//   const [transcription, setTranscription] = useState("");
//   const [showTranscription, setShowTranscription] = useState(false);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState("en");
//   const [translatedText, setTranslatedText] = useState("");
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const waveSurferRef = useRef(null);
//   const audioElementRef = useRef(null);

//   const languageOptions = [
//     { code: "en", label: "English" },
//     { code: "es", label: "Spanish" },
//     { code: "fr", label: "French" },
//     { code: "de", label: "German" },
//     { code: "it", label: "Italian" },
//     { code: "ur", label: "Urdu" },
//     { code: "hi", label: "Hindi" },
//     { code: "ar", label: "Arabic" },
//     { code: "zh", label: "Chinese" },
//     { code: "ja", label: "Japanese" },
//     { code: "ko", label: "Korean" },
//     { code: "pt", label: "Portuguese" },
//     { code: "ru", label: "Russian" },
//     { code: "bn", label: "Bengali" },
//     { code: "tr", label: "Turkish" },
//     { code: "fa", label: "Persian" },
//   ];

//   useEffect(() => {
//     waveSurferRef.current = WaveSurfer.create({
//       container: "#waveform",
//       waveColor: "#3b82f6",
//       progressColor: "#2563eb",
//       height: 100,
//     });
//   }, []);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;
//     audioChunksRef.current = [];

//     waveSurferRef.current.empty();

//     mediaRecorder.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };

//     mediaRecorder.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//       const url = URL.createObjectURL(audioBlob);
//       waveSurferRef.current.load(url);
//       setAudioUrl(url);

//       const formData = new FormData();
//       formData.append("audio", audioBlob, "recording.wav");

//       try {
//         const res = await fetch("http://localhost:5000/transcribe", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await res.json();
//         setTranscription(data.transcription || data.error || "Unknown error");
//       } catch (err) {
//         setTranscription("Error sending audio to backend");
//       }
//     };

//     mediaRecorder.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   const toggleTranscription = () => {
//     setShowTranscription((prevState) => !prevState);
//   };

//   const handleTranslate = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/translate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           text: transcription,
//           target_lang: selectedLanguage,
//         }),
//       });
//       const data = await response.json();
//       setTranslatedText(data.translatedText || "Translation error");
//     } catch (error) {
//       setTranslatedText("Error during translation");
//     }
//   };

//   const handlePlay = () => {
//     if (audioElementRef.current && isPaused) {
//       audioElementRef.current.play();
//       setIsPaused(false);
//       return;
//     }

//     if (audioElementRef.current) {
//       audioElementRef.current.pause();
//       audioElementRef.current.currentTime = 0;
//     }
//     const audio = new Audio(audioUrl);
//     audioElementRef.current = audio;
//     audio.play();
//     setIsPlaying(true);
//     setIsPaused(false);

//     audio.onended = () => {
//       setIsPlaying(false);
//     };
//   };

//   const handlePause = () => {
//     if (audioElementRef.current && isPlaying) {
//       audioElementRef.current.pause();
//       setIsPaused(true);
//     }
//   };

//   return (
//     <>
//         <div className="card">
//           <h1 className="heading">🎙Voice Transcriber & Translate</h1>

//           <div id="waveform"></div>

//           <div className="button-container">
//             <button
//               className={`record-btn ${recording ? "stop-btn" : "start-btn"}`}
//               onClick={recording ? stopRecording : startRecording}
//             >
//               {recording ? "Stop Recording" : "Start Recording"}
//             </button>
//           </div>

//           {audioUrl && !recording && (
//             <div className="button-container">
//               <button className="play-btn" onClick={handlePlay}>
//                 {isPaused ? "Resume" : "Play Recording"}
//               </button>
//               <button className="pause-btn" onClick={handlePause}>
//                 Pause
//               </button>
//             </div>
//           )}

//           <div className="button-container">
//             <button
//               className="show-transcription-btn"
//               onClick={toggleTranscription}
//             >
//               {showTranscription ? "Hide Transcription" : "Show Transcription"}
//             </button>
//           </div>

//           {showTranscription && (
//             <div className="transcription-section">
//               <p className="transcription">
//                 <strong>Transcription:</strong> {transcription}
//               </p>
//               <div>
//                 <label htmlFor="language-select">Translate to: </label>
//                 <select
//                   id="language-select"
//                   value={selectedLanguage}
//                   onChange={(e) => setSelectedLanguage(e.target.value)}
//                 >
//                   {languageOptions.map((option) => (
//                     <option key={option.code} value={option.code}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <button className="translate-btn" onClick={handleTranslate}>
//                   Translate
//                 </button>
//               </div>
//               {translatedText && (
//                 <div className="translation-result">
//                   <p>
//                     <strong>Translation:</strong> {translatedText}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//     </>
//   );
// }
// export default App;

//  ===========================================================================================================
//                                              Final segmented code 

import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import "./App.css";

function App() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [showTranscription, setShowTranscription] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [segments, setSegments] = useState(null);
  const [audioSegments, setAudioSegments] = useState([]);
  const [showSegments, setShowSegments] = useState(false);
  const [activeSegment, setActiveSegment] = useState(null);
  const [playingSegment, setPlayingSegment] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const waveSurferRef = useRef(null);
  const audioElementRef = useRef(null);

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "ur", label: "Urdu" },
    { code: "hi", label: "Hindi" },
    { code: "ar", label: "Arabic" },
    { code: "zh", label: "Chinese" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
    { code: "bn", label: "Bengali" },
    { code: "tr", label: "Turkish" },
    { code: "fa", label: "Persian" },
  ];

  useEffect(() => {
    waveSurferRef.current = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#3b82f6",
      progressColor: "#2563eb",
      height: 100,
    });
    
    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    // Reset segments when new recording starts
    setSegments(null);
    setAudioSegments([]);
    setShowSegments(false);
    setActiveSegment(null);
    setPlayingSegment(null);
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    waveSurferRef.current.empty();

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      waveSurferRef.current.load(url);
      setAudioUrl(url);

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      try {
        const res = await fetch("http://localhost:5000/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setTranscription(data.transcription || data.error || "Unknown error");
        
        // Store segments and audio segments
        if (data.segments && data.audio_segments) {
          setSegments(data.segments);
          setAudioSegments(data.audio_segments);
        }
      } catch (err) {
        setTranscription("Error sending audio to backend");
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const toggleTranscription = () => {
    setShowTranscription((prevState) => !prevState);
  };

  const toggleSegments = () => {
    setShowSegments((prevState) => !prevState);
  };

  const handleTranslate = async () => {
    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcription,
          target_lang: selectedLanguage,
        }),
      });
      const data = await response.json();
      setTranslatedText(data.translatedText || "Translation error");
    } catch (error) {
      setTranslatedText("Error during translation");
    }
  };

  const handlePlay = () => {
    if (audioElementRef.current && isPaused) {
      audioElementRef.current.play();
      setIsPaused(false);
      return;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;
    audio.play();
    setIsPlaying(true);
    setIsPaused(false);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handlePause = () => {
    if (audioElementRef.current && isPlaying) {
      audioElementRef.current.pause();
      setIsPaused(true);
    }
  };

  const playSegment = (segment) => {
    // Stop any currently playing audio
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    
    const audio = new Audio(`http://localhost:5000/temp_audio/${segment.path}`);
    audioElementRef.current = audio;
    audio.play();
    setPlayingSegment(segment.text);
    
    audio.onended = () => {
      setPlayingSegment(null);
    };
  };

  return (
    <>
      <div className="card">
        <h1 className="heading">🎙 MediTranscribe</h1>

        <div id="waveform"></div>

        <div className="button-container">
          <button
            className={`record-btn ${recording ? "stop-btn" : "start-btn"}`}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        {audioUrl && !recording && (
          <div className="button-container">
            <button className="play-btn" onClick={handlePlay}>
              {isPaused ? "Resume" : "Play Recording"}
            </button>
            <button className="pause-btn" onClick={handlePause}>
              Pause
            </button>
          </div>
        )}

        <div className="button-container">
          <button
            className="show-transcription-btn"
            onClick={toggleTranscription}
          >
            {showTranscription ? "Hide Transcription" : "Show Transcription"}
          </button>
        </div>

        {showTranscription && (
          <div className="transcription-section">
            <p className="transcription">
              <strong>Transcription:</strong> {transcription}
            </p>
            <div>
              <label htmlFor="language-select">Translate to: </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="translate-btn" onClick={handleTranslate}>
                Translate
              </button>
            </div>
            {translatedText && (
              <div className="translation-result">
                <p>
                  <strong>Translation:</strong> {translatedText}
                </p>
              </div>
            )}
            
            {segments && (
              <div className="segmentation-section">
                <button 
                  className="segment-btn"
                  onClick={toggleSegments}
                >
                  {showSegments ? "Hide Medical Segments" : "Show Medical Segments"}
                </button>
                
                {showSegments && (
                  <div className="segments-container">
                    {Object.entries(segments).map(([category, items]) => (
                      items.length > 0 && (
                        <div key={category} className="segment-category">
                          <h3>{category.toUpperCase()}</h3>
                          <ul>
                            {items.map((item, index) => {
                              const audioSeg = audioSegments.find(
                                seg => seg.text === item && seg.category === category
                              );
                              
                              return (
                                <li key={index}>
                                  {item}
                                  {audioSeg && (
                                    <button
                                      className={`play-segment-btn ${
                                        playingSegment === item ? "active" : ""
                                      }`}
                                      onClick={() => playSegment(audioSeg)}
                                    >
                                      {playingSegment === item ? "⏹" : "▶"}
                                    </button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
