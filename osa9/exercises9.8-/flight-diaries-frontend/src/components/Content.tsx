import { DiaryEntry } from '../types';

interface Content {
  content: DiaryEntry[]
}

const Content = ({ content }: Content) => {
  return (
    <div>
      {content.map(entry => (
        <p key={entry.id}>
          <b>
            {entry.date}
            <br />
          </b>
          <br />
          visibility: {entry.visibility}
          <br />
          weather: {entry.weather}
        </p>
      ))}
    </div>
  )
};

export default Content;