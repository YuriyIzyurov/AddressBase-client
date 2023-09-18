import React, {useEffect, useState} from 'react';
import './weather.css'
import cloudy from '../assets/cloudy.svg'
import day from '../assets/day.svg'
import cloudy3 from '../assets/cloudy-day-3.svg'
import snowy6 from '../assets/snowy-6.svg'
import rainy5 from '../assets/rainy-5.svg'
import rainy4 from '../assets/rainy-4.svg'
import rainy7 from '../assets/rainy-7.svg'

import {Button, Input} from "antd";
import {Link} from "react-router-dom";
const { Search } = Input;

const WeatherAppComponent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect( () => {
        async function fetchData() {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=Ivanovo,RU&limit=1&appid=${import.meta.env.VITE_API_KEY}`)
            const data = await response.json()
            const {lon, lat} = data[0]
            const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${import.meta.env.VITE_API_KEY}`)
            const data2 = await  response2.json()

            setWeatherData(data2)
        }
        try {
            setLoading(true)
            fetchData()
            setLoading(false)
        } catch(e) {
            setError(e)
        }

    }, []);


    async function onSearch(city) {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},RU&limit=1&appid=${import.meta.env.VITE_API_KEY}`)
        const data = await response.json()
        const {lon, lat} = data[0]
        const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${import.meta.env.VITE_API_KEY}`)
        const data2 = await  response2.json()

        setWeatherData(data2)
    }
    return (
        <>
            <main className="weather-container__wrapper">
                {loading ? (
                    <h1>Загрузка...</h1>
                ) : error ? (
                    <h1>{error}</h1>
                ) : (
                    <div className='weather-container'>
                        <Button className='absolute-btn'>
                            <Link className='link' to={`/`}> {'< Назад'}</Link>
                        </Button>
                        <Search placeholder='Введите название...' onSearch={onSearch} style={{ width: 300, paddingTop: '30px', paddingBottom: '20px' }} />
                        {weatherData && <Temperature data={weatherData}/>}
                    </div>
                )}
            </main>
        </>
    );
};

