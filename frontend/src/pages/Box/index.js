import React, { useState, useEffect } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { MdInsertDriveFile } from 'react-icons/md';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

export default function Box({ match }) {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const io = socket('http://localhost:3333');

    io.emit('connectRoom', match.params.id);
    io.on('file', data => {
      setBoxes(data);
    });
  }, [match.params.id]);

  useEffect(() => {
    async function loadBoxes() {
      const response = await api.get(`/boxes/${match.params.id}`);

      setBoxes(response.data);
    }

    loadBoxes();
  }, [boxes]);

  function handleUpdate(files) {
    files.forEach(file => {
      const data = new FormData();
      const box = match.params.id;

      data.append('file', file);

      api.post(`/boxes/${box}/files`, data);
    });
  }

  const { title, files } = boxes;

  return (
    <div id="box-container">
      <header>
        <img src={logo} alt="" />
        <h1>{title}</h1>
      </header>

      <Dropzone onDropAccepted={handleUpdate}>
        {({ getRootProps, getInputProps }) => (
          <div className="upload" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag your files or click here</p>
          </div>
        )}
      </Dropzone>

      <ul>
        {files &&
          files.map(file => (
            <li key={file._id}>
              <a
                className="fileInfo"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdInsertDriveFile size={24} color="#A5Cfff" />
                <strong>{file.title}</strong>
              </a>
              <span>
                Há{" "}
                {formatDistanceToNow(new Date(file.createdAt), { locale: pt })}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}