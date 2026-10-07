import ItemsIcon from "@/assets/icons/items.png";
import PokemonIcon from "@/assets/icons/pokemon.png";
import { Image } from "expo-image";
import { Text } from "react-native";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokémons",
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <Image source={PokemonIcon} style={{ width: size, height: size }} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <TextHeart size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: "Items",
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <Image source={ItemsIcon} style={{ width: size, height: size }} />
          ),
        }}
      />
      <Tabs.Screen
        name="pokemon"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function TextHeart({ size }: { size: number }) {
  return (
    <Text style={{ fontSize: size, lineHeight: size }}>♥</Text>
  );
}