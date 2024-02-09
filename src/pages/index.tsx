import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { weatherInterpretationRu } from "../utils/WeatherCode";
import styles from "./index.module.scss";

const cities = [
	"Moscow",
	"St Petersburg",
	"Rostov-on-Don",
	"Vladivostok",
	"Krasnodar",
	"Yekaterinburg",
];

const HomePage = () => {
	return (
		<Container>
			<h1 className={styles.title}>Прогноз погоды</h1>
			<Row className={styles.wreaper}>
				{cities.map((city, index) => (
					<Col key={index} xs={12} md={6} lg={4} className="mb-4">
						<CityCard city={city} />
					</Col>
				))}
			</Row>
		</Container>
	);
};

interface CityCardProps {
	city: string;
}

interface Weather {
	temperature: number;
	weathercode: number;
	windspeed: number;
	latitude: number;
	longitude: number;
}

const CityCard = ({ city }: CityCardProps) => {
	const [weather, setWeather] = useState<Weather | null>(null);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const geocodingResponse = await fetch(
					`https://geocoding-api.open-meteo.com/v1/search?name=${city}`
				);
				const geocodingData = await geocodingResponse.json();
				const { latitude, longitude } = geocodingData.results[0];

				const weatherResponse = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&windspeed_unit=ms`
				);
				const weatherData = await weatherResponse.json();
				setWeather({ ...weatherData.current_weather, latitude, longitude });
			} catch (error) {
				console.error("Failed to fetch weather data", error);
			}
		};

		fetchWeather();
	}, [city]);

	return (
		<>
			<Card className={styles.cityCard}>
				<Card.Body>
					<Card.Title>{city}</Card.Title>
					{weather ? (
						<>
							<div>Температура: {weather.temperature}°C</div>
							<div>
								Состояние: {weatherInterpretationRu[weather.weathercode]}
							</div>
							<div>Скорость ветра: {weather.windspeed} m/s</div>
							{typeof weather.latitude !== "undefined" &&
								typeof weather.longitude !== "undefined" && (
									<Link
										to={`/city/${encodeURIComponent(city)}?lat=${
											weather.latitude
										}&lng=${weather.longitude}`}
									>
										<Button
											className={styles.button}
											style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
										>
											Смотреть прогноз
										</Button>
									</Link>
								)}
						</>
					) : (
						<div>Loading...</div>
					)}
				</Card.Body>
			</Card>
		</>
	);
};

export default HomePage;
