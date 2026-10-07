import Pokemon from "@/interface/Pokemon";
import { alternarFavorito, ehFavorito } from "@/service/FavoritesStorage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { estilos } from "../../layout/layout";

export const typeIcons: Record<string, any> = {
    normal: require('@/assets/icons/normal.svg'),
    fire: require('@/assets/icons/fire.svg'),
    water: require('@/assets/icons/water.svg'),
    electric: require('@/assets/icons/electric.svg'),
    grass: require('@/assets/icons/grass.svg'),
    ice: require('@/assets/icons/ice.svg'),
    fighting: require('@/assets/icons/fighting.svg'),
    poison: require('@/assets/icons/poison.svg'),
    ground: require('@/assets/icons/ground.svg'),
    flying: require('@/assets/icons/flying.svg'),
    psychic: require('@/assets/icons/psychic.svg'),
    bug: require('@/assets/icons/bug.svg'),
    rock: require('@/assets/icons/rock.svg'),
    ghost: require('@/assets/icons/ghost.svg'),
    dragon: require('@/assets/icons/dragon.svg'),
    dark: require('@/assets/icons/dark.svg'),
    steel: require('@/assets/icons/steel.svg'),
    fairy: require('@/assets/icons/fairy.svg'),
};

interface ShowPokemonProps {
    pokemon: Pokemon;
}

export default function ShowPokemon({ pokemon }: ShowPokemonProps) {
    const Type1Icon = pokemon.types ? (typeIcons[pokemon.types.type1]?.default || typeIcons[pokemon.types.type1]) : null;

    const Type2Icon = pokemon.types?.type2 ? (typeIcons[pokemon.types.type2]?.default || typeIcons[pokemon.types.type2]) : null;

    const [favorito, setFavorito] = useState(false);

    useEffect(() => {
        if (pokemon.pokemon_id) {
            ehFavorito(pokemon.pokemon_id).then(setFavorito);
        }
    }, [pokemon.pokemon_id]);

    const handleFavorito = async () => {
        if (!pokemon.pokemon_id) return;
        const novoEstado = await alternarFavorito(pokemon.pokemon_id);
        setFavorito(novoEstado);
    };

    return (
        <View style={estilos.container}>
            <Text style={estilos.pokemonDisplayName}>
                {pokemon.pokemon_name
                    .split(' ')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
            </Text>
            <Text>Pokedex #{pokemon.pokemon_id}</Text>
            <Pressable
                onPress={handleFavorito}
                style={{
                    alignSelf: "center",
                    marginTop: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: favorito ? "#FED7D7" : "#EDF2F7",
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {favorito ? "❤️ Favoritado" : "🤍 Favoritar"}
                </Text>
            </Pressable>
            <View style={{ width: 300, height: 400, alignSelf: "center", justifyContent: "center" }}>
                {pokemon.pokemon_image ? (
                    <Image
                        source={{ uri: pokemon.pokemon_image }}
                        style={estilos.pokemonDisplayImage}
                        contentFit="contain"
                        transition={200}
                    />
                ) : (
                    <View style={{ width: 100, height: 100, backgroundColor: "#E2E8F0", borderRadius: 50 }} />
                )}
            </View>

            <View style={estilos.pokemonInfo}>
                {Type1Icon && (
                    <Type1Icon
                        width={50}
                        height={50}
                        style={estilos.pokemonTypeImage}
                    />
                )}
                {Type2Icon && (
                    <Type2Icon
                        width={50}
                        height={50}
                        style={estilos.pokemonTypeImage}
                    />
                )}
            </View>
        </View>
    );
}