function Temperature({ data }) {

    const [image, setImage] = useState(rainy5)


    useEffect(() => {
        const weather = data.weather[0]
        pickWeather(weather.id)
    }, [data])

    function pickWeather(code) {
        if (code > 800) {
            setImage(cloudy);
        } else if (code === 800) {
            setImage(day);
        } else if (code > 700) {
            setImage(cloudy3);
        } else if (code > 600) {
            setImage(snowy6);
        } else if (code > 500) {
            setImage(rainy5);
        } else if (code > 300) {
            setImage(rainy4);
        } else if (code > 200) {
            setImage(rainy7);
        }
    }

    return (
        <div className="current-temperature">
            <div className="current-temperature__name">
                {data.name}
            </div>
            <div className="current-temperature__wrapper">
                <img src={image} className="current-temperature__icon" alt="" />
                <div style={{width: '100px'}}></div>
                <div className="current-temperature__value">{Math.round(data.main.temp)}&deg;</div>
            </div>
            <div className="current-temperature__info">
                <div className="current-temperature__summary">
                    {data.weather[0].description}
                </div>

                    <br/>

                <div className="aditional-data__wrapper">
                    <div className="aditional-data__element">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="2em" width="2em"><path d="M5.63604 6.633L12 0.269043L18.364 6.633C21.8787 10.1477 21.8787 15.8462 18.364 19.3609C14.8492 22.8756 9.15076 22.8756 5.63604 19.3609C2.12132 15.8462 2.12132 10.1477 5.63604 6.633H5.63604Z"></path></svg>
                         <div>Влажность:</div>
                        <div>{data.main.humidity}%</div>
                    </div>
                    <div className="aditional-data__element">
                        <svg fill="#fff" width="2.2rem" height="2.2rem" viewBox="0 0 64 64" version="1.1" >
                            <path d="M39,32.7V10c0-3.9-3.1-7-7-7s-7,3.1-7,7v22.7c-5.4,2.8-8.5,8.5-7.9,14.6c0.7,7.4,6.8,13.3,14.2,13.6c0.2,0,0.5,0,0.7,0    c3.9,0,7.5-1.5,10.3-4.1C45.3,54,47,50.1,47,46C47,40.5,43.9,35.3,39,32.7z M41,55.4c-2.6,2.5-6,3.8-9.6,3.6    c-6.4-0.3-11.7-5.4-12.3-11.8c-0.5-5.5,2.4-10.6,7.4-12.9c0.3-0.2,0.6-0.5,0.6-0.9V10c0-2.8,2.2-5,5-5s5,2.2,5,5v23.4    c0,0.4,0.2,0.7,0.6,0.9C42.1,36.4,45,41,45,46C45,49.6,43.6,52.9,41,55.4z"/>
                            <path d="M35.7,36.7c-0.4-0.2-0.7-0.5-0.7-0.9V14.1c0-1.5-1.1-2.8-2.5-3.1c-0.9-0.1-1.8,0.1-2.4,0.7S29,13.1,29,14v21.8    c0,0.4-0.3,0.8-0.7,0.9c-3.8,1.5-6.3,5.1-6.3,9.3c0,5.4,4.3,9.9,9.7,10c0.1,0,0.2,0,0.3,0c2.6,0,5.1-1,7-2.8c2-1.9,3-4.4,3-7.2    C42,41.9,39.5,38.2,35.7,36.7z M31.4,13.2c0.2-0.2,0.4-0.2,0.6-0.2c0.1,0,0.1,0,0.2,0c0.5,0.1,0.8,0.6,0.8,1.1V23h-2v-9    C31,13.7,31.1,13.4,31.4,13.2z M37.6,51.7c-1.6,1.5-3.6,2.3-5.8,2.3c-4.2-0.1-7.8-3.8-7.8-8c0-3.3,2-6.2,5.1-7.4    c1.2-0.5,1.9-1.5,1.9-2.8V25h2v10.8c0,1.2,0.8,2.3,1.9,2.8C38,39.8,40,42.7,40,46C40,48.2,39.1,50.2,37.6,51.7z"/>
                            <path d="M20,29v-8h2c0.4,0,0.7-0.2,0.9-0.5c0.2-0.3,0.1-0.7-0.1-1l-5-7c-0.4-0.5-1.3-0.5-1.6,0l-5,7c-0.2,0.3-0.2,0.7-0.1,1    c0.2,0.3,0.5,0.5,0.9,0.5h2v8c0,0.6,0.4,1,1,1h4C19.6,30,20,29.6,20,29z M18,20v8h-2v-8c0-0.6-0.4-1-1-1h-1.1l3.1-4.3l3.1,4.3H19    C18.4,19,18,19.4,18,20z"/>
                            <path d="M52.9,21.5C52.7,21.2,52.4,21,52,21h-2v-8c0-0.6-0.4-1-1-1h-4c-0.6,0-1,0.4-1,1v8h-2c-0.4,0-0.7,0.2-0.9,0.5    c-0.2,0.3-0.1,0.7,0.1,1l5,7c0.2,0.3,0.5,0.4,0.8,0.4s0.6-0.2,0.8-0.4l5-7C53,22.3,53.1,21.9,52.9,21.5z M47,27.3L43.9,23H45    c0.6,0,1-0.4,1-1v-8h2v8c0,0.6,0.4,1,1,1h1.1L47,27.3z"/>
                        </svg>
                        <div>Атм. давление:</div>
                        <div>{data.main.pressure} мм.рт.ст.</div>
                    </div>
                    <div className="aditional-data__element">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" id="Layer_1" x="10px" y="10px" viewBox="0 0 30 30" height="3em" width="3em"><path d="M3.1,16.97c0,0.24,0.09,0.45,0.28,0.62c0.16,0.19,0.37,0.28,0.63,0.28H18.7c0.29,0,0.53,0.1,0.73,0.3
	c0.2,0.2,0.3,0.45,0.3,0.74c0,0.29-0.1,0.53-0.3,0.72c-0.2,0.19-0.44,0.29-0.74,0.29c-0.29,0-0.54-0.1-0.73-0.29
	c-0.16-0.18-0.36-0.26-0.6-0.26c-0.25,0-0.46,0.09-0.64,0.26s-0.27,0.38-0.27,0.61c0,0.25,0.09,0.46,0.28,0.63
	c0.56,0.55,1.22,0.83,1.96,0.83c0.78,0,1.45-0.27,2.01-0.81c0.56-0.54,0.83-1.19,0.83-1.97s-0.28-1.44-0.84-2
	c-0.56-0.56-1.23-0.84-2-0.84H4.01c-0.25,0-0.46,0.09-0.64,0.26C3.19,16.51,3.1,16.72,3.1,16.97z M3.1,13.69
	c0,0.23,0.09,0.43,0.28,0.61c0.17,0.18,0.38,0.26,0.63,0.26h20.04c0.78,0,1.45-0.27,2.01-0.82c0.56-0.54,0.84-1.2,0.84-1.97
	c0-0.77-0.28-1.44-0.84-1.99s-1.23-0.83-2.01-0.83c-0.77,0-1.42,0.27-1.95,0.8c-0.18,0.16-0.27,0.38-0.27,0.67
	c0,0.26,0.09,0.47,0.26,0.63c0.17,0.16,0.38,0.24,0.63,0.24c0.24,0,0.45-0.08,0.63-0.24c0.19-0.21,0.42-0.31,0.7-0.31
	c0.29,0,0.53,0.1,0.73,0.3c0.2,0.2,0.3,0.44,0.3,0.73c0,0.29-0.1,0.53-0.3,0.72c-0.2,0.19-0.44,0.29-0.73,0.29H4.01
	c-0.25,0-0.46,0.09-0.64,0.26C3.19,13.23,3.1,13.44,3.1,13.69z"></path></svg>
                        <div>Скорость ветра:</div>
                        <div>{data.wind.speed} м/c</div>
                    </div>
                    <div className="aditional-data__element">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" height="3em" width="3em" ><path d="M3.89,17.6c0-0.99,0.31-1.88,0.93-2.65s1.41-1.27,2.38-1.49c0.26-1.17,0.85-2.14,1.78-2.88c0.93-0.75,2-1.12,3.22-1.12
	c1.18,0,2.24,0.36,3.16,1.09c0.93,0.73,1.53,1.66,1.8,2.8h0.27c1.18,0,2.18,0.41,3.01,1.24s1.25,1.83,1.25,3
	c0,1.18-0.42,2.18-1.25,3.01s-1.83,1.25-3.01,1.25H8.16c-0.58,0-1.13-0.11-1.65-0.34S5.52,21,5.14,20.62
	c-0.38-0.38-0.68-0.84-0.91-1.36S3.89,18.17,3.89,17.6z M5.34,17.6c0,0.76,0.28,1.42,0.82,1.96s1.21,0.82,1.99,0.82h9.28
	c0.77,0,1.44-0.27,1.99-0.82c0.55-0.55,0.83-1.2,0.83-1.96c0-0.76-0.27-1.42-0.83-1.96c-0.55-0.54-1.21-0.82-1.99-0.82h-1.39
	c-0.1,0-0.15-0.05-0.15-0.15l-0.07-0.49c-0.1-0.94-0.5-1.73-1.19-2.35s-1.51-0.93-2.45-0.93c-0.94,0-1.76,0.31-2.46,0.94
	c-0.7,0.62-1.09,1.41-1.18,2.34l-0.07,0.42c0,0.1-0.05,0.15-0.16,0.15l-0.45,0.07c-0.72,0.06-1.32,0.36-1.81,0.89
	C5.59,16.24,5.34,16.87,5.34,17.6z M14.19,8.88c-0.1,0.09-0.08,0.16,0.07,0.21c0.43,0.19,0.79,0.37,1.08,0.55
	c0.11,0.03,0.19,0.02,0.22-0.03c0.61-0.57,1.31-0.86,2.12-0.86c0.81,0,1.5,0.27,2.1,0.81c0.59,0.54,0.92,1.21,0.99,2l0.09,0.64h1.42
	c0.65,0,1.21,0.23,1.68,0.7c0.47,0.47,0.7,1.02,0.7,1.66c0,0.6-0.21,1.12-0.62,1.57s-0.92,0.7-1.53,0.77c-0.1,0-0.15,0.05-0.15,0.16
	v1.13c0,0.11,0.05,0.16,0.15,0.16c1.01-0.06,1.86-0.46,2.55-1.19s1.04-1.6,1.04-2.6c0-1.06-0.37-1.96-1.12-2.7
	c-0.75-0.75-1.65-1.12-2.7-1.12h-0.15c-0.26-1-0.81-1.82-1.65-2.47c-0.83-0.65-1.77-0.97-2.8-0.97C16.28,7.29,15.11,7.82,14.19,8.88
	z"></path></svg>
                        <div>Облачность:</div>
                        <div>{data.clouds.all}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default WeatherAppComponent;
