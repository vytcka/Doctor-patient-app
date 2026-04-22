import { React, useState } from "react";
import { data } from "./doctorItems";
import { useNavigate } from "react-router-dom";
import './reviews.css'; 


export default function Reviews() {


    const [query, setQuery] = useState("")

    const navigate = useNavigate();

    //initialise objects
    const [selectedFilters, setSelectedFilters] = useState({
            name: "",
            specialty: "",
            rating: "",
            gender: "",
            language: "",
            location: "",
        }); 
    
        const filters = [
                         {key: "specialty", label:"Specialty"},
                         {key: "rating", label: "Rating"},
                         {key: "gender", label: "Gender"},
                         {key: "language", label: "Language"},
                         {key: "location", label: "Location"}
                        ];
    
        const filteredDoctors = data.filter((item) => {
                return (
                    //search
                    (query === "" ||
                        item.name.toLowerCase().includes(query.toLowerCase()) ||
                        item.specialty.toLowerCase().includes(query.toLowerCase()) ||
                        item.gender.toLowerCase().includes(query.toLowerCase()) ||
                        item.language.some(lang => lang.toLowerCase().includes(query.toLowerCase())) ||
                        item.location.toLowerCase().includes(query.toLowerCase())
                        
                    ) &&

                    //Specialty Filter
                    (selectedFilters.specialty === "" || item.specialty === selectedFilters.specialty) &&

                    //Rating Filter
                    (selectedFilters.rating === "" || item.rating >= Number(selectedFilters.rating)) &&

                    //Gender Filter
                    (selectedFilters.gender === "" || item.gender === selectedFilters.gender) &&

                    //Language Filter
                    (selectedFilters.language === "" || item.language.some(lang => lang.toLowerCase() === selectedFilters.language.toLowerCase())) &&

                    //Location Filter
                    (selectedFilters.location === "" || item.location === selectedFilters.location)

                );
            });

            //Get unique values for options
            //Specialty
            const specialtyOptions = [...new Set(data.map(item => item.specialty))];
            //rating
            const ratingOptions = [...new Set(data.map(item => item.rating))].sort();
            //language
            const languageOptions = [...new Set(data.flatMap(item=> item.language))];
            //location
            const locationOptions = [...new Set(data.map(item => item.location))];

    return(
        <div className="review-container">
            <h1>Doctors Reviews</h1>
            <h2>Look at reviews for each doctor or leave a review</h2>

            {/*Search bar*/}
            <div className="search-bar">
                <input
                type="search"
                placeholder="Search"
                onChange={event => setQuery(event.target.value)}
                />
            </div>

            {/*Filters*/}
            <div className="filter-container">
                {filters.map((filter) => (
                    <select 
                        key={filter.key}
                        value={selectedFilters[filter.key]}
                        onChange={(e) => setSelectedFilters({
                            ...selectedFilters,
                            [filter.key]: e.target.value
                        })}
                    >
                        <option value="">All {filter.label}</option>

                        {/*Filter options*/}
                        {filter.key === "specialty" &&
                            specialtyOptions.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            )
                        )}

                        {filter.key === "rating" &&
                            ratingOptions.map((rate) => (
                                <option key={rate} value={rate}>
                                    {rate}+
                                </option>
                            )
                        )}

                        {filter.key === "gender" && (
                            <>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </>
                        )}

                        {filter.key === "language" &&
                            languageOptions.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            )
                        )}

                        {filter.key === "location" &&
                            locationOptions.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            )
                        )}

                    </select>
                ))}
            </div>

            {/*Displays of doctor ratings and info*/}
            <div className="doctor-container">
                 {filteredDoctors.map((items) => (

                    <div className="doctor-card" key={items.id} onClick={() => navigate(`/doctor/${items.id}`)}>
                        <img src={items.profileIcon} alt={items.name} className="doc-profile-icon"/>
                        <div className="doctor-info">
                            <h3>{items.name}</h3>
                            <p><b>Specialty: </b>{items.specialty}</p>
                            <p><b>Gender: </b>{items.gender}</p>
                            <p><b>Language: </b>{items.language.join(", ")}</p>
                            <p><b>Location: </b>{items.location}</p>
                        </div>

                        <div className="doctor-rating"> 
                            {"⭐".repeat(items.rating)}
                            <p>View more information about this doctor →</p>
                        </div>

                    </div>
                 ))}
            </div>

        </div>
    );
}
