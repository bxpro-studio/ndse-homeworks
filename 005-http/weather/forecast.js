#!/usr/bin/env node

const http = require('http')
const url = require('url')
require('dotenv').config()

/* const http = require('http');
const APIKey = process.env.APIKey;
const APIurl = process.env.APIurl;
const url = `${APIurl}?access_key=${APIKey}&query=Санкт-Петербург`; */

const layoutStart = (`
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <div class='container pt-5'>
`)

const layoutEnd = (`
        <br><br>
        <h2>Введите город</h2>
        <form method="POST" action="">
            <input name="city" type="text" required><br>
            <button class="btn btn-sm btn-success" type="submit">Обновить</button>
        </form>
    </div>
`)

let currentCity = process.env.defaultCity

let parsedData = {}

const server = http.createServer((req, res) => {
    const urlParsed = url.parse(req.url, true)
    const { pathname, query } = urlParsed
    const { method } = req

    res.setHeader('Content-Type', 'text/html; charset=utf-8;')

    if (pathname === '/') {
        if (method === 'POST') {
            let r = []
            req
                .on('data', (chunk) => {
                    r.push(chunk)
                })
                .on('end', () => {
                    currentCity = decodeURI(Buffer.concat(r).toString().split('=')[1])
                })
                
            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
        } else {
            res.write(layoutStart)
            
            let requestUrl = `${process.env.APIurl}/forecast?access_key=${process.env.APIKey}&query=${currentCity}`;

            const request = http.get(requestUrl, (response) => {
                const statusCode = response.statusCode

                if (statusCode !== 200) {
                    console.error(`Status Code: ${statusCode}`)
                    return
                }

                response.setEncoding('utf8')

                let rawData = ''
                response.on('data', (chunk) => rawData += chunk)
                response.on('end', () => {
                    parsedData = JSON.parse(rawData)
                    console.log(parsedData)
                    res.write(`<h1>Прогноз погоды для города "${parsedData.location.name}"</h1>`)
                    res.write(`<h2>Сейчас:</h2>`)
                    res.write(`<p>Температура: ${parsedData.current.temperature}</p>`)
                    res.write(`<p>Скорость ветра: ${parsedData.current.wind_speed}</p>`)

                    let forecast = parsedData.forecast[Object.keys(parsedData.forecast)[0]]
                    console.log(forecast)

                    res.write(`<h2>Прогноз на ${forecast.date}:</h2>`)
                    res.write(`<p>Минимальная температура: ${forecast.mintemp}</p>`)
                    res.write(`<p>Максимальная температура: ${forecast.maxtemp}</p>`)

                    res.write(layoutEnd)
                    res.end()
                })
            })

            request.on('error', (e) => {
                console.error(`Got error: ${e.message}`)
                res.end()
            })
        }
    } else {
        res.statusCode = 404
        res.write(layoutStart)
        res.write(`<h1>Ошибка 404</h1><h2>Страница не найдена</h2>`)
        res.write(layoutEnd)
        res.end()
    }
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running, go to http://localhost:${process.env.PORT}/`)
})
