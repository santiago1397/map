import React, { useState } from 'react'
import './menu.css'
import CircleIcon from '@mui/icons-material/Circle';
import { useParams } from "react-router-dom"
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';


export default function Menu(props) {
  const { job, closest } = props
  const { key } = useParams()

  function segsFormat(segs) {
    var hours = Math.floor(segs / 3600);
    var minutes = ((segs % 3600) / 60).toFixed(0);
    return hours + ":" + minutes;
  }

  console.log(closest)

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)

  return (
    <div className="menu">
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div className="shareModal">
          <Button variant="contained" onClick={() => Go()}>
            Share Copy
          </Button>
          <div>
            share link with a copy of all the map with techs...
          </div>
        </div>
      </Modal>
      <div className="leftSide">
        <div className="leftTop">
          <span>
            Key code:
          </span>
          {key}
        </div>
        <div className="leftBottom">
          <button className="shareBtn" onClick={handleOpen}>
            Share Copy
          </button>
        </div>
      </div>
      <div className="centerSide">
        {job ?
          <>
            <div className="centerTop">
              <span>Job address:</span> {job ? job.display_name : ""}
            </div>
            <div className="centerBottom">
              <div className="eta">
                <div className="iconTop i1">
                  <CircleIcon fontSize="inherit" />
                </div>
                Closest Available: {closest.available ? (closest.available + " - Eta: " + segsFormat(closest.avEta)) : "none available"}
              </div>
              <div className="eta">
                <div className="iconTop i2">
                  <CircleIcon fontSize="inherit" />
                </div>
                Closest Busy: {closest.busy ? (closest.busy + " - Eta: " + segsFormat(closest.buEta)) : "none busy"}
              </div>
              <div className="eta">
                <div className="iconTop i3">
                  <CircleIcon fontSize="inherit" />
                </div>
                <div>
                  Closest Appointment: {closest.appointment ? (closest.appointment + " - Eta: " + segsFormat(closest.apEta)) : "none with appt"}
                </div>
              </div>
            </div>
          </>
          : ""}
      </div>
    </div>
  )
}
