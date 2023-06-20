import React, { useState, useEffect, useRef } from 'react'
import './searchJob.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { NOMINATIM_BASE_URL } from '../../App';
import { useDebounce } from "@uidotdev/usehooks";




export default function SearchJob(props) {
  const { setFocus, setJob } = props
  const [searchText, setSearchText] = useState("")
  const [listPlace, setListPlace] = useState([]);
  const [show, setShow] = useState(false)
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

  function HandleChange(value) {
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
    <div className="searchJob">
      <form action="">
        <div style={{ flex: "1" }} >
          <input style={{ width: "100%" }} type="text" placeholder="Search new Job"
            onChange={(e) => HandleChange(e.target.value)}
            onFocus={() => setShow(true)}
            onBlur={async () => { await timeout(200); setShow(false) }}
          />
          <ul className={show ? "opsList" : "notShow"} >
            {listPlace.map((place, index) => (
              <li key={index} onClick={() => { setFocus(place); setJob(place) }}>
                <LocationOnIcon fontSize='14px' />
                {place?.display_name}
              </li>
            ))}
          </ul>
        </div>


        <button type="submit" disabled={true} >
          lmao
        </button>
      </form>
    </div>
  )
}
