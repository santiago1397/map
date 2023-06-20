import { useEffect } from 'react'
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


export default function Eta(props) {
  const { avTechs, job, setClosest, closest } = props
  const map = useMap();
  var closestAv = { avEta: 9999999999999999999999, available: "" };
  var closestBu = { buEta: 9999999999999999999999, busy: "" };
  var closestAp = { apEta: 9999999999999999999999, appointment: "" };
  var full = {}

  useEffect(() => {

    if (!map) return;

    if ((avTechs.length > 0) && job) {

      avTechs.forEach((element) => {

        const routingControl = L.Routing.control({
          waypoints: [L.latLng(element.lat, element.lon), L.latLng(job.lat, job.lon)],
          routeWhileDragging: true,
          show: false,
          fitSelectedRoutes: false,
          lineOptions: {
            addWaypoints: false,
            styles: [
              { display: "none", color: 'black', opacity: 1, weight: 9 },
              { display: "none", color: 'white', opacity: 1, weight: 6 },
              { display: "none", visibility: "hidden", color: 'red', opacity: 1, weight: 2 }],
          }
        }).addTo(map);


        routingControl.on(
          "routesfound",
          function (e) {
            if (element.currentJob == "") {
              if (e.routes[0].summary.totalTime < closestAv.avEta) {
                closestAv = { avEta: e.routes[0].summary.totalTime, available: element.techname }
                setClosest({ ...closestBu, ...closestAp, available: element.techname, avEta: e.routes[0].summary.totalTime })
              }
            } else {
              if (e.routes[0].summary.totalTime < closestBu.buEta) {
                closestBu = { buEta: e.routes[0].summary.totalTime, busy: element.techname }
                setClosest({ ...closestAv, ...closestAp, busy: element.techname, buEta: e.routes[0].summary.totalTime })
              }
            }
          })


        map.removeControl(routingControl)

        element.appts.forEach((item) => {
          console.log(item)
          const lmao = L.Routing.control({
            waypoints: [L.latLng(item.lat, item.lon), L.latLng(job.lat, job.lon)],
            routeWhileDragging: true,
            show: false,
            fitSelectedRoutes: false,
            lineOptions: {
              addWaypoints: false,
              styles: [
                { display: "none", color: 'black', opacity: 1, weight: 9 },
                { display: "none", color: 'white', opacity: 1, weight: 6 },
                { display: "none", visibility: "hidden", color: 'red', opacity: 1, weight: 2 }],
            }
          }).addTo(map);

          console.log(lmao)

          lmao.on(
            "routesfound",
            function (e) {
              if(item.lat){
                if (e.routes[0].summary.totalTime < closestAp.apEta) {
                  closestAp = { apEta: e.routes[0].summary.totalTime, appointment: element.techname }
                  console.log(closestAp)
                  setClosest({ ...closestBu, ...closestAv, appointment: element.techname, apEta: e.routes[0].summary.totalTime })
                }
              }
            })


          map.removeControl(lmao)
        })

      })



    }

    return
  }, [job, setClosest])

}