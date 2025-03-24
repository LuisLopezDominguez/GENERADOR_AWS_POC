// src/App.js
import React from 'react';
import { Container } from '@mui/material';
import NewPublication from './components/NewPublication/NewPublication';
import TopBar from './components/TopBar/TopBar';

function App() {
  return (
    <>
      <TopBar />
      <Container
        maxWidth={false}
        sx={{
          height: '100vh',
          background: '#f5f5f5', // Fondo sólido neutro
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NewPublication />
      </Container>
    </>
  );
}

export default App;