import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
icon: React.ComponentType<any>,
}
const AppIcon: React.FC<IconProps> = ({ name, size = 24, color = "#fff", icon = Feather }) => {
  const IconComponent = icon;
  return <IconComponent name={name} size={size} color={color} />;
};

export default AppIcon;