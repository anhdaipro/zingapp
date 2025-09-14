import React,{useEffect,useMemo,useState} from "react";
import { View, StyleSheet,ScrollView,FlatList,TouchableHighlight,Text,Image, GestureResponderEvent, TouchableOpacity} from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis,VictoryLabel,VictoryGroup,VictoryScatter,VictoryLegend,Line } from "victory-native";
import { ScatterSymbolType } from "victory-core"; // Import ScatterSymbolType
import { useSongStore,Song } from "../store/songStore"
import LinearGradient from 'react-native-linear-gradient'
import { COLORS } from "../types/theme";
import Icon from "react-native-vector-icons/MaterialIcons"; // hoặc Feather
import { GestureHandlerEvent } from "react-native-reanimated/lib/typescript/hook";
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useShallow } from "zustand/shallow";
const series = [
  {
    name: "Canada",
    data: [
      3.9670002, 5.2650003, 6.201,
      7.8010006, 9.694, 11.214001,
      11.973001, 12.250001, 12.816001,
      13.413001, 13.626961, 14.30356,
      15.295461,
    ],
  },
  {
    name: "Germany",
    data: [
      36.903002, 28.712002, 30.979002,
      33.477, 38.614002, 44.58, 
      49.435, 55.58, 58.721004, 
      50.742004, 52.201004, 43.833004, 
      46.315,
    ],
  },
  {
    name: "India",
    data: [
      19.184001, 16.179, 17.2997,
      18.4204, 22.465302, 25.08819,
      28.700441, 32.84846, 35.288105,
      37.50518, 38.558605, 40.06727,
      41.929783,
    ],
  },
];

const symbols:ScatterSymbolType[] = [
  "circle",
  "diamond",
  "plus",

];

