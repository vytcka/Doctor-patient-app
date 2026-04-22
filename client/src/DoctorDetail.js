import { useParams } from "react-router-dom";
import { data } from "./doctorItems";

export default function DoctorDetail(){
    const {id} = useParams();

    //find doctor by id
    const doctor = data.find(doc => doc.id === Number(id))

    if(!doctor){
        return <p>Doctor not found</p>
    }

    console.log(doctor);

    return(
        <div>
            <p><img src={doctor.profileIcon} alt={doctor.name} className="doc-profile-icon"/></p>
            <h1>{doctor.name}</h1>
            <p>{"⭐".repeat(doctor.rating)}</p>
            <p><b>Specialty: </b>{doctor.specialty}</p>
            <p><b>Gender: </b>{doctor.gender}</p>
            <p><b>Language: </b>{doctor.language.join(", ")}</p>
            <p><b>Location: </b>{doctor.location}</p>
            <p><b>Availability: </b>{doctor.availability.days} {doctor.availability.time}</p>
            <p><b>Bio: </b>{doctor.bio}</p>
        </div>
    );

}