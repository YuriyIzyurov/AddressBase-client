import { useState } from 'react'
import { Button, Dropdown, Space, theme, ConfigProvider  } from 'antd';
//import {query} from './constants'
import './App.css'
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import React from "react";


function App() {

    const generatePeople = () => {
        const people = []
        for (let i = 0; i < 20; i++) {
            const sex = generateRandomSex()
            const person = {
                firstName: sex ? generateRandomFemaleName() : generateRandomMaleName(),
                middleName: sex ? generateRandomFemaleMiddleName() : generateRandomMaleMiddleName(),
                lastName: sex ? generateRandomFemaleLastName() : generateRandomMaleLastName(),
                passportSerialId: generateRandomPassportSerialId(),
                passportId: generateRandomPassportId(),
                sex: sex,
            };
            people.push(person);
        }
        return people
    }

    const checkUnique = new Set();
    const OKATOpattern = '242********';
    let countDoubles = 0
    const generateOKATO = (hashset, pattern) => {
        let result = ''
        for(let c of pattern) {
            if(c==='*') {
                const randomDigit = Math.floor(Math.random() * 10);
                result += randomDigit
            } else {
                result += c
            }
        }
        if(hashset.has(result)) {
            countDoubles++
            generateOKATO(hashset, pattern)
        }

        hashset.add(result)
        return result
    }
    const generateOKATOS = () => {
        const result = []
        for(let i=0;i<100;i++) {
            const unique = generateOKATO(checkUnique, OKATOpattern)
            result.push(unique)
        }
        console.log(checkUnique)
        console.log(result)
        console.log(countDoubles)
        return result
    }


  return (
      <>
          <div className='main-title'>Выберите задание</div>
          <div className='btn_section'>
              <Button type="primary" disabled>Задание 1</Button>
              <Button type="primary" disabled>Задание 2</Button>
              <Button type="primary">
                  <Link className='link' to={`third`}>Задание 3</Link>
              </Button>
              <Button type="primary" disabled>Задание 4</Button>
              <Button type="primary">
                  <Link className='link' to={`fifth`}>Задание 5</Link>
              </Button>
          </div>
      </>
  )
}

export default App
