class Sidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
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
        
      </style>
      <div id="sidebar">
        <div id="title">
            Freelance <br>Now!
        </div>
            <ul class="sidelinks">
              <li onclick="location.href='/'">Home</li>
              <li onclick="location.href='/messages'">Nachrichten</li>
              <li onclick="location.href='/contracs'">Aufträge</li>
              <li onclick="location.href='/search'">Suche</li>
            </ul>  
        </div>
    `;
    }
}

customElements.define('sidebar-component', Sidebar);
