import Pokemon from "@/interface/Pokemon";
import { alternarFavorito, ehFavorito } from "@/service/FavoritesStorage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

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
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadFavorite = async () => {
            if (!pokemon.pokemon_id) return;
            setIsFavorite(await ehFavorito(pokemon.pokemon_id));
        };

        loadFavorite();
    }, [pokemon.pokemon_id]);

    const handleFavorite = async () => {
        if (!pokemon.pokemon_id) return;

        const newValue = await alternarFavorito(pokemon.pokemon_id);
        setIsFavorite(newValue);
    };

    const Type1Icon = pokemon.types
        ? typeIcons[pokemon.types.type1]?.default || typeIcons[pokemon.types.type1]
        : null;

    const Type2Icon = pokemon.types?.type2
        ? typeIcons[pokemon.types.type2]?.default || typeIcons[pokemon.types.type2]
        : null;

    const getStat = (name: string) => {
        return pokemon.stats?.find(
            (stat) => stat.stat.name === name
        )?.base_stat;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.name}>
                {pokemon.pokemon_name
                    .split("-")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                    )
                    .join(" ")}
            </Text>

            <Text style={styles.id}>
                Pokédex #{pokemon.pokemon_id}
            </Text>

            <Pressable
                style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
                onPress={handleFavorite}
            >
                <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
                    {isFavorite ? "♥" : "♡"}
                </Text>
                <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>
                    {isFavorite ? "Favoritado" : "Adicionar aos favoritos"}
                </Text>
            </Pressable>

            <Image
                source={{ uri: pokemon.pokemon_image }}
                style={styles.image}
                contentFit="contain"
            />

            <View style={styles.types}>
                {Type1Icon && (
                    <Type1Icon width={50} height={50} />
                )}

                {Type2Icon && (
                    <Type2Icon width={50} height={50} />
                )}
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Informações</Text>
                <Text style={styles.infoText}>Altura: {pokemon.height} dm</Text>
                <Text style={styles.infoText}>Peso: {pokemon.weight} hg</Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Status</Text>
                <Text style={styles.infoText}>HP: {getStat("hp")}</Text>
                <Text style={styles.infoText}>Ataque: {getStat("attack")}</Text>
                <Text style={styles.infoText}>Defesa: {getStat("defense")}</Text>
                <Text style={styles.infoText}>Ataque Especial: {getStat("special-attack")}</Text>
                <Text style={styles.infoText}>Defesa Especial: {getStat("special-defense")}</Text>
                <Text style={styles.infoText}>Velocidade: {getStat("speed")}</Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Habilidades</Text>
                {pokemon.abilities?.map((ability, index) => (
                    <Text key={index} style={styles.infoText}>
                        • {ability.ability.name}
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#F7FAFC",
    },
    name: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
    id: {
        fontSize: 16,
        color: "#718096",
        marginBottom: 10,
        textAlign: "center",
    },
    favoriteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CBD5E0",
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginBottom: 10,
    },
    favoriteButtonActive: {
        backgroundColor: "#FFF5F5",
        borderColor: "#FC8181",
    },
    favoriteIcon: {
        fontSize: 23,
        color: "#718096",
        marginRight: 8,
    },
    favoriteIconActive: {
        color: "#E53E3E",
    },
    favoriteText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#4A5568",
    },
    favoriteTextActive: {
        color: "#E53E3E",
    },
    image: {
        width: 250,
        height: 250,
    },
    types: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },
    infoCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: "center",
    },
});