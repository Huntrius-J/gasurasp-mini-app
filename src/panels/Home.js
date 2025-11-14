import { Panel, PanelHeader, Header, DateInput, Button,ButtonGroup,Card, RichCell, Group, Cell, Avatar, Box, Text,ContentCard,SimpleCell,InfoRow, PanelHeaderBack, Separator, Spinner } from '@vkontakte/vkui';
import { useParams, useRouteNavigator, useSearchParams } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect , useLayoutEffect} from 'react';
import { Icon12User, Icon20CalendarCheckOutline } from '@vkontakte/icons';

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
        url = `https://stud.gasu.ru/api/Rasp?idAudLine=${selectedItem.id}&sdate=${formattedDate}`;
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

  const groupCardsByDate = () => {
    if (!data || !data.rasp) return [];
    
    const grouped = {};
    
    data.rasp.forEach((item) => {
      const dateKey = item.дата; // используем исходную дату из данных
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });
    
    return Object.entries(grouped);
  };

  useLayoutEffect(() => {
    fetchData(date);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setData([]);
    fetchData(newDate);
  };

  const groupedData = groupCardsByDate();
  
  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>{<Text weight="2" style={{fontSize:16}}>{getPanelHeader()}</Text>}</PanelHeader>
      <Group style={{padding: 12}}>
        <DateInput style={{textAlign:"center"}} value={date} onChange={handleDateChange} after=""  disabled={isLoading} defaultValue={new Date()} accessible/>
      </Group>
      {isLoading ? (<Spinner style={{alignContent: "center", flex: 1}} size="xl" />) :""}

      <Group mode="card">
        {groupedData.length > 0 ? (
          groupedData.map(([dateKey, items], groupIndex) => (
            <div key={dateKey}>

              <RichCell
                style={{backgroundColor:"#004d9f", marginInline: 12, borderRadius:8, minHeight:0 }}
                beforeAlign="center"
                contentAlign="center"
                afterAlign="center"
                before={<Icon20CalendarCheckOutline />}
              >
                <Text weight="2" style={{color: "white"}}>{new Date(dateKey).toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</Text>
              </RichCell>

              {items.map((item, index) => ( 
                <RichCell
                  key={`${dateKey}-${index}`}
                  beforeAlign="center"
                  contentAlign="left"
                  afterAlign="center"
                  multiline
                  before={
                    <Card 
                      Component="div" 
                      style={{ 
                        backgroundColor: item.цвет,
                        minWidth: 50,
                        borderRadius: 8
                      }}
                    >
                      <Box 
                        style={{ 
                          flex: 1, 
                          textAlign: "center", 
                          alignContent: "center",
                          padding: "12px 8px"
                        }} 
                        minBlockSize={70}
                      >
                        <Text weight="2" style={{ fontSize: 16, lineHeight: 1.2, color: "white"}}>
                          {item.начало}
                        </Text>
                        <Text 
                          style={{ 
                            fontSize: 12, 
                            opacity: 0.8,
                            lineHeight: 1.2,
                            marginTop: 2,
                            color: "white"
                          }}
                        >
                          {item.конец}
                        </Text>
                      </Box>
                    </Card>
                  }
                  after={
                    <div style={{ textAlign: "center" }}>
                      <Text weight="2" style={{ fontSize: 14 }}>
                        {item.аудитория}
                      </Text>
                      {item.преподаватель && (
                        <Text 
                          style={{ 
                            fontSize: 12, 
                            color: "var(--vkui--color_text_secondary)",
                            marginTop: 4
                          }}
                        >
                          {item.преподаватель}
                        </Text>
                      )}
                    </div>
                  }
                >
                  <div style={{ padding: "4px 0" }}>
                    <Text 
                      weight="2" 
                      style={{ 
                        fontSize: 16, 
                        lineHeight: 1.3,
                        marginBottom: 4
                      }}
                    >
                      {item.дисциплина}
                    </Text>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon20CalendarCheckOutline style={{ color: "var(--vkui--color_icon_secondary)" }} />
                        <Text 
                          style={{ 
                            fontSize: 14,
                            color: "var(--vkui--color_text_secondary)"
                          }}
                        >
                          {new Date(item.дата).toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </Text>
                      </div>
                      
                      {item.группа && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Icon12User style={{ color: "var(--vkui--color_icon_secondary)" }} />
                          <Text 
                            style={{ 
                              fontSize: 14,
                              color: "var(--vkui--color_text_secondary)"
                            }}
                          >
                            {item.группа}
                          </Text>
                        </div>
                      )}
                    </div>
                    
                    {item.тип && (
                      <Text 
                        style={{ 
                          marginTop: 4,
                          color: "var(--vkui--color_accent_violet)",
                          fontSize: 14
                        }}
                      >
                        {item.тип}
                      </Text>
                    )}
                  </div>
                </RichCell>
              ))}
            </div>
          ))
        ) : isLoading ? "" : (
          <Text style={{ textAlign: "center", padding: 20 }}>Нет расписания</Text>
        )}
      </Group>
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
