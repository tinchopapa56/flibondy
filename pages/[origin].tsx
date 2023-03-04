import { GetStaticProps, GetStaticPaths } from "next"
import {Flight, Trip} from "../types"
import Api from "../api"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  trips: Trip[],
}
type Params = ParsedUrlQuery & {
  origin: string,
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({params}) => {
  
  const trips = await Api.trips.list(params?.origin!);
  trips.sort((a,b) => a.price - b.price)


  return {
    props: {
      trips: trips.slice(0,trips.length/2), //Half of all options
      // trips: trips,
      // trips: trips.slice(0,100)
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

const OriginPage: React.FC<Props> = ({trips}) => {
  const [sort, setSort] = useState<"price"|"days">("price");
  const [paging, setPaging] = useState<number>(20);

  const [totalOPTS, setTotalOPTS] = useState<number>(trips.length);

  const matches = useMemo(() => [...trips].sort((a,b) => a[sort] - b[sort])
  .slice(0,paging)
  ,[sort,trips, paging])


  const checkpoint = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        setPaging(paging => paging+50)
      }
    });

    observer.observe(checkpoint.current);

    return () => {
      observer.disconnect()
    }
  },[])
    

  return (
    <>
      <div style={{display: "flex",  flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
      <h4>Scroll down for 50 more options (of {totalOPTS})</h4>

        <table>
          <thead>
            <tr>
              <td>Destino</td>
              <td onClick={()=> setSort("days")} style={{cursor:"pointer" , color: sort ==="days" ? "yellow" :"inherit"}}>Dias</td>
              <td onClick={()=> setSort("price")} style={{cursor:"pointer" , color: sort ==="price" ? "yellow" :  "inherit"}}>Precio</td>
            </tr>
          </thead>
          <tbody>
            {matches.map( (trip: Trip) => (
              <tr key={trip.id}>
                <td>{trip.origin.destination}</td>
                <td>{trip.days}</td>
                <td>{trip.price.toLocaleString("es-AR", {style: "currency", currency: "ARS", })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {trips.length > paging && <button onClick={() => setPaging(paging => paging+20)}>Add20 more</button>} */}
      <div ref={checkpoint}></div>
    </>
    
  )
}

export default OriginPage;