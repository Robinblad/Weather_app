import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

const Header: React.FC = () => {
	return (
		<>
			<div className="header">
				<div className="headerLogo">
					<div className="logo"></div>
					<h2 className="headerLabelName">WeatherApp</h2>
				</div>

				<div className="nav">
					<Link to="/" className="nav-item weather">
						Погода
					</Link>
					<Link to="/search" className="nav-item search">
						Поиск
					</Link>
				</div>
			</div>
		</>
	);
};

export default Header;
