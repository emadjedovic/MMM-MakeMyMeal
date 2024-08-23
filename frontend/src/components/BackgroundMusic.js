import React, { useState, useRef, useContext, useEffect } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Row, Col } from "react-bootstrap"; // Importing Bootstrap components

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // New state for play/pause
  const { theme } = useContext(ThemeContext);

  const toggleVolume = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const getIconSrc = () => {
    if (theme === "light") {
      return isMuted ? "/dark-muted.png" : "/dark-unmuted.png";
    } else {
      return isMuted ? "/light-muted.png" : "/light-unmuted.png";
    }
  };

  // Function to handle play/pause based on user interaction
  const handleUserInteraction = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log("Play attempt failed:", error);
        });
      }
    }
  };

  useEffect(() => {
    // Add event listener for user interaction
    document.addEventListener('click', handleUserInteraction);
    return () => {
      // Cleanup event listener
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [isPlaying]);

  return (
    <Row className="align-items-center">
      <Col xs="auto">
        <button
          onClick={toggleVolume}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <img
            src={getIconSrc()}
            alt={isMuted ? "Unmute" : "Mute"}
            style={{ width: "25px", height: "25px" }}
          />
        </button>
      </Col>
      <Col>
        <audio ref={audioRef} loop muted={isMuted} src="http://channels.fluxfm.de/chillhop/stream.mp3">
          Your browser does not support the audio element.
        </audio>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default BackgroundMusic;
