import Part from "./Part";
import { CoursePart } from "../App";

interface ContentProps {
  content: CoursePart[];
}

const Content = ({ content }: ContentProps) => {
  return (
    content.map((course, index) => (
      <p key={index}>
        <b>{course.name} {course.exerciseCount}</b>
        <br />
        <Part part={course} />
      </p>
    ))
  );
};

export default Content;