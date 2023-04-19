import React, { useState } from 'react';
import axios from 'axios';
import { Storage } from 'aws-amplify';
import './App.css';

function App() {
  const [petName, setpetName] = useState('');
  const [petType, setpetType] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [data, setData] = useState(null);
  const [showData, setShowData] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let uidnum = Math.floor(Math.random() * 10000);
    uidnum = uidnum.toString();

    console.log(`petName: ${petName}, petType: ${petType}, Comment: ${comment}, file: ${file} `);

    try {
      const result = await Storage.put(file.name, file);
      const url = await Storage.get(result.key);
      setImageUrl(url);

      axios.post('https://84ilpny30g.execute-api.us-east-1.amazonaws.com/default/petSeverlessAppFunction', { name: petName, uid: uidnum, type: petType,  message: comment, fileName: file.name })
        .then(response => {
          console.log("info sent to db")
        })
        .catch(error => {
          console.log("info did not send to db")
        });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
    fetch('https://wgohphvw18.execute-api.us-east-1.amazonaws.com/default/petFetch')
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data.body);
        setData(parsedData);
        setShowData(true);
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleImageUpload  = (event) => {
    const file = event.target.files[0];
    setFile(file);
  }

  

  return (
  <div>
    <h1>RATE MY PET</h1>
    {(
      <div className="form-container">
        <h1>Post your pet!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="petName">petName:</label>
            <input type="text" id="petName" name="petName" value={petName} onChange={(event) => setpetName(event.target.value)} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="petType"> petType:</label>
            <input type="petType" id="petType" name="petType" value={petType} onChange={(event) => setpetType(event.target.value)} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment:</label>
            <textarea id="comment" name="comment" value={comment} onChange={(event) => setComment(event.target.value)} rows="5" required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="file">File:</label>
            <input type="file" id="file" name="file" onChange={handleImageUpload} required className="form-control-file" />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
        
      </div>
    )}
    <div className="post-container">
      <div className="post">
        {imageUrl && <img src={imageUrl} alt="Uploaded file" />}
        {showData && data && data.Items && (
          <ul>
            {data.Items.map(item => (
              <li key={item.uid}>{item.pet} - {item.type} - {item.message} - {item.fileName} </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);
}

export default App;