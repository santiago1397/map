import React, { useState, useEffect } from 'react'
import './techOptions.css'
import CloseIcon from '@mui/icons-material/Close';
import SearchTech from '../searchTech'
import useAutocomplete from '@mui/material/useAutocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { NOMINATIM_BASE_URL } from '../../App';
import axios from 'axios'
import { keyframes } from '@emotion/react';

export default function TechOptions(props) {
  const BASEURL = import.meta.env.VITE_BASE_URL
  const { opsActive, setOpsActive, avTechs, setAvTechs, setFocus, techs, setTechs } = props
  const [techDisplay, setTechDisplay] = useState(false)
  const [appts, setAppts] = useState([])
  const [listPlace, setListPlace] = useState([]);
  const [count, setCount] = useState(0)
  const [opstId, setOpsId] = useState()

  const [name, setName] = useState()
  const [address, setAddress] = useState()
  const [job, setJob] = useState()

  const [show, setShow] = useState(false) //experimental

  useEffect(() => {
    const showArr = []

    if (opsActive._id !== opstId) {
      opsActive ?
        opsActive.appts.map((item, index) => showArr.push({
          _id: item._id,
          show: false,
        },)) : ""

      console.log("show arr", showArr)
      setAppts(showArr)

    } else {
      opsActive ?
        opsActive.appts.map((item, index) => showArr.push({
          _id: item._id,
          show: appts ? appts[index].show : false,
        },)) : ""

      console.log("show arr", showArr)
      setAppts(showArr)
    }



  }, [opsActive])

  useEffect(() => {

    setName(opsActive.techname)
    setAddress(opsActive.address)
    setOpsId(opsActive._id)
    opsActive.details ?
      setJob(opsActive.details) :
      setJob(opsActive.currentJob)
  }, [opsActive])

  async function changeObjects(field, value, key) {
    console.log(value)

    try {
      if (opsActive.hasOwnProperty('details')) {
        let newArr = [...techs];
        let aux = newArr.findIndex((obj => obj._id == key));
        newArr[aux][field] = value;
        setTechs(newArr)
      } else {


        let newArr = [...avTechs];
        let aux = newArr.findIndex((obj => obj._id == key));
        newArr[aux][field] = value;

        await axios.put(BASEURL + "api/avtechs/" + key, newArr[aux])
        setAvTechs(newArr)
      }
    } catch (err) {
      console.log(err)
    }

  }

  async function deleteTech(key) {


    if (opsActive.hasOwnProperty('details')) {
      let newArr = [...techs]
      let aux = newArr.findIndex((obj => obj.id == key));
      newArr.splice(aux, 1)
      setTechs(newArr)

    } else {
      try {
        await axios.delete(BASEURL + "api/avtechs/" + key)
      } catch (err) {
        console.log(err)
      }


      let newArr = [...avTechs]
      let aux = newArr.findIndex((obj => obj._id == key));
      newArr.splice(aux, 1)
      setAvTechs(newArr)
    }

  }

  async function addApp(key) {
    //envio la peticion a la bd 

    const response = await axios.post(BASEURL + "api/appts/", { techname: key })

    //actualizo los datos locales
    var arr = [
      {
        _id: response.data._id,
        show: false,
      },
      ...appts
    ]
    setAppts(arr)



    const newOps = {
      ...opsActive, appts: [{
        _id: response.data._id,
        techname: key,
        address: "",
        time: "",
        description: "",
        lat: "",
        lon: "",
      }, ...opsActive.appts]
    }
    setOpsActive(newOps)

    let newArr = [...avTechs]
    let aux = newArr.findIndex((obj => obj._id == key));
    newArr[aux].appts = newOps.appts

    setAvTechs(newArr)

    setCount(count + 1)

  }

  async function changeApptField(field, index, key, value) {
    const newarr = [...opsActive.appts]
    console.log("antes", newarr[index][field])
    newarr[index][field] = value
    setOpsActive({ ...opsActive, appts: [...newarr] })
    console.log("despues", newarr[index][field])

    console.log(index)
    console.log(opsActive)

    let newArr = [...avTechs]
    let aux = newArr.findIndex((obj => obj._id == key));
    newArr[aux].appts[index][field] = value

    const response = await axios.put(BASEURL + "api/appts/" + opsActive.appts[index]._id,
      { ...newArr[aux].appts[index] })

    console.log(response)
    console.log("url", BASEURL + "api/appts/" + opsActive.appts[index]._id)
    console.log("field", field)
    console.log("value", value)

    setAvTechs(newArr)
  }

  async function changeAddress(address, lat, lon, key) {
    console.log("new address", avTechs)

    try {
      if (opsActive.details) {
        let newArr = [...techs]
        let aux = newArr.findIndex((obj => obj._id == key));
        newArr[aux].lat = lat
        newArr[aux].lon = lon
        newArr[aux].address = address
        setTechs(newArr)
      } else {
        let newArr = [...avTechs]
        let aux = newArr.findIndex((obj => obj._id == key));
        newArr[aux].lat = lat
        newArr[aux].lon = lon
        newArr[aux].address = address
        await axios.put(BASEURL + "api/avtechs/" + key, newArr[aux])
        setAvTechs(newArr)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function deleteApp(index, key) {
    //envio la peticion a la bd 
    console.log(opsActive.appts[index]._id)
    const response = await axios.delete(BASEURL + "api/appts/" + opsActive.appts[index]._id)

    //actualizo los datos locales
    var arr = [...appts]
    arr.splice(index, 1)
    setAppts(arr)

    const newOps = [...opsActive.appts]
    newOps.splice(index, 1)
    setOpsActive({ ...opsActive, appts: newOps })

    let newArr = [...avTechs]
    console.log(newOps)
    let aux = newArr.findIndex((obj => obj._id == key));
    console.log(key)
    newArr[aux].appts = [...newOps]
    console.log("arr: okok" + newArr[aux].appts)
    setAvTechs(newArr)


    console.log("all good?")
  }

  function getAddrs(value) {
    const params = {
      q: value,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    console.log(queryString)
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        setListPlace(JSON.parse(result));
      })
      .catch((err) => console.log("err: ", err));
  }

  function HandleChange(value) {
    getAddrs(value)
  }

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }


  return (
    <div className={opsActive ? "techOptionsActive" : "techOptionsDesactive"}>
      <div className="techOptions">
        <div className="topWrapper">
          <h3>{techDisplay ? "Appointments" : "Tech Details"}</h3>
          <div
            className="crossIcon"
            onClick={() => { setOpsActive(false) }}>
            <CloseIcon />
          </div>
        </div>

        <div className="selectDetails">
          <div
            className={techDisplay ? "viewoption techDetails" : "viewoption techDetails active"}
            onClick={() => { setTechDisplay(false) }}>
            Tech Details
          </div>

          <div
            className={techDisplay ? "active viewoption appDetails " : "viewoption appDetails"}
            onClick={() => { setTechDisplay(true) }}>
            Appointments
          </div>
        </div>


        {techDisplay ?

          <div className="apptsDetails">
            {opsActive.details ? "" :
              <div className="btnWrapper">
                <button className="addBtn" onClick={() => addApp(opsActive._id)}> Add Appt +</button>
              </div>}
            <ul className="appts">
              {opsActive.appts?.map((appt, index) =>
                <li key={index}>
                  <div className="apptsAddress" >
                    <input className="field" type="text" placeholder="address"
                      onChange={(e) => {
                        HandleChange(e.target.value);
                        let newArr = [...appts];
                        newArr[index].show = true
                        setAppts(newArr)

                        newArr = [...opsActive.appts]
                        newArr[index].address = e.target.value
                        setOpsActive({ ...opsActive, appts: [...newArr] })
                      }}
                      onBlur={async () => {
                        await timeout(200);
                        let newArr = [...appts];
                        newArr[index].show = false
                        setAppts(newArr)
                      }}
                      value={opsActive.appts[index].address}
                    />
                    <div style={{ position: "relative" }}>

                      <ul className={appts[index]?.show ? "opsList" : "notShow"} >
                        {listPlace.map((place) => (
                          <li key={place.place_id} onClick={() => {
                            changeApptField("address", index, opsActive._id, place.address.postcode || place.display_name);
                            changeApptField("lat", index, opsActive._id, place.lat);
                            changeApptField("lon", index, opsActive._id, place.lon)
                          }}>
                            <LocationOnIcon fontSize='14px' />
                            {place?.display_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <input className="field" placeholder="time" type="text"
                    value={appt.time}
                    onChange={(e) => { changeApptField("time", index, opsActive._id, e.target.value) }} />
                  <textarea className="textarea" name="" id="" rows="8"
                    value={appt.description}
                    onChange={(e) => { changeApptField("description", index, opsActive._id, e.target.value) }} />
                  <div className="btnWrapper">
                    <button className="deleteBtn" onClick={() => { deleteApp(index, opsActive.id) }}>
                      Delete app
                    </button>
                  </div>
                </li>
              )}

            </ul>

          </div>
          :
          <div >
            <form className="fields">
              <label htmlFor="name">Name:</label>
              <input className="nameInput" id="name" type="text" placeholder="Tech Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  changeObjects("techname", e.target.value, opsActive._id)
                }}
                onBlur={(e) => changeObjects("techname", e.target.value, opsActive._id)}
              />
            </form>

            <div className="techFields" style={{ flex: "1" }} >
              <form className="fields">
                <label htmlFor="adress">Address:</label>
                <input
                  className="nameInput"
                  id="adress"
                  style={{ width: "100%" }}
                  value={address}
                  type="text"
                  placeholder="tech address"
                  onChange={(e) => {
                    setAddress(e.target.vale)
                    HandleChange(e.target.value);
                  }}
                  onFocus={() => setShow(true)}
                  onBlur={async () => { await timeout(200); setShow(false) }}
                />
              </form>

              <ul className={show ? "opsList" : "notShow"} >
                {listPlace.map((place, index) => (
                  <li key={index}
                    onClick={() => {
                      setAddress(place.display_name)
                      setFocus(place)
                      changeAddress(place.display_name, place.lat, place.lon, opsActive._id)
                    }}>
                    <LocationOnIcon fontSize='14px' />
                    {place?.display_name}
                  </li>
                ))}
              </ul>

            </div>



            <div className="currentJob">
              <label htmlFor="job">{opsActive.details ? "Details:" : "Current Job:"}</label>
              <textarea
                id="job"
                className="jobDetails"
                type="text"
                rows={8}
                value={job}
                onChange={(e) => {
                  setJob(e.target.value);
                  opsActive.details ?
                    changeObjects("details", e.target.value, opsActive._id) :
                    changeObjects("currentJob", e.target.value, opsActive._id)
                }}
                onBlur={(e) => {
                  opsActive.details ?
                    changeObjects("details", e.target.value, opsActive._id) :
                    changeObjects("currentJob", e.target.value, opsActive._id)
                }}
              />
            </div>

            <button className="deleteTechBtn"
              onClick={() => { deleteTech(opsActive._id); setOpsActive(false); }}>
              Delete Marker
            </button>
          </div>



        }


      </div>
    </div>
  )
}
