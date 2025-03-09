import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
interface Tab{
    id:number;
    name:string;
}
export const defaultTabs:Tab[] = [
    { id: 1, name: "Tất cả" },
    { id: 2, name: "Việt Nam" },
    { id: 3, name: "Quốc tế" },
  ];
interface IconItem{
    title:string,
    icon:React.ComponentType<any>,
    name:string;
}
export const iconList: IconItem[] = [
    { title: "Tải về", icon: AntDesign, name: "download" },
    { title: "Thêm vào thư viện", icon: AntDesign, name: "hearto" }, // Không có type
    { title: "Thêm vào playlist", icon: MaterialCommunityIcons, name: "music-note-plus"},
    { title: "Phat bài hát & nội dung tương tự", icon: MaterialCommunityIcons, name: "music-box" },
    { title: "Thêm vào danh sách phát", icon: MaterialCommunityIcons, name: "music-note"},
    { title: "Phát kế tiếp", icon: MaterialIcons, name: "playlist-play"},
    { title: "Cài nhạc chờ & nhạc chuông", icon: MaterialCommunityIcons, name: "music-note"},
    { title: "Xem album", icon: MaterialIcons, name: "playlist-play"},
    { title: "Xem nghệ sĩ", icon: MaterialIcons, name: "playlist-play"},
    { title: "Chặn", icon: MaterialIcons, name: "block-flipped"},
  ];