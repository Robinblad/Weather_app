import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { weatherInterpretationRu } from "../utils/WeatherCode";
import styles from "./[city].module.scss";

interface Forecast {
	time: string[];
	weathercode: number[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
}

interface RouteParams {
	[key: string]: string | undefined;
}
console.log(location.search);

const WeatherForecastPage = () => {
	const city = useParams<RouteParams>().cityName;
	//const params = useParams<RouteParams>();
	const location = useLocation();
	//const city = params.city;
	const query = new URLSearchParams(location.search);

	const initialValue: Forecast = {
		time: [],
		weathercode: [],
		temperature_2m_max: [],
		temperature_2m_min: [],
	};

	const [forecast, setForecast] = useState<Forecast>(initialValue);

	useEffect(() => {
		if (!city) {
			console.error("City parameter is missing");
			return;
		}

		const fetchForecast = async () => {
			try {
				const lat = query.get("lat");
				const lng = query.get("lng");
				console.log(`Latitude: ${lat}, Longitude: ${lng}`);

				if (!lat || !lng) {
					console.error("Latitude and longitude are required");
					return;
				}

				const response = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT`
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setForecast({
					time: data.daily.time,
					weathercode: data.daily.weathercode,
					temperature_2m_max: data.daily.temperature_2m_max,
					temperature_2m_min: data.daily.temperature_2m_min,
				});
			} catch (error) {
				console.error("Failed to fetch forecast data", error);
			}
		};

		fetchForecast();
	}, [city]);

	if (!city) {
		return <p>City parameter is missing</p>;
	}

	return (
		<>
			<Container className={styles.forecastContainer}>
				<div></div>
				<Link to="/" className={styles.backButton}>
					Назад
				</Link>
				<h2 className={styles.forecastTitle}>Прогноз погоды в городе {city}</h2>
				{forecast ? (
					<Table striped bordered hover>
						<tbody className={styles.tableBody}>
							<tr className={styles.tableHeader}>
								<td>Дата</td>
								{forecast.time.map((time, index) => (
									<td key={index}>
										{new Date(time).toLocaleDateString("ru", {
											day: "numeric",
											month: "long",
										})}
									</td>
								))}
							</tr>

							<tr>
								<td>Мин. темп.</td>
								{forecast.temperature_2m_min.map((temp, index) => (
									<td key={index}>{temp}°C</td>
								))}
							</tr>

							<tr>
								<td>Макс. темп.</td>
								{forecast.temperature_2m_max.map((temp, index) => (
									<td key={index}>{temp}°C</td>
								))}
							</tr>
							<tr>
								<td>Погода</td>
								{forecast.weathercode.map((code, index) => (
									<td key={index}>{weatherInterpretationRu[code]}</td>
								))}
							</tr>
						</tbody>
					</Table>
				) : (
					<p>Loading forecast...</p>
				)}
			</Container>
		</>
	);
};

export default WeatherForecastPage;



//export default WeatherForecastPage;
