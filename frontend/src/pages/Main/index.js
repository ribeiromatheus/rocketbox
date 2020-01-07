import React, { useState } from 'react';

import logo from '../../assets/logo.svg';
import api from '../../services/api';

import { Container } from './styles';

export default function Main({ history }) {
  const [newBox, setNewBox] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/boxes', { title: newBox });

    history.push(`/box/${response.data._id}`);
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="" />
        <input
          placeholder="Create a Box"
          value={newBox}
          onChange={e => setNewBox(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </Container>
  );
}