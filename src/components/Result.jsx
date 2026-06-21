import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import '../bgvid.mp4';
import { useSpeechSynthesis } from 'react-speech-kit'
import TransButton from './TransButton';
import Upload from './Upload';
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
// import "../topbar.css";

const Result = (props) => {

  const [preview, setPreview] = useState();
  const [caption, setCaption] = useState();           // Changing caption on UI
  const [cap, setCap] = useState();                   // Constant caption
  const { speak } = useSpeechSynthesis();
  const [bool1, setBool] = useState(false);

  const handleListen = () => {
    speak({ text: caption })
  }

  const callback = (lang) => {
    setCaption(lang);
  }
  const fetchCaption = async () => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
                },
                body: props.img,
            }
        );
        const data = await response.json();
        setCaption(data[0]?.generated_text || "Could not generate caption");
        setCap(data[0]?.generated_text || "Could not generate caption");
    } catch (err) {
        console.log(err);
    }
}
  useEffect(() => {
    setPreview(URL.createObjectURL(props.img));

    fetchCaption();

  }, [])
  const handleClick = () => {
    setBool(true);
  }

  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  }

  return (
    <>
      {!bool1 && <div className="result-page">
      {localStorage.getItem('token') && <button onClick={handleLogout} className='result-logout' style={{ position: 'absolute', right: '118px', top: '27px' }}>Logout</button>}
        {/* <video id="bg-video" src="../bgvid.mp4" autoplay loop muted></video> */}
        <div className="result-window" style={{ position: 'reative' }}>
          <button style={{ color: 'black', marginLeft: "-31rem" }} className='result-logout' onClick={handleClick} >Go back</button>
          <h1 className="result-heading">Result page</h1>
          {preview && <img className="result-image" src={preview} alt="image" />}
          {caption ? (
            <p className="result-caption">{caption}</p>
          ) : (
            <Loader />
          )}
          <div className='extra-button'>
            {localStorage.getItem('token') && <button className="text-to-speech-btn" onClick={handleListen}>
              Convert text to speech
            </button>}
            {localStorage.getItem('token') && <TransButton callback={callback} cap={cap} />}
          </div>
          {!localStorage.getItem('token') && <Link to='/login'>Sign in to translate and hear the caption</Link>}
        </div>
      </div>}

      
      {bool1 && <Upload />}
    </>
  );
}

export default Result;