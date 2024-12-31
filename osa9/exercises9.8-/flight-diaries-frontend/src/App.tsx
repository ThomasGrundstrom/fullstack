import { useState, useEffect } from 'react';
import axios from 'axios';
import { DiaryEntry } from './types';
import Header from './components/Header';
import Content from './components/Content';
import AddEntryForm from './components/AddEntryForm';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/diaries').then(response => {
      setEntries(response.data)
    })
  }, []);

  return (
    <>
      <AddEntryForm entries={entries} setEntries={setEntries} />
      <Header header={'Diary entries'} />
      <Content content={entries} />
    </>
  );
};

export default App;
