import { Divider } from "@material-ui/core";
import React, { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Navbar from './Navbar';

import { GridMenuIcon } from "@material-ui/data-grid";
import Admin_Master from './NavItems/Master_creation/Admin_Master';

// import { MenuOpen } from "@material-ui/icons";

const Body = () => {
  const history = useHistory();
  const homeRedirect = () => {
    history.push('/')
  }

  const [menu, setMenu] = useState(false);
  const menu_toggle = () => {
    let a = document.getElementById('sidebar');
    let b = document.getElementById('main');
    if (menu) {
      a.style.display = 'none';
      b.className = 'col-md-12 main';
      setMenu(false);
    } else {
      a.style.display = 'block';
      b.className = 'col-md-10 main';
      setMenu(true);
    }

  }
  return (
    <div>
      <header className="header" id="header" >
        <div className="header_toggle row"> 
          <GridMenuIcon className='col' style={{marginTop: '10px'}} onClick={menu_toggle}/> 
          {/* <MenuOpen className='col' style={{marginTop: '10px'}} /> */}
          <h2 className='col-11' style={{ cursor: 'pointer',}} onClick={homeRedirect}>
            BHARTI EXPO-ADS
          </h2>
        </div>
          <Divider />
        {/* <div className="header_img"> <img src="https://i.imgur.com/hczKIze.jpg" alt="" /> </div> */}
      </header>
      <div className='row' style={{margin: '0px',}}>

        <div className="col-md-2 sidenav" id='sidebar' style={{ padding: 0, minHeight: '100vh', position: 'sticky',  }}>
          <Navbar />
        </div>
        <div className="col-md-10 main" id='main'>


          <Switch>
            <Route exact path ='/Admin_Master' component={Admin_Master}/>
          </Switch>
        </div>
      </div>

    </div>
  );
}

export default Body;