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

//import React, { useState, useEffect } from "react";
//import { useParams } from "react-router-dom";
//import { Container, Table, Button } from "react-bootstrap";
//import { Link } from "react-router-dom";
//import styles from "./[city].module.scss";

//interface Forecast {
//	time: string[];
//	weathercode: number[];
//	temperature_2m_max: number[];
//	temperature_2m_min: number[];
//}

//interface RouteParams {
//	city: string;
//	lat: string;
//	lng: string;
//	[key: string]: string | undefined;
//}

//const WeatherForecastPage = () => {
//	const params = useParams<RouteParams>();
//	const [forecast, setForecast] = useState<Forecast | null>(null);

//	useEffect(() => {
//		const { city, lat, lng } = params;
//		if (!city || !lat || !lng) {
//			console.error("Required parameters are missing");
//			return;
//		}

//		// Fetch the 7-day weather forecast
//		const fetchForecast = async () => {
//			try {
//				const response = await fetch(
//					`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT`
//				);
//				if (!response.ok) {
//					throw new Error("Network response was not ok");
//				}
//				const data = await response.json();
//				setForecast(data.daily);
//			} catch (error) {
//				console.error("Failed to fetch forecast data", error);
//			}
//		};

//		fetchForecast();
//	}, [params]);

//	if (!params.city || !params.lat || !params.lng) {
//		return null;
//	}

//	return (
//		<>
//			<h1 className={styles.title}>Weather Forecast2</h1>
//			<Container>
//				<Link to="/">
//					<Button>Back</Button>
//				</Link>
//				<h1>Weather Forecast for {params.city}</h1>
//				{forecast && (
//					<Table striped bordered hover>
//						<thead>
//							<tr>
//								<th>Date</th>
//								<th>Min Temp</th>
//								<th>Max Temp</th>
//								<th>Condition</th>
//							</tr>
//						</thead>
//						<tbody>
//							{forecast.time.map((time, index) => (
//								<tr key={index}>
//									<td>{time}</td>
//									<td>{forecast.temperature_2m_min[index]}°C</td>
//									<td>{forecast.temperature_2m_max[index]}°C</td>
//									<td>{forecast.weathercode[index]}</td>
//								</tr>
//							))}
//						</tbody>
//					</Table>
//				)}
//			</Container>
//		</>
//	);
//};

//export default WeatherForecastPage;
