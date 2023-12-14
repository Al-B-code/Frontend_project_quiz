import { Outlet, Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Template  = () => {
    
    return ( 
        <>
        <div className="title-nav-container">
        <h1>Best Quiz Ever</h1>
        <nav className="nav-bar">
            <ul>
                <li>
                    <NavLink to = "/" activeClassName="active" className="link"> Home</NavLink>
                </li>
                <li>
                    <NavLink to = "/question" activeClassName="active" className="link"> Current Question</NavLink>
                </li>
                <li>
                    <NavLink to = "/create-new-quiz" activeClassName="active" className="link">Create a New Quiz</NavLink>
                </li>
            </ul>
        </nav>
        </div>

        <section className="outlet-container">
            <Outlet/>
        </section>

        <footer>
            <p>© M's Dawgz 2023</p>
        </footer>
        </>
     );
}
 
export default Template ;