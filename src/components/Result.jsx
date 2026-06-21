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
    const formData = new FormData();
    formData.append('file', props.img);

    try {
        // Simulating AI caption generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockCaptions = [
            "a dog sitting on a bench in the park",
            "a group of people standing in front of a building",
            "a cat sleeping on a cozy couch",
            "a beautiful sunset over the ocean",
            "a person riding a bicycle on a city street"
        ];
        
        const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
        setCaption(randomCaption);
        setCap(randomCaption);
        
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