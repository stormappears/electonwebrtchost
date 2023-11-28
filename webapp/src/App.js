import io from 'socket.io-client'
import  Peer  from 'peerjs';
import { useState ,useRef , useEffect} from 'react'
import './App.css'

const electron = window.electron;

//socket io connection address
const  socket = io.connect("https://ivoryleostarvipon.onrender.com/")

// esablish new peer instance here we generate our id
const peer = new Peer();



function App() {

    

  // states and refs for peer js
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);



  // states and refs for socket io
  const inputValue = useRef(null)
  const inputRoom = useRef(null)
  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [messageReceived, setMessageReceived] = useState("");
  const [mouseclick, setMouseclick] = useState("");
  const [isMouseHide, setIsMouseHide] = useState(false);
  const [enableToggler, setEnableToggler] = useState(false);

//popup const html ids
const controllerPinElement = document.getElementById("controlpin");
const controllerElement = document.getElementById("controller");
const bgement = document.getElementById("bg");
const controllerPanel = useRef(null);
const controllerPinRef = useRef(null);
const [ isMouseOnPanel , setIsMouseOnPanel ] = useState(false)







   // Join Room Function

   function joinRoom (){
    if( room !== ""){
      socket.emit("join_room" , room)
    }
    getStream2(room)
    // var elementr = document.getElementById('remscreen');
    //     elementr.style.cursor = 'none'
    // document.getElementById('remscreen').style.cursor = 'url(' + myCursor + ')';
    // document.getElementById("remscreen").style.cursor =  ' url("./assets/cursor.png") 24 24, auto'  

  }

  function sendMessage(){
    socket.emit("send_message", { message ,  room })
  }


  // 

  //Mouse ClickL Event
  const handleMouseClick = ({
    clientX,
    clientY,
  }) =>{
    //scr element
const screlement = document.getElementById('remscreen');
const clientWidth = screlement.offsetWidth;
const clientHeight = screlement.offsetHeight;

      socket.emit("mouseclickl" , {
        clientX,
        clientY,
        clientWidth,
        clientHeight,
        // clientWidth: window.innerWidth,
        // clientHeight: window.innerHeight,
        room,
      })
  }
  
  //Mouse ClickR Event

  // function mouseClickR(){
  //   socket.emit("mouseclickr" , {  room })
  // }


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      console.log(data.message)
    }); 
    
    //mouse click left (listener)
    socket.on("mouse_clickl_recive", (data) => {
      console.log("mouse clicked left")
    });  
    
    //mouse click right (listener)
    socket.on("mouse_clickr_recive", (data) => {
      console.log("mouse clicked: right  ")
    });   
    
    
    //mouse click right (listener)
    socket.on("mouse_cord", (data) => {
      console.log("mouse x : "  + data.mousex + "mouse y : " + data.mousey)
    }); 
    
    //mouse togg left (listener)
    socket.on("mousetogg_send", (data) => {
      console.log("mouse x : "  + data.mousex + "mouse y : " + data.mousey)
    });



  }, [socket]);


 
  // useEffect(()=>{
  //   const remScreenElement = document.getElementById("remscreen")

  //   remScreenElement.addEventListener('mousemove', (event) => {
  //     const currentX = event.clientX 
  //     const currentY = event.clientY 
  //     console.log("mouse hover")

  //     socket.emit("mousecord", {
  //       mousex : currentX,
  //       mousey : currentY ,
  //       room 

  //     } )
  //   })
  // })


  // useeffect hook for peer js starts
  useEffect(() => {

    const getStream = async (screenId) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: "screen:0:0",
            },
          },
        });
        console.log(stream + "hey its running i am in get stream");
        handleStream(stream);
      } catch (e) {
        console.log(e);
      }
    };

         // get screen id
         electron.getScreenId((event, screenId) => {
          console.log(screenId);
          // getStream(screenId);
        });



    const handleStream = (stream) => {

    //Generate and set peer id
    peer.on('open', (id) => {
      setPeerId(id);
    });

    // call peer function
    peer.on('call', (call) => {


      currentUserVideoRef.current.srcObject = stream;
      currentUserVideoRef.current.play();


      call.answer(stream);

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();

        });

      })
      
        peerInstance.current = peer;
        var conn = peer.connect(remotePeerIdValue);

              //let { width, height } = stream.getVideoTracks()[0].getSettings();
      //electron.setSize({ width, height });
      currentUserVideoRef.current.srcObject = stream;
      currentUserVideoRef.current.onloadedmetadata = (e) =>
      currentUserVideoRef.current.play();


    };

     getStream();

  }, [])


  // function for calling peer

 

  const getStream2 = async (room) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: "screen:0:0",
          },
        },
      });
      console.log(stream + "hey its running i am in get stream");
      // handleStream2(stream);


      const call = (remotePeerId) => {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, stream);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          document.getElementById("remscreen").style.position = "absolute"
        });
      }

      call(room)


    } catch (e) {
      console.log(e);
    }
  };

  











  function handleRoomInputChange(event) {
    console.log(event.target.value);
    setRoom(event.target.value)
  }

  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

