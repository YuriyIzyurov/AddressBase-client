import React, {useEffect, useRef, useState} from 'react';
import './styles.css'
import {Alert, Button, Dropdown, Input, Modal, Spin, Table, Tag, Tour} from "antd";
import {Link} from "react-router-dom";
const { Column, ColumnGroup } = Table;
const { Search } = Input;



const BASE_URL = 'http://127.0.0.1:5000/api/'
const DISTRICT_MESSAGE = 'Не выбрана область'
const FULLFILL_MESSAGE = 'Нет квартир'

const Task5Component = () => {
    const [query, setQuery] = useState('')
    const [district, setGeneratedDistrict] = useState(null)
    const [loadedData, setLoadedData] = useState(null)
    const [overallPersons, setOverallPersons] = useState(0)
    const [dbInitialInfo, setInitialInfo] = useState(null)
    const [message, setMessage] = useState(null)
    const [isOpen,setTourOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    const [messageApi, contextHolder] = message.useMessage();


    const searchQuery = [
        {
            key: '1',
            label: (
                <div onClick={() => setQuery('house')}>
                    по дому
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => setQuery('lastName')}>
                    по фамилии
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div onClick={() => setQuery('city')}>
                    по городу
                </div>
            ),
        },
        {
            key: '4',
            label: (
                <div onClick={() => setQuery('address')}>
                    по адресу
                </div>
            ),
        },
    ];
    const districts = [
        {
            key: '1',
            label: (
                <div onClick={() => setGeneratedDistrict('iv')}>
                    Ивановская область
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => setGeneratedDistrict('vl')}>
                    Владимирская область
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div onClick={() => setGeneratedDistrict('ya')}>
                    Ярославская область
                </div>
            ),
        },
    ];
    const steps = [
        {
            title: 'Выбор области',
            description: 'Приведены 3 области для примера',
            target: () => ref1.current,
            nextButtonProps: { children: <div>Далее</div>},
        },
        {
            title: 'Создать базу данных',
            description: 'Населенные пункты областей будут совпадать, остальные данные будут сгенерированны случайно.',
            target: () => ref2.current,
            prevButtonProps: { children: <div>Назад</div>},
            nextButtonProps: { children: <div>Далее</div>}
        },
        {
            title: 'Заселение',
            description: 'Будут созданы 5000 человек с вымышленными данными и расселены по свободным домам.',
            target: () => ref3.current,
            prevButtonProps: { children: <div>Назад</div>},
            nextButtonProps: { children: <div>Далее</div>}
        },
        {
            title: 'Тип запроса',
            description: 'Выберите тип запроса к базе данных, в соответствии с заданием.',
            target: () => ref4.current,
            prevButtonProps: { children: <div>Назад</div>},
            nextButtonProps: { children: <div>Далее</div>}
        },
        {
            title: 'Ввод данных',
            description: 'Введите необходимую информацию и пошлите запрос',
            target: () => ref5.current,
            prevButtonProps: { children: <div>Назад</div>},
            nextButtonProps: { children: <div>ОК</div>}
        },

    ];

    useEffect(() => {
        getInfoDataBase()
    },[])

    const info = () => {
        Modal.info({
            title: 'Краткое инфо:',
            content: (
                <div>
                    <p>Количество городов: {dbInitialInfo.city}</p>
                    <p>Количество квартир: {dbInitialInfo.apartment}</p>
                    <p>Количество жильцов: {dbInitialInfo.person}</p>
                </div>
            ),
            onOk() {
            },
        });
    };
    const notificator = (value) => {
        messageApi.open({
            type: value==='База данных успешно создана'||value==='Люди успешно заселены'?'success':'error',
            content: value,
        });
    };
    function handleSearchResult(data) {
        setLoadedData(data)
    }
    async function generateDataBase() {
        if(!district) {
            setMessage(DISTRICT_MESSAGE)
            return
        }
        setMessage(null)
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}region/populate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({name: district})
        })
        const data = await response.json()
        setIsLoading(false)
        notificator(data.message)
        setInitialInfo(data.count)
    }
    async function deleteDataBase() {
        const response = await fetch(`${BASE_URL}region/populate`, {
            method: 'DELETE',
        })
        const data = await response.json()
        setMessage(data.message)
        setInitialInfo({person:0, apartment:0})
    }
    async function getInfoDataBase() {
        const response = await fetch(`${BASE_URL}region/quantity`, {
            method: 'GET',
        })
        const data = await response.json()
        setInitialInfo(data.count)
        info()
    }
    async function generatePeople() {
        if(!dbInitialInfo.apartment) {
            setMessage(FULLFILL_MESSAGE)
            return
        }
        setMessage(null)
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}person/batch`, {
            method: 'POST',
        })
        const data = await response.json()
        setIsLoading(false)
        notificator(data.message)
        setInitialInfo(data.count)
    }
    function calculateProgress(data) {
        const relation = data.apartment/data.person
        return Math.round(150/relation)
    }


    function parseQuery(query) {
        switch (query){
            case 'house': return 'По дому'
            case 'lastName': return 'По фамилии'
            case 'city': return "По городу"
            case 'address': return 'По адресу'
            default: return 'Тип запроса'
        }
    }

    return (
        <div className='component'>
            <div className='outside__component'>
                <Tour open={isOpen} onClose={() => setTourOpen(false)} steps={steps} />
                <Button style={{backgroundColor: '#54e400'}} onClick={() => setTourOpen(true)}>Инструкция</Button>
                <Button >
                    <Link className='link' to={`/`}> {'< Назад'}</Link>
                </Button>
                {isLoading && <Spin tip="Loading" size="large">
                    <div className="content"/>
                </Spin>}
            </div>

            <div className='content__wrapper'>
                <div className='content__main'>
                    {/* =====ВЕРХНЯЯ СЕКЦИЯ==========*/}
                    <div className='content__dropdown'>
                        <div>
                            <div className='content__dropdown-description'>Выберите область:</div>
                            <Dropdown
                                menu={{
                                    items: districts,
                                }}
                                placement="bottomRight"
                            >
                                <Button ref={ref1} style={{width: '200px'}}>{district==='iv'?'Ивановская':district==='vl'?'Владимирская':district==='ya'?'Ярославская':'Область'}</Button>
                            </Dropdown>

                        </div>
                        <div className='content__settings'>
                            <Button ref={ref2} style={{width: '200px'}} onClick={generateDataBase}>Сгенерировать БД адресов</Button>
                            <Button style={{width: '200px'}} onClick={getInfoDataBase}>Получить инфу о БД</Button>
                            <Button ref={ref3} style={{width: '200px'}} onClick={generatePeople}>Заселить 5000 человек</Button>
                            <Button style={{width: '200px'}} onClick={deleteDataBase}>Удалить БД</Button>
                        </div>
                    </div>

                   {/* =====СРЕДНЯЯ СЕКЦИЯ==========*/}
                    <div className='content__main-middle'>
                        <div className='content__main-params'>
                            <div className='content__dropdown-description-rel'>Выберите тип запроса:</div>
                            <Dropdown
                                menu={{
                                    items: searchQuery,
                                }}
                                placement="bottomRight"
                            >
                                <Button ref={ref4} style={{width: '200px'}}>{parseQuery(query)}</Button>
                            </Dropdown>
                        </div>
                        <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.5)', height: '171px'}}></div>
                        <ParametersComponent forwardedRef={ref5} query={query} handleSearchResult={handleSearchResult} district={district} message={message}/>
                    </div>

                    {/* =====ТАБЛИЦА==========*/}
                    <div className='table-data'>
                        <TableComponent data={loadedData} query={query}/>
                    </div>
                    {/* =====ИНФО О ЗАСЕЛЕННОСТИ==========*/}
                    {dbInitialInfo
                        ? <div className='progress-bar__wrapper'>
                            <span>Заселенность</span>
                            <div className='progress-bar__bar'>
                                <div style={{transform: `translateX(${dbInitialInfo.person===0?0:calculateProgress(dbInitialInfo)}px)`}}/>
                            </div>
                        </div>
                        : <div>Загрузка...</div>}
                </div>
            </div>
        </div>
    );
};


function TableComponent({data, query}) {

    //query: house,lastName,city,address
    //сюда придут после запроса данные в data (город, улица, дом, кол-во проживающих)
    const _dataType = {
        key: '1',
        city: 'Вичуга',
        street: 'Коммунистическая',
        building: 32,
        personCount: 14,
    }

    return (
        <div className='flex-column'>
            <Table dataSource={data}>
                <Column title="Город" dataIndex="city" key="city" />
                <Column title="Улица" dataIndex="street" key="street" />
                <Column title="Дом" dataIndex="building" key="building" />
            </Table>
        </div>
    )
}

function ParametersComponent({forwardedRef, query, handleSearchResult, district, message}) {

    const defineProperities = (value) => {
        const obj = {
            placeholder: null,
            endpoint: null
        }
        switch (value) {
            case 'house': obj.placeholder = 'Введите номер дома', obj.endpoint = 'house/'
                break
            case 'lastName': obj.placeholder = 'Введите фамилию', obj.endpoint = 'ENDPOINT2'
                break
            case 'city': obj.placeholder = 'Введите город', obj.endpoint = 'ENDPOINT3'
                break
            case 'address': obj.placeholder = 'Введите название улицы и номер дома', obj.endpoint = 'ENDPOINT4'
                break
            default:
                break
        }
        return obj
    }
    const props = defineProperities(query)


    const onSearch = async (e) => {
        const response = await fetch(`${BASE_URL + props.endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
             body: JSON.stringify(e.target)
        })
        const data = await response.json()
        console.log(data)
        handleSearchResult(data)
    }
    return (
        <div ref={forwardedRef} className='content__main-search'>
            <div className='content__dropdown-description-rel'>Параметры поиска</div>
            <Search  placeholder={props.placeholder} onSearch={onSearch} style={{ width: 200, paddingBottom: 5 }} />
            {message &&
                <Alert
                    message={message}
                    type="error"
                    showIcon
                />}
        </div>
    )

}


export default Task5Component;
