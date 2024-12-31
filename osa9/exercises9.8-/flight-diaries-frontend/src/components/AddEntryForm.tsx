import { useState } from 'react';
import { DiaryEntry } from '../types';
import axios from 'axios';

interface EntryFormProps {
  entries: DiaryEntry[];
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}

const AddEntryForm = (props: EntryFormProps) => {
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')

    const entryToAdd = {
      date: newDate,
      visibility: newVisibility,
      weather: newWeather,
      comment: newComment,
      id: props.entries.length + 1
    }

    try {
      const response = await axios.post('http://localhost:3000/api/diaries', entryToAdd);
    console.log(response.data);
    props.setEntries(props.entries.concat(entryToAdd));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response);
        setErrorMessage(error.response?.data);
      } else {
        console.error(error)
      }
    };

    setNewDate('');
    setNewVisibility('');
    setNewWeather('');
    setNewComment('');
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {errorMessage && (
        <p style={{color: 'red'}}>
          {errorMessage}
        </p>
      )}
      <form onSubmit={entryCreation}>
        date
        <input type='date' value={newDate} onChange={(event) => {
          setNewDate(event.target.value)
        }} />
        <br />
        visibility
        great <input type='radio' value={newVisibility} name='visibility' checked={newVisibility==='great'} onChange={() => {
          setNewVisibility('great')
        }} />
        good <input type='radio' value={newVisibility} name='visibility' checked={newVisibility==='good'} onChange={() => {
          setNewVisibility('good')
        }} />
        ok <input type='radio' value={newVisibility} name='visibility' checked={newVisibility==='ok'} onChange={() => {
          setNewVisibility('ok')
        }} />
        poor <input type='radio' value={newVisibility} name='visibility' checked={newVisibility==='poor'} onChange={() => {
          setNewVisibility('poor')
        }} />
        <br />
        weather
        sunny <input type='radio' value={newWeather} name='weather' checked={newWeather==='sunny'} onChange={() => {
          setNewWeather('sunny')
        }} />
        rainy <input type='radio' value={newWeather} name='weather' checked={newWeather==='rainy'} onChange={() => {
          setNewWeather('rainy')
        }} />
        cloudy <input type='radio' value={newWeather} name='weather' checked={newWeather==='cloudy'} onChange={() => {
          setNewWeather('cloudy')
        }} />
        stormy <input type='radio' value={newWeather} name='weather' checked={newWeather==='stormy'} onChange={() => {
          setNewWeather('stormy')
        }} />
        windy <input type='radio' value={newWeather} name='weather' checked={newWeather==='windy'} onChange={() => {
          setNewWeather('windy')
        }} />
        <br />
        comment
        <input value={newComment} onChange={(event) => {
          setNewComment(event.target.value)
        }} />
        <br />
        <button type='submit'>add</button>
      </form>
    </div>
  );
};

export default AddEntryForm;