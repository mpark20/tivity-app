import { process_params } from "express/lib/router";

const Countdown = (props) => {
    if (props.state.tasks.length > 0) {
        
        return (
            <div>
                <div className="btn-container">
                    <button onClick={props.startTimer} className="btn" id='start-btn'>start</button>
                    <button onClick={props.pauseTimer} className="btn" id="pause">pause</button>
                    <button onClick={props.resumeTimer} className="btn" style={{display: "none"}} id="resume">resume</button>
                    <button onClick={props.clearTimer} className="btn">reset</button>
                </div>
                <div id="timer">{props.state.timeLeft.h}:{props.state.timeLeft.m}:{props.state.timeLeft.s}</div>
                <div id="task-label">{props.state.tasks[0].title}</div>
            </div>
        )
    }
    else {
        return (
            <>
                <div className="btn-container" style={{opacity: "0.7"}}>
                    <button className="btn inactive" id='start-btn'>start</button>
                    <button className="btn inactive" id="pause">pause</button>
                    <button className="btn inactive" style={{display: "none"}} id="resume">resume</button>
                    <button className="btn inactive">reset</button>
                </div>
                <div id="timer">{props.state.timeLeft.h}:{props.state.timeLeft.m}:{props.state.timeLeft.s}</div>
            </>
        )
    }

}

export default Countdown;