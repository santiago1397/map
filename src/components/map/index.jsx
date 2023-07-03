import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import './map.css'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  CircleMarker,
  ZoomControl
} from 'react-leaflet'
import Eta from "./eta"



import icon from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl;

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetinaUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
})

const test = new L.icon({
  iconUrl: "circulo-negro.png",
  iconSize: [15, 15]
})

L.Marker.prototype.options.icon = DefaultIcon

function ResetCenterView(props) {
  const { focus } = props;
  const map = useMap();

  useEffect(() => {
    if (focus) {
      map.setView(
        L.latLng(parseFloat(focus?.lat), parseFloat(focus?.lon)),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [focus]);

  return null;
}



export default function Map(props) {
  const { setOpsActive, focus, avTechs, job, setClosest, closest } = props
  const position = [41.872876, -87.759619]
  const [test, setTest] = useState([])
  const lmao = useRef()


  return (
    <div onClick={() => setOpsActive(false)} className="map">
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        />
        <ZoomControl position="bottomright" />


        {

          job ?
            < CircleMarker
              center={[parseFloat(job?.lat), parseFloat(job?.lon)]}
              fillColor="#EF9B0F"
              fillOpacity={1}
              color="white"
              weight={1}
              radius={5}
            >
              <Popup>
                {job.display_name}
              </Popup>
            </CircleMarker>
            :
            null

        }


        {(avTechs.length > 0) ?
          avTechs.map((item, index) => {
            const aux = item.currentJob.match(/[\x00-\x7F]/g)
            const aux2 = [...new Set(aux)]
            console.log(item.techname, aux2)
            let lmao
            if ((aux2.length === 1) && (aux2.includes(' ') || aux2.includes('\n'))) {
              lmao = "blue"
            } else if ((aux2.length === 2) && (aux2.includes(' ') && aux2.includes('\n'))) {
              lmao = "blue"
            } else if (item.currentJob == "") {
              lmao = "blue"
            } else {
              lmao = "red"
            }
            return (
              < CircleMarker
                center={[item?.lat, item?.lon]}
                pathOptions={{ fillColor: lmao }}
                fillOpacity={1}
                color="white"
                key={index}>
                <Popup>
                  <h3>{item.techname}</h3>
                </Popup>
              </CircleMarker>
            )
          })
          :
          ""
        }

        <Eta avTechs={avTechs} job={job} setClosest={setClosest} closest={closest} />


        <ResetCenterView focus={focus} />
      </MapContainer >
    </div>
  )
}
