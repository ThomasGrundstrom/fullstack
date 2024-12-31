import { CoursePart } from "../App";

interface PartProps {
  part: CoursePart
}

const Part = (props: PartProps) => {
  const part = props.part
  switch (part.kind) {
    case 'basic':
      return (
        <i>{part.description}</i>
      );
    case 'group':
      return (
        <>
          Project exercises: {part.groupProjectCount}
        </>
      );
    case 'background':
      return (
        <>
          <i>{part.description}</i>
          <br />
          Background material at: {part.backgroundMaterial}
        </>
      );
    case 'special':
      return (
        <>
          <i>{part.description}</i>
          <br />
          Required skills: {part.requirements.join(', ')}
        </>
      )
  }
};

export default Part;