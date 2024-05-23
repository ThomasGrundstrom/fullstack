const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

const Header = (props) => {
    return (
        <div>
            <h2>{props.course}</h2>
        </div>
    )
}
  
const Content = (props) => {
    const { parts } = props
    return (
        <div>
            {parts.map(part => <Part name={part.name} exercises={part.exercises} key={part.id} />)}
        </div>
    )
}
  
const Total = (props) => {
    const { parts } = props
    const total = parts.reduce( (s, part) => s + part.exercises, 0)
    return (
        <div>
            <b>total of {total} exercises</b>
        </div>
    )
}
  
const Part = (props) => {
    return (
        <div>
            <p>
                {props.name} {props.exercises}
            </p>
        </div>
    )
}

export default Course