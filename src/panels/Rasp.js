import { Panel, PanelHeader, DateInput, Card, RichCell, Group, Box, Text, PanelHeaderBack, Spinner, } from '@vkontakte/vkui';
import { useRouteNavigator, useSearchParams } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import React, { useState, useLayoutEffect} from 'react';
import { Icon12User, Icon20CalendarCheckOutline } from '@vkontakte/icons';

export const Rasp = ({id}) => {
  const routeNavigator = useRouteNavigator();
  const [data, setData] = useState([]); 
  const [dataFull, setDataFull] = useState([]); 
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

   const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const idParam = searchParams.get('id');
  const name = searchParams.get('name');
  
  const selectedItem = type && idParam ? {
    type: type,
    id: idParam,
    name: name || 'Неизвестно'
  } : null;

  const fetchData = async (selectedDate) => {
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      let url = '';
      
      if (selectedItem.type === 'group') {
        url = `https://stud.gasu.ru/api/Rasp?idGroup=${selectedItem.id}&sdate=${formattedDate}`;
      } else if (selectedItem.type === 'teacher') {
        url = `https://stud.gasu.ru/api/Rasp?idTeacher=${selectedItem.id}&sdate=${formattedDate}`;
      } else if (selectedItem.type === 'auditorium') {
        url = `https://stud.gasu.ru/api/Rasp?idAudLine=${selectedItem.id}&sdate=${formattedDate}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      setData(result.data);

      if (selectedItem.type === 'group') {
        url = `https://stud.gasu.ru/api/Rasp?idGroup=${selectedItem.id}`;
      } else if (selectedItem.type === 'teacher') {
        url = `https://stud.gasu.ru/api/Rasp?idTeacher=${selectedItem.id}`;
      } else if (selectedItem.type === 'auditorium') {
        url = `https://stud.gasu.ru/api/Rasp?idAudLine=${selectedItem.id}`;
      }

      const response2 = await fetch(url);
      const result2 = await response2.json();
      setDataFull(result2.data);

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

  const getEvents = () => {
    if (!dataFull || !dataFull.rasp) return [];

      const events = [];

      dataFull.rasp.forEach((item) => {
        const eventDate = item.дата;
        const color = item.цвет;
        events.push({date:new Date(eventDate.split('T')[0]),color:color})
      });
      
    
    return events;

  }

  const groupCardsByDate = () => {
    if (!data || !data.rasp) return [];
    
    const grouped = {};
    
    data.rasp.forEach((item) => {
      const dateKey = item.дата;
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

  const events = getEvents();

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

  

  const renderDayContent = (day) => {
    const eventForDay = events.filter(event => 
      isSameDay(day, event.date)
    );
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <span>{day.getDate()}</span>

          <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: '2px',
          marginTop: '2px'
        }}>
            {eventForDay.slice(0, 3).map((event, index) => (
            <div 
              key={index}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: event.color,
                marginTop: '2px'
              }} 
            />
          ))}
            {eventForDay.length>3?(<span style={{
              fontSize: '10px',
              fontWeight: 'bold',
              width: '8px',
              height: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              +
            </span>) : ''}
          </div>
        </div>
      </div>
    );
  };

  const groupedData = groupCardsByDate();
  
  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>{<Text weight="2" style={{fontSize:16}}>{getPanelHeader()}</Text>}</PanelHeader>
      <Group style={{padding: 12}}>
        <DateInput renderDayContent={renderDayContent} style={{textAlign:"center"}} value={date} onChange={handleDateChange} after=""  disabled={isLoading} defaultValue={new Date()} accessible/>
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
                before={<Icon20CalendarCheckOutline style={{fill: "white"}}/>}
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

Rasp.propTypes = {
  id: PropTypes.string.isRequired,
};
