import DATA from "./data/data.json"
import crypto from "crypto"

import {Flight, Trip} from "./types"

const Api = {
    trips: {
        list: async (origin: Flight["origin"]): Promise<Trip[]> => {
            
            const [origins, destinations] = DATA
            //filtrar vuelos que YA SUCEDIERON
                .filter( (flight: Flight) => new Date(flight.date) > new Date())
            //agarrar los que vuelos que SALEN/LLEGAN a ciudad target
                .reduce<[Flight[], Flight[]]> (
                    ([origins, destinations], flight) => {
                        if(flight.origin === origin) {
                            origins.push(flight)
                        } else if(flight.destination === origin) {
                            destinations.push(flight);                        
                        }
                        return [origins, destinations]
                    }, 
                    [[], []]
                );

            const trips: Trip[] = []
            
            for(let origin of origins) {
                for(let destination of destinations) {
                    //valid TRIPS solamente si...

                    //VUELTA es POSTERIOR a salida
                   if(destination.date > origin.date){
                    const days = Math.ceil( (+new Date(destination.date) - +new Date(origin.date)) / (1000 * 60 * 60 * 24)); 

                    trips.push({
                        id: crypto.randomUUID(),
                        availability:Math.min(origin.availability, destination.availability) ,
                        days,
                        destination,
                        origin,
                        price: Math.ceil(origin.price + destination.price),
                    })
                   }
                }

            }
            console.log(trips)
            return trips;
        }
    },
    origin: {
        list: async(): Promise<Flight["origin"][]> => {
            const origins = new Set<Flight["origin"]>()
            for(let flight of DATA) {
                origins.add(flight.origin)
            }
            return Array.from(origins)
        }
    }

}
export default Api