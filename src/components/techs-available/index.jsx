import React, { useState, useEffect } from 'react'
import './techsAvailable.css'
import SearchTech from '../searchTech'
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import CircleIcon from '@mui/icons-material/Circle';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Modal from '@mui/material/Modal';
import { DataGrid } from "@mui/x-data-grid";


export default function TechsAvailable(props) {
  const { setOpsActive, avTechs, setAvTechs, setFocus } = props
  const  [gridData, setGridData] = useState()


  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...avTechs];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      return setAvTechs(reorderedStores);
    }

    return
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  }

  const columns = [

    {
      field: "status",
      headerName: "Status",
      width: 60,
      align: 'center',
      renderCell: (params) => {
        let color
        params?.row.currentJob ? color = "red" : color = "blue"

        return (
          <div className={color}>
            <CircleIcon fontSize="inherit" />
          </div>
        )
      }
    },
    {
      field: "techname",
      headerName: "Tech",
      width: 80,
    },
    {
      field: "address",
      headerName: "Current Address",
      width: 240,
      renderCell: (params) => {
        return <div style={{ color: "gray", fontSize: "0.9em" }}>{params?.row.address}</div>
      }
    },
    {
      field: "age",
      headerName: "Appointments",
      width: 400,
      align: 'left',
      renderCell: (params) => {
        console.log(params.row)
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            {params?.row.appts.map((app) => {
              return (
                <div>
                  <div>
                    {app.time}
                  </div>
                  <div className="address">
                    {app.address}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    },
  ];

  useEffect(() => {
    const newArr = []
    avTechs.map((item, index)=>{
      newArr.push({...item, id: item._id})
    })

    for(let i=0; i<newArr.length; i++) {
      for(let j=0; j<newArr[i].appts.length; j++){
        newArr[i].appts[j] = {...newArr[i].appts[j], id: newArr[i].appts[j]._id}
      }
    }
    
    console.log("firstArr", avTechs)
    console.log("newArr",newArr)

    setGridData(newArr)

  }, [avTechs])

  return (
    <div className="techsAvailable">
      <SearchTech
        placeholder={"Add Tech address"}
        items={avTechs}
        setItems={setAvTechs}
        setFocus={setFocus}
        ops={1}
      />

      <Modal
        open={open}
        onClose={handleClose}
      >
        <div className="tableContainer">
          <DataGrid rows={avTechs} columns={columns}  getRowId={(row) => row._id} hideFooterPagination />
        </div>
      </Modal>

      <DragDropContext onDragEnd={handleDragAndDrop}>
        <Droppable droppableId="items" type="group">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List
                component="nav"
                aria-label="main mailbox folders"
              >
                {avTechs.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <li className="tech" onClick={() => { setOpsActive(item); setFocus(item) }}>
                          <div className={item.currentJob == "" ? "techIcon1" : "techIcon"}>
                            <CircleIcon fontSize="inherit" />
                          </div>
                          <div>
                            {item.techname}
                          </div>
                        </li>
                        <Divider />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="listJobs" onClick={handleOpen}>
        List all Jobs
      </div>
    </div>
  )
}
