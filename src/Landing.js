import './Landing.css'
import {
    Route,
    Link,
    NavLink,
    Switch,
    HashRouter
} from "react-router-dom";
import SignIn from "./SignIn";
import Timer from "./Timer";

import timerPic from './images/timer.png'
import todoPic from './images/todo.png'
import calPic from './images/calendar.png'
import dashPic from './images/dashboard.png'
import settingsPic from './images/settings.png'
import coolTheme from './images/theme1.png'
import warmTheme from './images/theme2.png'
import darkTheme from './images/theme3.png'

const Home = ( props ) => {
    var fadeElements = document.getElementsByClassName('scrollFade');
    function scrollFade() {
        var viewportBottom = window.scrollY + window.innerHeight;

        for (var index = 0; index < fadeElements.length; index++) {
            var element = fadeElements[index];
            var rect = element.getBoundingClientRect();

            var elementFourth = rect.height/4;
            var fadeInPoint = window.innerHeight - elementFourth;
            var fadeOutPoint = -(rect.height);

            if (rect.top <= fadeInPoint) {
                element.classList.add('scrollFade--visible');
                element.classList.add('scrollFade--animate');
                element.classList.remove('scrollFade--hidden');
            } else {
                element.classList.remove('scrollFade--visible');
                element.classList.add('scrollFade--hidden');
            }

            if (rect.top <= fadeOutPoint) {
                element.classList.remove('scrollFade--visible');
                element.classList.add('scrollFade--hidden');
            }
        }
    }

    document.addEventListener('scroll', scrollFade);
    window.addEventListener('resize', scrollFade);
    document.addEventListener('DOMContentLoaded', function() {
        scrollFade();
    });
    return(
        <div style={{backgroundColor: '#f9f9f9'}}> 
            
            <section id='welcome'>
                <div id='slogan'>
                    <div>produc<i style={{color: '#9cbfd6'}}><b>tivity</b></i></div>
                    <div>ac<i style={{color: '#9cbfd6'}}><b>tivity</b></i></div>
                    <div><i style={{color: '#9cbfd6'}}><b>tivity</b></i></div>
                </div>
                <div></div>
                <div className='opt shadow'>
                    <p>use the focus timer without an account</p>
                    <button className='btn white'><NavLink to='/focus-timer'>guest mode</NavLink></button>
                </div>
                <div className='opt shadow'>
                    <p>access the planner, calendar, and more!</p>
                    <button className='btn'><NavLink to='/login'>sign up</NavLink></button>
                </div>
                
            </section>

            {/*<section className='features scrollFade'>
                <div className='feat'>
                    <img src={timerPic}/>
                    <div className='desc'>
                        <p>focus timer</p>
                        <p>customizable pomodoro timer</p>
                    </div>
                </div>
                <div className='feat'>
                    <img src={todoPic}/>
                    <div className='desc'>
                        <p>planner & todo list</p>
                        <p>save todo lists to your long-term planner</p>
                    </div>
                </div>
                <div className='feat'>
                    <img src={calPic}/>
                    <div className='desc'>
                        <p>calendar</p>
                        <p>add events and sync with your Google Calendar</p>
                    </div>
                </div>
            </section> */}
            <section  style={{width: "90%", margin: '3%'}}>
                <h2>the pomodoro method...</h2>
                <p>
                        is a popular time-management technique that breaks work periods into 25-minute sessions 
                        followed by 5-minute breaks. The <i>tivity</i> focus timer uses this strategy to help users 
                        lead productive study sessions.
                </p>
                <br/>
            </section>
            <section className='features scrollFade'>
                
                <div className='desc'>
                    <h2>focus timer</h2>
                    
                    <p>
                        Enter your tasks on the right and adjust the 
                        session durations to your liking!
                    </p>
                </div>
                <div className='feat'>
                    <img src={timerPic}/>
                </div>
                
            </section>
            
            <section className='features scrollFade'>
                
                <div className='desc'>
                    <h2>planner & todo list</h2>
                    <p>
                        On the left, add items to your current todo list and view calendar events in the coming week. 
                        On the right, view old todo lists saved to your planner.
                    </p>

                </div>
                <div className='feat'>
                    <img src={todoPic}/>
                </div>
            </section>

            <section className='features scrollFade'>
                
                <div className='desc'>
                    <h2>calendar</h2>
                    <p>View and add events or import data from your Google Calendar.
                    </p>

                </div>
                <div className='feat'>
                    <img src={calPic}/>
                </div>
            </section>
            <section className='features scrollFade'>
                
            </section>
        </div>
    )
}
export default Home