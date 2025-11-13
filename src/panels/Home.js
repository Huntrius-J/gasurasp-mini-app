import { Panel, PanelHeader, Header, DateInput, Button,ButtonGroup,Card, RichCell, Group, Cell, Avatar, Box, Text,ContentCard,SimpleCell,InfoRow, PanelHeaderBack } from '@vkontakte/vkui';
import { useParams, useRouteNavigator, useSearchParams } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect , useLayoutEffect} from 'react';

export const Home = ({ id, fetchedUser ,raspData}) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  const [data, setData] = useState(raspData); 
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

   const [searchParams] = useSearchParams();
  // Формируем selectedItem из search params
  const type = searchParams.get('type');
  const idParam = searchParams.get('id');
  const name = searchParams.get('name');
  
  const selectedItem = type && idParam ? {
    type: type,
    id: idParam,
    name: name || 'Неизвестно'
  } : null;


  if(data != null)
  {
    console.log(data.rasp);
  }

  const fetchData = async (selectedDate) => {
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      //const url = `https://stud.gasu.ru/api/Rasp?idTeacher=762&sdate=${formattedDate}`;
      let url = '';
      
      if (selectedItem.type === 'group') {
        url = `https://stud.gasu.ru/api/Rasp?idGroup=${selectedItem.id}&sdate=${formattedDate}`;
      } else if (selectedItem.type === 'teacher') {
        url = `https://stud.gasu.ru/api/Rasp?idTeacher=${selectedItem.id}&sdate=${formattedDate}`;
      } else if (selectedItem.type === 'auditorium') {
        url = `https://stud.gasu.ru/api/Rasp?idAud=${selectedItem.id}&sdate=${formattedDate}`;
      }
      console.log('Fetching data from:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPanelHeader = () => {
    if (!selectedItem) return "Расписание";
    
    switch (selectedItem.type) {
      case 'group':
        return `${selectedItem.name}`;
      case 'teacher':
        return `${selectedItem.name}`;
      case 'auditorium':
        return `${selectedItem.name}`;
      default:
        return "Расписание";
    }
  };

  useLayoutEffect(() => {
    fetchData(date);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchData(newDate);
  };
  
  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>{getPanelHeader()}</PanelHeader>
      {fetchedUser && (
        <Group > header={<Header size="s">User Data Fetched with VK Bridge</Header>}
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}
      <Group>
        <DateInput alue={date} onChange={handleDateChange}  disabled={isLoading} defaultValue={new Date()} accessible/>
      </Group>
      {data!=null ? data.rasp.map((item,index) => ( 
        <Group key={index}>
            <RichCell
            beforeAlign="center"
            contentAlign="center"
            afterAlign="center"
            before={
              <Card Component="div" style={{  backgroundColor: `var(--vkui--color_accent_violet)` }}>
                <Box style={{ flex: 1, textAlign: "center", alignContent: "center"}} minBlockSize={70} minInlineSize={60}>
                  <Text ><strong>{item.начало}</strong></Text>
                  <Text ><strong>{item.конец}</strong></Text>
                </Box>
              </Card>
            }
            after={item.аудитория}
            afterCaption={item.преподаватель}
          >
            <Text weight="2" style={{whiteSpace: 'wrap'}}><strong>{item.дисциплина}</strong></Text>
            <Text> {new Date(item.дата).toLocaleDateString('ru-RU')}</Text>
            <Text>{item.группа}</Text>
          </RichCell></Group> )):<Text style={{ textAlign: "center"}}>Нет расписания</Text>}
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    rasp: PropTypes.shape({
      дисциплина: PropTypes.string
    })
  }),
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
