
const Display = () => {
    return(
        <div id="display" className="indented">
            <h2>display</h2>
            <p style={{marginBottom: "5px"}}>color theme:</p>
            <form style={{marginBottom: "20px"}}>
                <div className="checklist">
                <input type="checkbox" placeholder="light" className="checklist" defaultChecked/>
                <label htmlFor="light" style={{fontSize: "14px"}}>light</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="dark" className="checklist"/>
                <label htmlFor="dark" style={{fontSize: "14px"}}>dark</label>
                </div>
            </form>
            <p>break length:</p>
        </div> 
    );
}
export default Display