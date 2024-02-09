import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import WeatherForecastPage from "./pages/[city]";
import Header from "./components/Header";
import AutocompleteInput from "./pages/autocompleteInput";
import "./App.scss";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/city/:cityName" element={<WeatherForecastPage />} />
				<Route path="/search" element={<AutocompleteInput />} />
			</Routes>
		</Router>
	);
}

export default App;
