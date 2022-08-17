import './Landing.css'

const Home = ( props ) => {
    var fadeElements = document.getElementsByClassName('scrollFade');
    console.log(props)
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
        <div> 
            
            <section className='scrollFade'id='welcome'>
                <div>
                    <div>produc<i style={{color: '#9cbfd6'}}><b>tivity</b></i></div>
                    <div>ac<i style={{color: '#9cbfd6'}}><b>tivity</b></i></div>
                    <div><i style={{color: '#9cbfd6'}}><b>tivity</b></i></div>
                </div>
            </section>

            <section className='features scrollFade'>
                <div className='feat'>
                    <img src='./images/timer.png'/>
                </div>
                <div className='desc'>
                    <p>focus timer</p>
                    <p>customizable pomodoro timer</p>
                </div>
            </section>
            <section className='features scrollFade'>
                <div className='feat'>
                    
                </div>
                <div className='desc'>
                    <p>todo list</p>
                    <p>add your tasks for the day</p>

                </div>
            </section>
            <section className='features scrollFade'>
                <div className='feat'>
                   
                </div>
                <div className='desc'>
                    <p>planner</p>
                    <p>save todo lists to your long-term planner</p>

                </div>
            </section>
        </div>
    )
}
export default Home