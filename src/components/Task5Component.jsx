import React, {useEffect, useRef, useState} from 'react';
import './styles.css'
import {Alert, Button, Dropdown, Input, message, Modal, Spin, Table, Tag, Tour} from "antd";
import {Link} from "react-router-dom";
import {female, male, streetNames, text1} from "../constants";
const { Column, ColumnGroup } = Table;
const { Search } = Input;


const DISTRICT_MESSAGE = 'Не выбрана область'
const FULLFILL_MESSAGE = 'Нет квартир'

const Task5Component = () => {
    const [query, setQuery] = useState('')
    const [district, setGeneratedDistrict] = useState(null)
    const [loadedData, setLoadedData] = useState(null)
    const [dbInitialInfo, setInitialInfo] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
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
                <div onClick={() => {
                    info('lastName')
                    setQuery('lastName')
                }}>
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
                <div onClick={() => {
                    info('streets')
                    setQuery('address')
                }}>
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
            description: 'Населенные пункты областей будут совпадать, остальные данные будут сгенерированны случайно. ' +
                'Ввиду ограничений по памяти номера домов будут от 1 до 20',
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
        getInfoDataBase('initial')
    },[])

    const info = (info, data = null) => {
        let title
        let content
        if(info==='db') {
            title = "Краткая инфа о базе данных"
            content =
                <div>
                    <p>Количество городов: {data?.city}</p>
                    <p>Количество квартир: {data?.apartment}</p>
                    <p>Количество жильцов: {data?.person}</p>
                </div>
        }
        if(info==='lastName') {
            title = "Список доступных фамилий"
            content =
                <div>
                    <p style={{maxWidth: '350px'}}><strong>Мужские:</strong> {male.join(', ')}</p>
                    <p style={{maxWidth: '350px'}}><strong>Женские:</strong> {female.join(', ')}</p>
                </div>
        }
        if(info.includes('забанен')) {
            title = "Вы уволены"
            content =
                <div>
                    <p style={{maxWidth: '350px'}}>{text1}</p>
                </div>
        }
        if(info==='streets') {
            title = "Список доступных улиц"
            content =
                <div>
                    <p>В строку ввести название улицы и через пробел номер дома от 1 до 20</p>
                    <p style={{maxWidth: '350px'}}>{streetNames.join(', ')}</p>
                </div>
        }
        Modal.info({
            title: title,
            content: content,
            onOk() {
            },
        });
    };
    const notificator = (value) => {
        messageApi.open({
            type:
                value==='База данных успешно создана'
                ||value==='Люди успешно заселены'
                ||value==='База успешно очищена'?'success':'error',
            content: value,
        });
    };
    function handleSearchResult(data, taskNumber) {
        let filteredData


        switch (taskNumber) {
            case 1:
            case 3: filteredData = {
                task: taskNumber,
                data: data.map(item => (
                    {
                        key: item.house_id,
                        city: item.city_name,
                        street: item.street_name,
                        personCount: item.personcount ? +item.house_number%2===0 ? item.personcount : 'скрыто' : 0
                    }
                ))
            }
                break
            case 2: filteredData = {
                task: taskNumber,
                data: data.map(item => (
                    {
                        key: item.person_id,
                        lastName: item.person_lastName,
                        houseName: item.house_number,
                        passportId: item.person_passportId,
                    }
                ))
            }
                break
            case 4: filteredData = {
                task: taskNumber,
                data: data.map(item => (
                    {
                        key: item.house_id+item.postalCode_code,
                        city: 'г.'+item.city_name+', ул.'+item.street_name+', д.'+item.house_number,
                        postalCode: item.postalCode_code,
                        ifnsCode: item.ifnsCode_code,
                        okatoCode: item.okatoCode_code,
                    }
                ))
            }
                break
        }
        if(!taskNumber) {
            setLoadedData(null)
        }
        if(filteredData) {
            setLoadedData(filteredData)
        }
    }
    async function generateDataBase() {
        if(!district) {
            setErrorMessage(DISTRICT_MESSAGE)
            return
        }
        setErrorMessage(null)
        setIsLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}region/populate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({name: district})
            })
            const data = await response.json()
            notificator(data.message)

            if(data.count)
                setInitialInfo(data.count)
            getInfoDataBase('initial')
            setIsLoading(false)
        } catch (e) {
            notificator(e.message)
            setIsLoading(false)
        }
    }
    async function deleteDataBase() {
        setIsLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}region/populate`, {
                method: 'DELETE',
            })
            const data = await response.json()
            notificator(data.message)
            setInitialInfo({city:0, person:0, apartment:0})
            setIsLoading(false)
        } catch (e) {
            notificator(e.message)
            setIsLoading(false)
        }
    }
    async function getInfoDataBase(state=null) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}region/quantity`, {
                method: 'GET',
            })
            const data = await response.json()
            setInitialInfo(data.count)
            if(state==='initial') return
            info('db', data.count)
        } catch (e) {
            notificator(e.message)
        }

    }
    async function generatePeople() {
        if(!dbInitialInfo.apartment) {
            setErrorMessage(FULLFILL_MESSAGE)
            return
        }
        if(dbInitialInfo.person>0 && dbInitialInfo.apartment/dbInitialInfo.person<1) {
            deleteDataBase().then(() => {
                banMePlease()
            })
            return
        }
        setErrorMessage(null)
        setIsLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}person/batch`, {
                method: 'POST',
            })
            const data = await response.json()
            setIsLoading(false)
            notificator(data.message)
            if(data.count) {
                setInitialInfo(data.count)
            }
            getInfoDataBase('initial')
        } catch(e) {
            notificator(e.message)
        }
    }
    async function banMePlease() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}banme`, {
                method: 'POST',
            })
            const data = await response.json()
            info(data.message)
        } catch (e) {
            notificator('Ошибка доступа к серверу',e)
        }
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
                {contextHolder}
                <Tour open={isOpen} onClose={() => setTourOpen(false)} steps={steps} />
                <Button style={{backgroundColor: '#54e400'}} onClick={() => setTourOpen(true)}>Инструкция</Button>
                <Button >
                    <Link className='link' to={`/`}> {'< Назад'}</Link>
                </Button>
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
                            <Button disabled={isLoading} ref={ref2} style={{width: '200px'}} onClick={generateDataBase}>Сгенерировать БД адресов</Button>
                            <Button disabled={isLoading} style={{width: '200px'}} onClick={getInfoDataBase}>Получить инфу о БД</Button>
                            <Button disabled={isLoading} ref={ref3} style={{width: '200px'}} onClick={() => generatePeople()}>Заселить 5000 человек</Button>
                            <Button disabled={isLoading} style={{width: '200px'}} onClick={deleteDataBase}>Удалить БД</Button>
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

                        <ParametersComponent
                            forwardedRef={ref5}
                            query={query}
                            handleSearchResult={handleSearchResult}
                            message={errorMessage}
                            setLoading={setIsLoading}
                            setMessage={setErrorMessage}
                            notificator={notificator}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* =====ТАБЛИЦА==========*/}
                    <div className='table-data'>
                        <TableComponent loadedData={loadedData} query={query} isLoading={isLoading}/>
                    </div>
                    {/* =====ИНФО О ЗАСЕЛЕННОСТИ==========*/}
                    {dbInitialInfo
                        && <div className='progress-bar__wrapper'>
                            <span>Заселенность</span>
                            <div className='progress-bar__bar'>
                                <div style={{transform: `translateX(${dbInitialInfo.person===0?0:calculateProgress(dbInitialInfo)}px)`}}/>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    );
};


