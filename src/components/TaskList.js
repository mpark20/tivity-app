import { Draggable } from 'react-beautiful-dnd';

const TaskList = (props) => {
    
    const containerStyle  = {
        overflow: "hidden", 
        width: "65%", 
        margin: "5px 0", 
        padding: "1px", 
        borderBottom: "solid 1px #9cbfd6"
    }
    var timeStyle = {}; 
    if (props.origin==="planner") {
        timeStyle = {
            display: "none"
        }
    }
    
        return (
            <>
            {props.tasks.map((task, index) =>(
                <Draggable key={task.id} draggableId={task.id+''} index={index}>
                {(provided) => (
                <div className="task-entry" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <button key={task.id + "x"} onClick={() => props.delete(task.id)} className="x-btn">x</button>
                    <div key={task.id + "A"} id="task-title">{task.title}</div>
                    <div key={task.id + "B"} id="task-time" style={timeStyle}>{task.time} min </div>
                </div>
                )}
                </Draggable>
            ))}
            </>
        );
}
export default TaskList;
