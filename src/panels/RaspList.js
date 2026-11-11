import { Panel, PanelHeader, Group, Text, CellButton, CustomSelect, Search, Spinner,Tabs, TabsItem,Snackbar} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useLayoutEffect, useState, useRef, useEffect} from 'react';
import { Icon16BuildingOutline, Icon16User, Icon16Users,Icon24BuildingOutline, Icon24User, Icon24Users, Icon24Favorite} from '@vkontakte/icons';

export const RaspList = ({id}) => {
  const [snackbar, setSnackbar] = useState(null);
  const routeNavigator = useRouteNavigator();
  const [data,setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filter,setFilter] = useState("");
  const [filteredData,setFilteredData] = useState();
  const [searchBy,setSearchBy] = useState("raspGroupList");
  const [selectIcon,setSelectIcon] = useState(<Icon16Users></Icon16Users>);
  const platform = window.WebApp.platform;
  const storage = (platform=='android' || platform=='ios' || platform=='desktop')?window.WebApp.DeviceStorage:window.localStorage;
  var message = '';
  const showSnackbar = () => {
    if (snackbar) return;
    setSnackbar(
      <Snackbar
        onClosed={() => setSnackbar(null)}
        action="Поделиться"
      >
      {message}
      </Snackbar>,
    );
  };

  function getAllFavorites() {
    console.log(platform);
    return Promise.resolve(storage.getItem('favorite_ids')).then((result) => {
      const data = (platform=='android' || platform=='ios' || platform=='desktop')?result.value:result;

      if (!data) {
        return []; 
      }
      let ids = [];
      if(platform == desktop)
      {
        ids = data.split(',').filter(Boolean);
      }
      else
      {
        ids = JSON.parse(data);
      }

      const promises = ids.map(id => {
      return Promise.resolve(storage.getItem(id)).then((itemResult) => {
        const itemValue = (platform=='android' || platform=='ios' || platform=='desktop') ? itemResult?.value : itemResult;
        return { id: id, value: itemValue };
      });
    });

      return Promise.all(promises).then((results) => {
        console.log(results);
        return results
          .filter(item => item && item.value)
          .map(item => {
            const [type, name] = item.value.split('::');
            return {
              id: item.id,
              type: type,
              name: name
            };
          });
      });
    }).catch(() => {
      storage.setItem('favorite_ids', JSON.stringify([]));
      return [];
    });;
  }

  const fetchData = async (searchBy) => {
      if(searchBy == 'raspFavour')
      {
        getAllFavorites().then(favorites => {
          setFilteredData(favorites);
          console.log(favorites);
        });
      }
      else
      {
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
    else if (searchBy === 'raspFavour') {
      searchParams.set('type', item.type);
      searchParams.set('id', item.id.toString());
      searchParams.set('name', item.name);
    }

    routeNavigator.push(`/rasp?${searchParams.toString()}`);
  }

  const tabRef = useRef(null);
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    if (!tabRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsCompact(entry.contentRect.width < 417);
      }
    });

    observer.observe(tabRef.current);
    return () => observer.disconnect();
  }, []);


    return(      

          <Panel id={id}>
            <Group style={{paddingInline: 15}}>
              <Tabs getRootRef={tabRef} mode="accent" defaultSelectedId="raspGroupList" layoutFillMode="stretched"
              onSelectedIdChange={(id) => changeSearch(id)}
              >
                <TabsItem id="raspGroupList">
                  <span style={{ 
                      display: 'inline-flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: '4px' 
                    }}>
                    <Icon24Users />
                      <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: 'inline-block', textAlign:'center' }}>
                        {isCompact ? "Группа" : "Группа"}
                      </span>
                  </span>
                </TabsItem>
                <TabsItem id="raspTeacherList">
                  <span style={{ 
                    display: 'inline-flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Icon24User />
                      <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: 'inline-block', textAlign:'center' }}>
                        {isCompact ? "Препод." : "Преподаватель"}
                      </span>
                  </span>
                </TabsItem>
                <TabsItem id="raspAudList">
                  <span style={{ 
                    display: 'inline-flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: '4px' 
                  }}>
                    <Icon24BuildingOutline />
                      <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: 'inline-block', textAlign:'center' }}>
                        {isCompact ? "Ауд." : "Аудитория"}
                      </span>
                  </span>
                </TabsItem>
                {platform !== 'web' && (
                  <TabsItem id="raspFavour">
                    <span style={{ 
                      display: 'inline-flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: '4px' 
                    }}>
                      <Icon24Favorite />
                      <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: 'inline-block', textAlign: 'center' }}>
                        {isCompact ? "Избр." : "Избранное"}
                      </span>
                    </span>
                  </TabsItem>
                )}
              </Tabs>
            {/* <CustomSelect
              style={{textAlign:"center"}}
              before={selectIcon}
              defaultValue="raspGroupList"
              onChange={(event) => changeSearch(event.target.value)}
              options={[
                { before:<Icon16Users></Icon16Users>, value: 'raspGroupList', label: 'По группам' },
                { before: <Icon16User></Icon16User>, value: 'raspTeacherList', label: 'По преподавателям' },
                { before: <Icon16BuildingOutline></Icon16BuildingOutline>, value: 'raspAudList', label: 'По аудиториям' },
              ]}
            /> */}
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
          {snackbar}
          </Panel>

      )
}

RaspList.propTypes = {
  id: PropTypes.string.isRequired
};