function TableComponent({loadedData}) {

    const data = defineColumns(loadedData)
    function defineColumns(loadedData) {
        let obj = {
            dataSource: loadedData ? loadedData.data : null,
            columns: [{
                title: 'Город',
                dataIndex: 'city',
                key: 'city'
            }, {
                title: 'Улица',
                dataIndex: 'street',
                key: 'street'
            }, {
                title: 'Дом',
                dataIndex: 'number',
                key: 'number'
            }]
        }
        if(!loadedData) {
           return obj
        }
        switch (loadedData.task) {
            case 1:
            case 3:
                obj.columns=[{
                title: 'Город',
                dataIndex: 'city',
                key: 'city'
            }, {
                title: 'Улица',
                dataIndex: 'street',
                key: 'street'
            }, {
                title: 'Дом',
                dataIndex: 'number',
                key: 'number'
            }, {
                title: 'Кол-во проживающих',
                dataIndex: 'personCount',
                key: 'personCount'
            }]
                break
            case 2: obj.columns=[{
                title: 'Фамилия',
                dataIndex: 'lastName',
                key: 'lastName'
            }, {
                title: 'Номер дома',
                dataIndex: 'houseName',
                key: 'houseName'
            }, {
                title: 'Номер паспорта',
                dataIndex: 'passportId',
                key: 'passportId'
            }]
                break
            case 4: obj.columns=[{
                title: 'Адрес',
                dataIndex: 'city',
                key: 'city'
            }, {
                title: 'Почтовый индекс',
                dataIndex: 'postalCode',
                key: 'postalCode'
            }, {
                title: 'Код ИФНС',
                dataIndex: 'ifnsCode',
                key: 'ifnsCode'
            }, {
                title: 'Код ОКАТО',
                dataIndex: 'okatoCode',
                key: 'okatoCode'
            }]
        }

        return obj
    }

    return (
        <div className='flex-column'>
            <Table dataSource={data.dataSource} columns={data.columns} pagination={{position: ['bottomCenter'], showSizeChanger: false}} scroll={{y: 220}}/>
        </div>
    )
}

