import {unauthorize, redirect} from '/session_manager.js';

class Sidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
      <style>
        #sidebar {
            height: 100%;
            position: fixed;
            z-index: 1;
            top: 0;
            left: 0;
            background-color: #111;
            overflow-x: hidden;
            background-image: linear-gradient(to right, #111, #151515);

        }
        
        #title {
            font-size: 20px;
            color: whitesmoke;
            font-weight: bold;
            text-align: center;
            padding: 24px;
            background: #0a0a0a66;
            line-height: 1.5;
            border-bottom: 1px white solid;
        }
        
        .sidelinks {
            color: whitesmoke;     
            line-height: 2.75;   
            list-style-type:none;
            padding: 0;
            text-align: center;
            font-size: 18px;
        }
        
        .sidelinks > li:hover {
            text-decoration: underline;
            cursor: pointer;
        }
        
        .bottomlinks {
            color: whitesmoke;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            bottom: 0;
            width: 100%;
            position: absolute;
            margin: 24px auto;
        }
        
      </style>
        <script src="/session_manager.js" defer></script>

      <div id="sidebar">
        <div id="title">
            Freelance <br>Now!
        </div>
            <ul class="sidelinks">
              <li onclick="location.href='/'">Home</li>
              <li onclick="location.href='/chat'">Nachrichten</li>
              <li onclick="location.href='/contracts'">Aufträge</li>
              <li onclick="location.href='/search'">Suche</li>
            </ul>  
           <div class="bottomlinks">
                <i onclick="redirect('/profile?email=' + sessionStorage.getItem('email'))" class="material-icons md-26 link" id="person">person</i>
                <i onclick="location.href='/settings'" class="material-icons md-26 link">settings</i>
                <i onclick="unauthorize();" class="material-icons md-26 link" id="logout">logout</i>
            </div>
        </div>
        `;
    document.getElementById('person').addEventListener('click', () => redirect(`/profile?email=${sessionStorage.getItem('email')}`));
    document.getElementById('logout').addEventListener('click', unauthorize);
  }
}

customElements.define('sidebar-component', Sidebar);