// basic sampling code
  // const handleMouseMove = ({
  //   clientX, clientY
  // }) => {
  //   console.log(clientX , clientY)
  //   socket.emit('mousecord', {
  //     clientX, clientY,
  //     clientWidth: window.innerWidth,
  //     clientHeight: window.innerHeight,
  //     room 
  //   })
  // }

  function handlesamplethress(event){
    localStorage.setItem("sampling_thresold", event.target.value);
  }


  // code with sampling thresold
  const samplingThreshold = localStorage.getItem("sampling_thresold") || 100; // milliseconds
  let timer = null;
  
  const handleMouseMove = ({
    clientX,
    clientY,
  }) => {
    
    if (!timer) {
      //scr element
const screlement = document.getElementById('remscreen');
const clientWidth = screlement.offsetWidth;
const clientHeight = screlement.offsetHeight;
      console.log(clientWidth);
      console.log(clientHeight);
      timer = setTimeout(() => {
        console.log(clientX, clientY);
        socket.emit('mousecord', {
          clientX,
          clientY,
          clientWidth,
          clientHeight,
          isMouseHide,
          enableToggler,
          // clientWidth: window.innerWidth,
          // clientHeight: window.innerHeight,
          room,
        });
        timer = null;
      }, samplingThreshold);
    }
  };


  
// click and hold mouse events
let hold ;

// mouse down (hold)
  const handleMouseDown = () =>{
    hold = true;
    console.log("Hey mouse holded")
    socket.emit('mousetogg', { hold ,room});
  }

  //mouse up (release)
  const handleMouseUp = () =>{
    hold = false;
    socket.emit('mousetogg', { hold ,room});
  }



// key press event

useEffect(()=>{
  document.addEventListener('keydown' , handleKeyDown , true)
})
const handleKeyDown = (e) => {
  let key = e.key;
  console.log(key)
  socket.emit('qwert_keys', { key ,room});
};

const handleChange = () => {
  setIsMouseHide(!isMouseHide);
};

console.log(isMouseHide)


  return (
  <> 
  <div id="bg" onMouseLeave={()=>{
  }}>

  <div className="controlpin" id="controlpin"  ref={controllerPinRef} onClick={()=>{
      controllerPanel.current.style.visibility = "visible"
      controllerPinRef.current.style.visibility = "hidden"
      controllerPanel.current.style.zIndex = "10"
      controllerPinRef.current.style.zIndex = "8"
    }
       
 } >  </div>

  <div className="controller" id="controller" ref={controllerPanel} onMouseEnter={()=>{setIsMouseOnPanel(true)}} onMouseLeave={()=>{
  }} > 
    <input type="text" id='roomInput' ref={inputRoom} onChange={handleRoomInputChange} />
    <button onClick={joinRoom} id='connect_user' >Connect User </button>
      {/* <input type="text" id='input' ref={inputValue} onChange={(e)=>{ setMessage(e.target.value)}} placeholder='enter message ' /> */}
      {/* <button onClick={sendMessage} >Send Message</button> */}
      <div className='samplethressdiv'>
      <input type="text" id='samplethres'onChange={handlesamplethress}  placeholder='sampling thresold'/>
      <label htmlFor="samplethres">Sampling Thresold</label>
      </div>
      <div className='disablemousecdiv'>
      <input type="checkbox" id='myCheckbox' label="Disable Client Mouse" checked={isMouseHide} onChange={handleChange} />
      <label htmlFor="myCheckbox">Disable Client Mouse</label>
      </div>
      <div className='changeCtrlPos'>
          <button onClick={()=>{
            document.getElementById("controlpin").style.cssText = "right: 1200px";
          }}>Left</button>
          <button onClick={()=>{
          document.getElementById("controlpin").style.cssText = "left: 1200px";
          }}>Right</button>
      </div>
      <div className='toggerdiv'>
        <button className='toggerdiv_button' onClick={()=>{
          if(enableToggler == false){
            setEnableToggler(true)
          }else{
            setEnableToggler(false)
          }
        }}>Mouse Toggler</button>
      </div>
      <button className='closepenlbtn' onClick={()=>{
    controllerPanel.current.style.visibility = "hidden"
    controllerPinRef.current.style.visibility = "visible"
  }}> close panel</button>
      
  </div>



 
      <video id="remscreen"     onMouseMove={handleMouseMove} onMouseDown={handleMouseDown}   onMouseUp={handleMouseUp}      onClick={handleMouseClick} ref={remoteVideoRef} onContextMenu={(event) => {
      if (event.button === 2) {
        event.preventDefault()
        socket.emit("mouseclickr" , {  room })
        console.log('You right-clicked on the element!');
      }
    }}/>

      <video id="myscreen" ref={currentUserVideoRef} />

      </div>
     
    </>
  )
}

export default App