import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect,useState } from "react";

const containerStyle = {
    width: '60vw',
    height: '70vh',
    marginTop:'40px',
    marginBottom:'40px',
    marginRight:'auto',
    marginLeft:'auto'
};

export const DashMap = ({coordinates}) => {
   const [coords ,setCoords]=useState(null)
   useEffect(()=>{
    setCoords(coordinates)
   },[])
    return (
        <>
            {coordinates.length===2 ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{lat: coordinates[0] ,lng: coordinates[1]}}
                    zoom={20}
                >
                  
        {coords &&
          <Marker position={{lat: coordinates[0] ,lng: coordinates[1]}} />}
                </GoogleMap>
            ) : (
                <div className="h-[70vh] flex">
                    <h2 className="mx-auto items-center">Loading...</h2>
                </div>
            )}

        </>

    )
}