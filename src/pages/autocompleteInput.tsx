import React, { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import styles from "./autocompleteInput.module.scss";

type Suggestion = {
	name: string;
	latitude: number;
	longitude: number;
	admin1?: string;
	country?: string;
};

const AutocompleteInput = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const debouncedFetchSuggestions = debounce(async (search) => {
		if (search.trim() === "") {
			setSuggestions([]);
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${search}`
			);
			const data = await response.json();
			setSuggestions(data.results || []);
		} catch (error) {
			console.error("Failed to fetch suggestions", error);
		}
		setLoading(false);  
	}, 300);

	useEffect(() => {
		debouncedFetchSuggestions(searchTerm);
	}, [searchTerm]);

	const handleSelectCity = (city: Suggestion) => {
		navigate(
			`/city/${encodeURIComponent(city.name)}?lat=${city.latitude}&lng=${
				city.longitude
			}`
		);
	};

	return (
		<>
			<div className={styles.mainWrapper}>
				<h1 className={styles.title}>Search</h1>
				<Form.Control
					type="text"
					placeholder="Search for a city..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={styles.search}
				/>
				{loading && <p>Loading...</p>}{" "}
				 
				{suggestions.length > 0 && (
					<ListGroup>
						{suggestions.map((city, index) => (
							<ListGroup.Item
								key={index}
								action
								onClick={() => handleSelectCity(city)}
								className={styles.cityDropDown}
							>
								{`${city.name}${city.admin1 ? ", " + city.admin1 : ""}${
									city.country ? ", " + city.country : ""
								}`}
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</div>
		</>
	);
};

export default AutocompleteInput;
