import Pokemon from "@/interface/Pokemon";
import { useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { estilos } from "../../layout/layout";       
import Requests from "../../service/PokemonsRequests";
import ShowPokemon from "../ShowPokemon/ShowPokemon";

export default function SearchPokemon() {
    const [typedPokemon, setTypedPokemon] = useState<string>("");
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    const handleSearch = async () => {
        if (!typedPokemon?.trim()) return;
        const data = await Requests.fetchPokemonData(typedPokemon.toLowerCase().trim());

        if (data && data.pokemon_info) {
            const type1 = data.pokemon_info.types[0]?.type.name || "normal";
            const type2 = data.pokemon_info.types[1]?.type.name;

            setPokemon({
                pokemon_name: data.pokemon_info.name,
                pokemon_image: data.pokemon_image,
                pokemon_id: data.pokemon_id,
                types: {
                    type1,
                    type2,
                },
            });
        } else {
            setPokemon(null);
        }

        setTypedPokemon('');
    };

    return (
        <View style={estilos.container}>
            <Image
                source={require('@/assets/images/pokeapp-logo.png')}
                style={estilos.logotipo}
                resizeMode="contain"
            />
            <TextInput
                placeholder="Digite o nome ou o número do pokemon na dex"
                style={styles.textInputPokemon}
                onSubmitEditing={handleSearch}
                onChangeText={setTypedPokemon}
                value={typedPokemon}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {pokemon && (
                <ShowPokemon pokemon={pokemon} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    textInputPokemon: {
        borderColor: 'rgb(164, 0, 0)',
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        width: "100%"
    }
});