export const ZingChart:React.FC = () => {
  const colors:string[] = ["#ff0000", "#00ff00", "#0000ff"];
  const {fetchSongs,setSongPlay,song,topsong,setVisible,setViewVisible} = useSongStore(useShallow((state) => ({
    fetchSongs: state.fetchSongs,
    setSongPlay: state.setSongPlay,
    song: state.song,
    topsong: state.topsong,
    setVisible: state.setVisible,
    setViewVisible: state.setViewVisible
  })));
  const [selectedPoint, setSelectedPoint] = useState<{x:number, y: number} | null>(null)
  const [chartLayout, setChartLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  useEffect(()=>{
    fetchSongs();
  },[fetchSongs])
  const setViewModal = (song:Song) =>{
    setVisible(true)
    setSongPlay(song)
  }
  return (
    <ScrollView contentContainerStyle={[styles.container,{paddingBottom: song.id ? 64 : 4}]}>
      <LinearGradient 
      colors={['#170f23', '#432275', '#2a2139']} 
      style={{position:'relative'}}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setChartLayout({ width, height });
      }}
    >
    
      <VictoryChart
        padding={{
          top: 30,
          left: 32,
          right: 32,
          bottom: 40,
        }}
        theme={VictoryTheme.clean}
      >
        
        <VictoryAxis //trục x
          tickValues={Array.from({ length: 13 }, (_, i) => 20-12+i)}
          tickLabelComponent={<VictoryLabel dy={-10} />} // Dịch xuống
          style={{
            tickLabels: {//nhãn trục x
              fontSize: 10,//label
              fill:'#fff', // màu label
              
            },
            ticks: {//tùy chỉnh dấu tích trên mục
              stroke: "transparent",//màu dấu tích
              size: 10,
            },
            grid: { stroke: "transparent" }, // Đường lưới
          }}
        />
        <VictoryAxis //trục y
          dependentAxis
          label="Total Capacity"
          tickValues={Array.from({ length: Math.ceil(90 / 30) }, (_, i) => i * 40)}
          tickFormat={(value) =>
            `${value} GW`
          }
          style={{
            axis: {
              stroke: "transparent",
            },
            axisLabel: {
              fontSize: 8,
              padding: 50,
            },
            tickLabels: {
              fontSize: 8,
            },
            grid: {
              stroke: "transparent",
              // strokeWidth: 5,
            },
          }}
        />
        {series.map((s, i) => (
          <VictoryGroup
            data={s.data.map((d, i:number) => ({
              x: i + 20-12,
              y: d,
            }))}
            key={s.name}
          >
            <VictoryLine
              style={{
                data: {
                  stroke:`${colors[i]}`,
                  strokeWidth: 1,
                },
              }}
            />
            <VictoryScatter
              size={5}
              symbol='circle'
              style={{
                data: {
                  fill: '#fff',
                  stroke:`${colors[i]}`,
                  strokeWidth:2,
                },
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPressIn: (event: any, props) => {
                      const { locationX, locationY } = event.nativeEvent; // locationX: Vị trí theo trục X (ngang) của điểm chạm bên trong View chứa nó. locationY: Vị trí theo trục Y (dọc) của điểm chạm bên trong View chứa nó.
                      setSelectedPoint({ x: locationX, y: locationY });
                    },
                  },
                },
              ]}
            />
          </VictoryGroup>
        ))}
        {/* <VictoryLegend
          itemsPerRow={4}
          x={50}
          y={220}
          data={series.map((s,i) => ({
            name: s.name,
            symbol: {
              fill: `${colors[i]}`,
              type: symbols[
                series.indexOf(s)
              ],
            },
          }))}
          style={{
            data: {
              fill: ({ datum }) =>
                datum.symbol.fill,
            },
            labels: {
              fontSize: 8,
            },
            border: {
              stroke: "transparent",
            },
          }}
        /> */}
        
      </VictoryChart>
      {selectedPoint && (
        <View style={{flexDirection:'row',gap:4, position: "absolute", left: selectedPoint.x, top: selectedPoint.y-20,transform: [{ translateX: '-50%' },{translateY:'-100%'}],backgroundColor:'#fff', padding:4}}>
           <Image style={styles.img_small} source={{uri: song.image_cover}}/>
            <View style={{flexDirection:'row', gap:4}}>
              <AntDesign name="eyeo" size={20}/>
              <Text>1</Text>
            </View>
          
        </View>
        
      )}
      </LinearGradient>
      
      <LinearGradient
            start={{ x: 0.2, y: 0.2 }} // Bắt đầu từ trên
            end={{ x: 0.3, y: 0.6 }} // Kết thúc ở dưới
            locations={[0,0.4]}
            colors={['#170f23', COLORS.primaryBlackRGBA]}
            style={{// Gradient sẽ phủ toàn bộ màn hình
              borderRadius:12,
              paddingHorizontal:12,
              // marginTop:-10
            }}
          >
            <View style={styles.column}>
              {topsong.map((song) => (
                <TouchableHighlight
                  onPress={() => setSongPlay(song)}
                  key={song.id}
                  activeOpacity={0.6}
                  underlayColor = {COLORS.textSecond}
                  style={[styles.button,{width:'100%'}]}
                >
                  <View  style={[styles.songItem,]}>
                  <Image style={styles.img_small} source={{uri: song.image_cover}}/>
                  <View style={{flex:1}}>
                  <Text numberOfLines={2}  style={[styles.text_info]}>{song.name}</Text>
                  <Text  style={styles.text_info}>{song.artist_name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setViewModal(song)
                    setViewVisible(1)
                    }}>
                    <Icon name="more-vert" size={24} color={COLORS.primaryWhiteHex} /> 
                  </TouchableOpacity>
                </View>
                
                </TouchableHighlight>
                
              ))}
            </View>
            <TouchableOpacity style={styles.flex_center}>
           
            <Text style={styles.text_info}>Xem thêm</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color={'#fff'}/>
          
            </TouchableOpacity>
            
          </LinearGradient>
         
        <View>
          <Text style={styles.text_info}>#zingchart tuần</Text>
          <View>
            <Image source={{uri:song.image_cover}} style={styles.img_large}/>
            <View>
              <Text style={{textTransform:'uppercase', color:'fff'}}>v-pop</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,//mở rộng scroll view
    backgroundColor:COLORS.primaryBlackRGBA,
    gap:20,
    
  },
  flex_center:{
    flexDirection:'row',
    alignItems:'center',
   justifyContent:'center',
    gap:2,
  },
  column: {
    flexDirection: 'column', // Các phần tử trong mỗi cột sắp xếp theo chiều dọc
    gap: 12,
    alignItems:'flex-start',
    justifyContent:'flex-start',
  },
  item_view:{
    gap: 8,
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'flex-start',
  },
  songItem: {
    alignItems: 'center',
    flexDirection:'row',
    paddingHorizontal:6,
    paddingVertical: 6,
    borderRadius: 20,
    gap:12,
  },
  img_small:{
    width:40,
    height:40,
    borderRadius:4,
    resizeMode:'contain',
  },
  img_large:{
    width:160,
    height:160,
    borderRadius:8,
    resizeMode:'contain',
  },
  button:{
    borderRadius:4
  },
  text_info:{
    color:COLORS.primaryWhiteHex,
      
  },
});