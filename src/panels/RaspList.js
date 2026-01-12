import { Panel, PanelHeader, Group, Text, CellButton, CustomSelect, Search, Spinner } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useLayoutEffect, useState } from 'react';
import { Icon16BuildingOutline, Icon16User, Icon16Users } from '@vkontakte/icons';

export const RaspList = ({id}) => {
  const routeNavigator = useRouteNavigator();
  const [data,setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filter,setFilter] = useState("");
  const [filteredData,setFilteredData] = useState();
  const [searchBy,setSearchBy] = useState("raspGroupList");
  const [selectIcon,setSelectIcon] = useState(<Icon16Users></Icon16Users>);

  const fetchData = async (searchBy) => {
      setIsLoading(true);
      try {
        const year = new Date().getFullYear();

        const url2 = 'https://stud.gasu.ru/api/Rasp/ListYears'

        const response2 = await fetch(url2);
        const result2 = await response2.json();
        
        const url = `https://stud.gasu.ru/api/${searchBy}?year=${result2.data.years[result2.data.years.length-1]}`;
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
        setFilteredData([]);
        fetchData(value);
        
        if (value === 'raspGroupList') {
          setSelectIcon(<Icon16Users></Icon16Users>);
        } else if (value === 'raspTeacherList') {
          setSelectIcon(<Icon16User></Icon16User>);
        } else if (value === 'raspAudList') {
          setSelectIcon(<Icon16BuildingOutline></Icon16BuildingOutline>);
        }
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

    routeNavigator.push(`/rasp?${searchParams.toString()}`);
  }


    return(      

          <Panel id={id}>
            <Group style={{paddingInline: 15}}>
            <CustomSelect
              style={{textAlign:"center"}}
              before={selectIcon}
              defaultValue="raspGroupList"
              onChange={(event) => changeSearch(event.target.value)}
              options={[
                { before:<Icon16Users></Icon16Users>, value: 'raspGroupList', label: 'По группам' },
                { before: <Icon16User></Icon16User>, value: 'raspTeacherList', label: 'По преподавателям' },
                { before: <Icon16BuildingOutline></Icon16BuildingOutline>, value: 'raspAudList', label: 'По аудиториям' },
              ]}
            />
            <Search style={{paddingInline:0,paddingBottom:0}} after="" name="input" value={filter} onChange={(event) => filterData(event.target.value)} placeholder="Введите для поиска" />
          </Group>
          {isLoading ? (<Spinner style={{alignContent: "center", flex: 1}} size="xl" />) :""}
          <Group>
          {filteredData!=null ? filteredData.map((item,index) => (
          <CellButton key={index} centered onClick={() => handleItemClick(item)} appearance="neutral">
            <Text >{item.name}</Text>
          </CellButton>
          )):""}
          </Group>
          </Panel>

      )
}

RaspList.propTypes = {
  id: PropTypes.string.isRequired
};