function ParametersComponent({forwardedRef, query, handleSearchResult, message, setLoading, setMessage,notificator, isLoading}) {

    const defineProperities = (value) => {
        const obj = {
            placeholder: null,
            endpoint: null,
            query: null,
            additionalParam: null
        }
        switch (value) {
            case 'house': obj.placeholder = 'Введите номер дома', obj.endpoint = 'house', obj.query = 'houseName'
                break
            case 'lastName': obj.placeholder = 'Введите фамилию', obj.endpoint = 'person', obj.query = 'lastName'
                break
            case 'city': obj.placeholder = 'Введите город', obj.endpoint = 'city', obj.query = 'cityName'
                break
            case 'address': obj.placeholder = 'Введите название улицы и номер дома', obj.endpoint = 'city/address',
                obj.query = 'cityName', obj.additionalParam = 'houseName'
                break
            default:
                break
        }
        return obj
    }
    const props = defineProperities(query)


    const onSearch = async (e) => {
        const validatedValue = validate(props, e)
        let additionalString = ''
        if (!validatedValue) return
        if (!props.endpoint) {
            setMessage('Выберите тип запроса')
            return
        }
        if (props.additionalParam) {
            additionalString = `&${props.additionalParam}=`
        } else additionalString = ''

        setMessage(null)
        setLoading(true)
        handleSearchResult(null, null)

        try {
            const response = await fetch(`${BASE_URL + props.endpoint}?${props.query}=${validatedValue.street ? validatedValue.street : validatedValue}${additionalString}${validatedValue.number?validatedValue.number:''}`, {method: 'GET'})
            const data = await response.json()
            setLoading(false)
            if(data.message==='Успех') {
                handleSearchResult(data.result, data.queryId)
            } else {
                notificator(data.message)
            }
        } catch (e) {
            if(typeof e==="string")
                notificator(e)
            setLoading(false)
        }

     }

    function validate(parameters, value) {
        if (parameters.endpoint === 'house') {
            const isNumber = !isNaN(value)
            if (!isNumber) {
                setMessage('Значение должно быть числом')
                return null
            }
            if (+value > 20) {
                setMessage('Номер дома не более 20!')
                return null
            }
            return value
        }
        if (parameters.endpoint === 'person') {
            let validated = value.replace(/\s/g, '')
            validated = validated.charAt(0).toUpperCase() + validated.slice(1)
            return validated
        }
        if (parameters.endpoint === 'city') {
            let validated = value.replace(/\s/g, '')
            validated = validated.charAt(0).toUpperCase() + validated.slice(1)
            return validated
        }
        if (parameters.endpoint === 'city/address') {
            const trimmedAddress = value.trim();
            const spaceIndex = trimmedAddress.indexOf(' ');
            let streetName
            let houseNumber

            if (spaceIndex !== -1) {
                let inputName = trimmedAddress.substring(0, spaceIndex);
                streetName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
                houseNumber = trimmedAddress.substring(spaceIndex + 1);
            } else setMessage('Неверный формат адреса')

            return {street: streetName, number: houseNumber};
        }

        setMessage('Ошибка')
        return null
    }

    return (
        <div ref={forwardedRef} className='content__main-search'>
            <div className='content__dropdown-description-rel'>Параметры поиска</div>
            <Search  loading={isLoading} placeholder={props.placeholder} onSearch={onSearch} style={{ width: 200, paddingBottom: 5 }} />
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
