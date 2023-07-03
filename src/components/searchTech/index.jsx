import React, { useState, useEffect } from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox';
import './searchTech.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { NOMINATIM_BASE_URL } from '../../App';
import { useDebounce } from "@uidotdev/usehooks";
import axios from 'axios'
import {useParams} from 'react-router-dom'
import mongoose from 'mongoose'

export default function SearchTech(props) {
  const BASEURL =  import.meta.env.VITE_BASE_URL
  const { key } = useParams()
  const [searchText, setSearchText] = useState("")
  const [listPlace, setListPlace] = useState([]);
  const [show, setShow] = useState(false)
  const { placeholder, items, setItems, setFocus, ops } = props
  const debouncedSearchTerm = useDebounce(searchText, 300);

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

  function HandleChange( value) {
    setSearchText(value)
    /* getAddrs(value) */
  }

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  useEffect(() => {
    console.log("lol?")
    const searchHN = async () => {
      const params = {
        q: debouncedSearchTerm,
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
        .catch((err) => console.log("err: ", err))
    };

    searchHN();
  }, [debouncedSearchTerm]);

  return (
    <div className="searchTech">
      <form action="">
        <div style={{ flex: "1" }} >

          <input style={{ width: "100%" }} type="text" placeholder={placeholder}
            onChange={(e) => HandleChange(e.target.value)}
            onFocus={() => setShow(true)}
            onBlur={async () => { await timeout(200); setShow(false) }}
          />
          <ul className={show ? "opsList" : "notShow"} >
            {listPlace.map((place, index) => (
              <li onClick={async() => {
                const randId = crypto.randomUUID()
                let lol = new mongoose.Types.ObjectId()
              
                if (ops){
                  await axios.post(BASEURL +"api/avtechs/" ,{
                    _id: lol,
                    key: key,
                    techname: searchText,
                    address: place.display_name,
                    currentJob: "",
                    lat: place.lat,
                    lon: place.lon,
                  })


                  setItems([...items, {
                    _id: lol,
                    techname: searchText,
                    address: place.display_name,
                    currentJob: "",
                    lat: place.lat,
                    lon: place.lon,
                    appts: []
                  }])
                }else{
                  setItems([...items, {
                    id: randId,
                    techname: searchText,
                    address: place.display_name,
                    details: "",
                    lat: place.lat,
                    lon: place.lon,
                    appts: []
                  }])
                }
                setFocus? setFocus(place): ""
              }}>
                <LocationOnIcon fontSize='14px' />
                {place?.display_name}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" >
          <AddBoxIcon fontSize="inherit" />
        </button>
      </form>
    </div>
  )
}
