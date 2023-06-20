import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/map'
import TechOptions from './components/techOptions'
import Techs from './components/techs'
import TechsAvailable from './components/techs-available'
import SearchJob from './components/searchJob'
import Menu from './components/menu'
import Modal from '@mui/material/Modal';
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import axios from 'axios'


export const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";


function App() {
  const account = "santiago"

  const DATA = [
    {
      id: "123",
      techname: "Caio",
      address: "idk1",
      details: "idk",
      lat: "41.861625",
      lon: "-87.988492",
      appts: []
    },
    {
      id: "321",
      techname: "Gustavo",
      address: "idk2",
      details: "idk",
      lat: "41.925006",
      lon: "-88.000680",
      appts: []
    },

  ]
  const DATA1 = [
    {
      id: "1",
      techname: "Caio",
      address: "idk1",
      currentJob: "idk",
      lat: "41.861625",
      lon: "-87.988492",
      appts: []
    },
    {
      id: "2",
      techname: "Gustavo",
      address: "idk2",
      currentJob: "idk",
      lat: "41.925006",
      lon: "-88.000680",
      appts: []
    },

  ]
  const BASEURL =  import.meta.env.VITE_BASE_URL

  const [details, setDetails] = useState()
  const [focus, setFocus] = useState()
  const [job, setJob] = useState()
  const [avTechs, setAvTechs] = useState(DATA1)
  const [techs, setTechs] = useState(DATA)
  const [opsActive, setOpsActive] = useState(false)
  const [techDisplay, setTechDisplay] = useState(true)
  const [closest, setClosest] = useState({ busy: undefined, available: undefined })
  const [insertKey, setInsertKey] = useState("")
  const { key } = useParams()
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {}



  const Go = async(key) =>{
    if(key){
      try{
        await axios.post(BASEURL +"api/acc" , {key: key})
      }catch(err){
        console.log(err)
      }

      navigate(`/${key}`)
      navigate(0)
    }else{
      let lmao = crypto.randomUUID();
      console.log(lmao)
      console.log(BASEURL + "api/acc")
      try{
        await axios.post(BASEURL +"api/acc" , {key: lmao})
      }catch(err){
        console.log(err)
      }

      navigate(`/${lmao}`)
      navigate(0)
    }
  }

  useEffect(() => {
    const getData = async() =>{
      console.log(key)
      const data = await axios.get(BASEURL +"api/avtechs/" + key )
      console.log("la data", data.data)
      setAvTechs(data.data)
    }

    getData()
  }, [])


  useEffect(() => {
    const validate = async() =>{
      if (key){
        const res = await axios.get(BASEURL +"api/acc/" +  key)
        if(res.data == "err"){
          navigate(`/`)
          navigate(0)
        }
      }

    }
    validate()
  }, [])

  useEffect(() => {
    if (key) {
      setOpen(false)
    }
  }, [])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div className="keyGenerator">
          <h3>
            You need a key for using the software
          </h3>
          <div className="insertContainer">
            <div>
              Insert Key:
            </div>
            <input type="text" value={insertKey} onChange={(e)=>setInsertKey(e.target.value)}/>
            <button onClick={()=>Go(insertKey)}>
              Go
            </button>
          </div>
          <div>
            <Button variant="contained" onClick={()=>Go()}>
              Generate new Key
            </Button>
          </div>
        </div>
      </Modal>
      <div>
        <Menu job={job} closest={closest} />
      </div>
      <div className="content-container">
        <div className="techSection">
          {
            /* techDisplay ?
            <Techs  setOpsActive={setOpsActive} /> :
            <TechsAvailable  /> */
          }
          <SearchJob setFocus={setFocus} setJob={setJob} />
          <div className="select">
            <div
              className={techDisplay ? "viewoption techs" : "viewoption techs active"}
              onClick={() => { setTechDisplay(false) }}>
              Techs
            </div>

            <div
              className={techDisplay ? "active viewoption available-techs " : "viewoption available-techs"}
              onClick={() => { setTechDisplay(true) }}>
              Available Techs
            </div>
          </div>
          {techDisplay ?
            <TechsAvailable
              setOpsActive={setOpsActive}
              avTechs={avTechs}
              setAvTechs={setAvTechs}
              setFocus={setFocus}
            /> :
            <Techs
              setOpsActive={setOpsActive}
              techs={techs}
              setTechs={setTechs}
              avTechs={avTechs}
              setAvTechs={setAvTechs}
            />}

        </div>
        <TechOptions
          opsActive={opsActive}
          setOpsActive={setOpsActive}
          avTechs={avTechs}
          setAvTechs={setAvTechs}
          setFocus={setFocus}
          techs={techs}
          setTechs={setTechs}
        />
        <Map
          setOpsActive={setOpsActive}
          job={job}
          focus={focus}
          avTechs={avTechs}
          setClosest={setClosest}
          closest={closest}
        />
      </div>
    </div>
  )
}

export default App
