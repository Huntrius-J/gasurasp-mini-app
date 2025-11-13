import { Panel, PanelHeader, Header,Input,Select, Button, Group, Cell, Avatar, Box, Text, CellButton, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';

export const Rasp = ({id}) => {
  const routeNavigator = useRouteNavigator();
  const [data,setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filter,setFilter] = useState("");
  const [filteredData,setFilteredData] = useState();
  const [searchBy,setSearchBy] = useState("raspGroupList");

  const fetchData = async (searchBy) => {
      setIsLoading(true);
      try {
        const year = new Date().getFullYear();
        const url = `https://stud.gasu.ru/api/${searchBy}?year=${year}-${year+1}`;
        console.log('Fetching data from:', url);
        
        const response = await fetch(url);
        const result = await response.json();
        setData(result.data);
        setFilteredData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const filterData = (value) =>
    {
      setFilter(value);
      if(data != null)
      {
        setFilteredData(data.filter(x => x.name.toLowerCase().includes(value.toLowerCase())));
      }
    }

    const changeSearch = (value) =>
    {
      if(searchBy != value)
      {
        setSearchBy(value);
        setFilter("");
        fetchData(value);
      }
    }

    useLayoutEffect(() => {
      fetchData(searchBy);
    }, []);

  const handleItemClick = (item) => {
    const searchParams = new URLSearchParams();
  
    if (searchBy === 'raspGroupList') {
      searchParams.set('type', 'group');
      searchParams.set('id', item.id.toString());
      searchParams.set('name', item.name);
    } else if (searchBy === 'raspTeacherList') {
      searchParams.set('type', 'teacher');
      searchParams.set('id', item.id.toString());
      searchParams.set('name', item.name);
    } else if (searchBy === 'raspAudList') {
      searchParams.set('type', 'auditorium');
      searchParams.set('id', item.id.toString());
      searchParams.set('name', item.name);
    }

    routeNavigator.push(`/home?${searchParams.toString()}`);
  }


    return(      

          <Panel id={id}>
            <PanelHeader >
              Расписание
            </PanelHeader>
            <Group>
            <Select
              defaultValue="raspGroupList"
              onChange={(event) => changeSearch(event.target.value)}
              options={[
                { value: 'raspGroupList', label: 'По группам' },
                { value: 'raspTeacherList', label: 'По преподавателям' },
                { value: 'raspAudList', label: 'По аудиториям' },
              ]}
            />
            </Group>
          <Group separator="hide">
            <Input name="input" value={filter} onChange={(event) => filterData(event.target.value)} placeholder="Введите группу" />
          </Group>
          <Group>
          {filteredData!=null ? filteredData.map((item,index) => (
          <CellButton key={index} onClick={() => handleItemClick(item)} appearance="neutral">
            <Text >{item.name}</Text>
          </CellButton>
          )):""}
          </Group>
          </Panel>

      )
}

Rasp.propTypes = {
  id: PropTypes.string.isRequired
};

