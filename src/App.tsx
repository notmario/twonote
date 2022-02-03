import {useEffect, useState} from 'react';

function App() {
  const [note, setNote] = useState('Untitled note');
  const [newNoteName, setNewNoteName] = useState('');
  const [text, setText] = useState('');
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // add note to local storage
    if (note === 'Untitled note') return;
    if (text === '') localStorage.removeItem('twonote'+note)
    localStorage.setItem('twonote'+note, text);
  }, [text]);
  useEffect(() => {
    // get note from local storage
    const noteText = localStorage.getItem('twonote'+note);
    if (noteText !== null) {
      setText(noteText);
    } else {
      setText('');
    }
  }, [note]);
  useEffect(() => {
    // get recent notes from local storage
    const recentNotes = localStorage.getItem('twonoteRecentNotes');
    if (recentNotes !== null) {
      setRecentNotes(JSON.parse(recentNotes));
    }
  }, []);
  useEffect(() => {
    // save recent notes to local storage
    localStorage.setItem('twonoteRecentNotes', JSON.stringify(recentNotes));
  }, [recentNotes]);
  return (
    <div className="App">
      <aside style={{transform: sidebarOpen ? "translateX(0vw)" : "translateX(-20vw)", textAlign: "center"}}>
        <h1>Twonote</h1>

        <br />

        <h4>New note</h4>
        Enter a name for your note:
        <input
          type="text"
          style={{width: "100%", textAlign: "center", color: 'white', backgroundColor: "#36393F", border: "none", outline: "none"}}
          value={newNoteName}
          onChange={(e) => setNewNoteName(e.target.value)}
        />
        <button style={{backgroundColor: (newNoteName === '' || newNoteName === 'RecentNotes') ? "#9CA9D9" :"#7289DA", padding: ".5rem", margin: ".5rem", borderRadius: ".5rem"}} onClick={()=>{
          if (newNoteName === '') return;
          setNote(newNoteName);
          if (recentNotes.indexOf(newNoteName) === -1) {
            setRecentNotes([newNoteName, ...recentNotes].slice(0,9));
          }
          setNewNoteName('');
        }} disabled={newNoteName === '' || newNoteName === 'RecentNotes'}>{newNoteName === 'RecentNotes' ? "Nice try" :"Make the note!"}</button>
        <br /><br />
        <h4>Recent notes</h4>
        {recentNotes.map((note, i) => <button key={i} style={{backgroundColor: "#7289DA", padding: ".5rem", margin: ".5rem", borderRadius: ".5rem"}} onClick={()=>{
          setNote(note);
          setRecentNotes([note, ...(recentNotes.filter((n)=>n!==note))]);
        }}>{note}</button>)}
        <br /><br />
        <button style={{backgroundColor: "#EC2023", padding: ".5rem", margin: ".5rem", borderRadius: ".5rem"}} onClick={()=>{setRecentNotes([])}}>Clear recent notes</button>
        <br /><br />
        <h5>All notes</h5>
        {Object.keys(localStorage).filter((key)=>key.startsWith('twonote') && key !== "twonoteRecentNotes").map((key)=>{
          return <button key={key} style={{backgroundColor: "#7289DA", padding: ".5rem", margin: ".5rem", borderRadius: ".5rem"}} onClick={()=>{
            setNote(key.slice(7));
            setRecentNotes([key.slice(7), ...(recentNotes.filter((n)=>n!==key.slice(7)))]);
          }}>{key.slice(7)}</button>
        })}
        <br />
        <br />
        <br />
        <br />
        <button style={{backgroundColor: "#EC2023", padding: ".5rem", margin: ".5rem", borderRadius: ".5rem"}} onClick={()=>{
          setRecentNotes([]);
          // clear local storage keys that start with 'twonote'
          Object.keys(localStorage).filter((key)=>key.startsWith('twonote')).forEach((key)=>{
            localStorage.removeItem(key);
          })
          setNote('Untitled note');
          setText('');
        }}>Delete ALL notes (not recommended)</button>
      </aside>
      <nav>
        <button id="sidebarButton" onClick={() => setSidebarOpen(!sidebarOpen)} style={{transform: sidebarOpen ? "translateX(20vw)" : "translateX(0vw)"}}>
          <img src="burger.png" alt="burger menu" />
        </button>
        Twonote - {note} - {text.length > 1000 ? Math.floor(text.length/100)/10 + "k" : text.length} characters
      </nav>
      <textarea id="writingArea" value={text} onChange={(event)=>{
        setText(event.target.value);
      }} placeholder={note === "Untitled note" ? '☝ You should make a new note, your changes are not being saved!' : 'Write something here! Your changes are automatically saved!'}/>
    </div>
  );
}

export default App;
