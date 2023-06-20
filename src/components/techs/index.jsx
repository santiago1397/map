import React, {useState} from 'react'
import './techs.css'
import SearchTech from '../searchTech'
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import CircleIcon from '@mui/icons-material/Circle';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


export default function Techs(props) {
  const { setOpsActive, techs, setTechs, setAvTechs, avTechs } = props


  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...techs];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      return setTechs(reorderedStores);
    }

    return
  }

  function toAvailable(index){
    let aux = {...techs[index]}
    delete aux.details
    setAvTechs([...avTechs, {...aux, currentJob: ""} ])
  }

  return (
    <div className="techsAvailable">
      <SearchTech placeholder={"Add Tech address"} items={techs} setItems={setTechs}  ops={0}/>
      <div>
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <Droppable droppableId="items" type="group">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <List component="nav" aria-label="main mailbox folders">
                  {techs.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <li className="tech" onClick={() => setOpsActive(item)}>
                            <div className="icon">
                              <CircleIcon fontSize="inherit" />
                            </div>
                            <div className="label">
                              {item.techname}
                            </div>
                            <div className="addmap" onClick={()=>toAvailable(index)}>
                              map+
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
        
      </div>
    </div>
  )
}


{/* <List component="nav" aria-label="main mailbox folders">
          <li className="tech" onClick={() => setOpsActive(true)}>
            <div className="icon">
              <CircleIcon fontSize="inherit" />
            </div>
            <div className="label">
              Caio
            </div>
            <div className="addmap">
              map+
            </div>
          </li>
          <Divider />

          <li className="tech">
            <div className="icon">
              <CircleIcon fontSize="inherit" />
            </div>
            <div className="label">
              Gustavo
            </div>
            <div className="addmap">
              map+
            </div>
          </li>
          <Divider />
        </List> */}