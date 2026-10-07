import Pokemon from "@/interface/Pokemon";
import { buscarFavoritos, limparFavoritos } from "@/service/FavoritesStorage";
import Requests from "@/service/PokemonsRequests";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function ListFavorites() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const carregarFavoritos = async () => {
        try {
            setIsLoading(true);

            const ids = await buscarFavoritos();

            const resultados = await Promise.all(
                ids.map(async (id) => {
                    try {
                        const data = await Requests.fetchPokemonData(String(id));

                        if (data && data.pokemon_info && data.pokemon_info.name) {
                            const pokemon: Pokemon = {
                                pokemon_name: data.pokemon_info.name,
                                pokemon_id: data.pokemon_id,
                                pokemon_image: data.pokemon_image,
                            };
                            return pokemon;
                        }
                    } catch (error) {
                        console.error(`Erro ao buscar pokemon ${id}:`, error);
                    }

                    return null;
                })
            );

            setPokemons(resultados.filter((p): p is Pokemon => p !== null));
        } catch (error) {
            console.error("Erro ao carregar favoritos:", error);
            setPokemons([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Recarrega toda vez que a aba ganha foco
    useFocusEffect(
        useCallback(() => {
            carregarFavoritos();
        }, [])
    );

    const handleLimpar = async () => {
        await limparFavoritos();
        setPokemons([]);
    };

    const formatName = (name: string) => {
        return name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const formatId = (id?: number) => {
        if (!id) return "";
        return `#${String(id).padStart(3, "0")}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favoritos</Text>
                <View style={styles.headerRow}>
                    <Text style={styles.counter}>⭐ {pokemons.length} favoritos</Text>
                    <Pressable
                        style={[styles.clearButton, pokemons.length === 0 && styles.clearButtonDisabled]}
                        onPress={handleLimpar}
                        disabled={pokemons.length === 0}
                    >
                        <Text style={styles.clearButtonText}>🗑 Limpar favoritos</Text>
                    </Pressable>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FF3E3E" />
                    <Text style={styles.loadingText}>Carregando favoritos...</Text>
                </View>
            ) : pokemons.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.noResultsText}>Nenhum favorito ainda</Text>
                </View>
            ) : (
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => String(item.pokemon_id)}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.card}
                            onPress={() => item.pokemon_id && router.push(`/pokemon/${item.pokemon_id}` as any)}
                        >
                            <View style={styles.idBadge}>
                                <Text style={styles.idText}>{formatId(item.pokemon_id)}</Text>
                            </View>

                            <View style={styles.imageContainer}>
                                {item.pokemon_image ? (
                                    <Image
                                        source={{ uri: item.pokemon_image }}
                                        style={styles.pokemonImage}
                                        contentFit="contain"
                                        transition={300}
                                    />
                                ) : (
                                    <View style={styles.imagePlaceholder} />
                                )}
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={styles.pokemonName}>
                                    {formatName(item.pokemon_name)}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
        width: "100%",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7FAFC",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#718096",
        fontWeight: "500",
    },
    noResultsText: {
        fontSize: 16,
        color: "#A0AEC0",
        fontWeight: "500",
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "800",
        color: "#2D3748",
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    counter: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2D3748",
    },
    clearButton: {
        backgroundColor: "#FF3E3E",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    clearButtonDisabled: {
        backgroundColor: "#CBD5E0",
    },
    clearButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },
    listContent: {
        padding: 12,
        paddingBottom: 40,
    },
    row: {
        justifyContent: "space-between",
    },
    card: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        margin: 6,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        position: "relative",
        shadowColor: "#1A202C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#EDF2F7",
    },
    idBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#EDF2F7",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    idText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#718096",
    },
    imageContainer: {
        width: 90,
        height: 90,
        marginTop: 10,
        marginBottom: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    pokemonImage: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: "#E2E8F0",
        borderRadius: 30,
    },
    infoContainer: {
        alignItems: "center",
        marginTop: 4,
    },
    pokemonName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2D3748",
        textAlign: "center",
    },
});