import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import ActivityTypes from '@/constants/ActivityTypes';

const DeleteActivityComponent = () => {
    const { user, token } = useAuthContext();

    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState(ActivityTypes.map(item => ({
        label: item.value,
        value: item.key,
    })));

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchActivities = async () => {
        if (!category || !user?.email) return;

        setLoading(true);
        try {
            const res = await fetch(`${SERVER}/activities/user/${user.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Errore nel recupero attività");

            const filtered = data.filter(act => act.activityTypeId === category);
            setActivities(filtered);
        } catch (err) {
            Alert.alert("Errore", err.message || "Errore imprevisto");
        } finally {
            setLoading(false);
        }
    };

    const deleteActivity = async (id: number) => {
        Alert.alert("Conferma", "Sei sicuro di voler eliminare questa attività?", [
            { text: "Annulla", style: "cancel" },
            {
                text: "Elimina",
                onPress: async () => {
                    try {
                        const res = await fetch(`${SERVER}/activities/${id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        const result = await res.json();
                        if (!res.ok) throw new Error(result.message || 'Errore nella cancellazione');

                        Alert.alert("Eliminata", "Attività eliminata correttamente.");
                        fetchActivities(); // Refresh lista
                    } catch (err) {
                        Alert.alert("Errore", err.message || "Errore sconosciuto");
                    }
                }
            }
        ]);
    };

    useEffect(() => {
        if (category) fetchActivities();
    }, [category]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Elimina Attività</Text>

            <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
                placeholder="Seleziona categoria"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                listMode="MODAL"
            />

            {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

            {!loading && activities.length > 0 && (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ marginTop: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.activityCard}>
                            <Text style={styles.note}>{item.note}</Text>
                            <Button
                                title="Elimina"
                                onPress={() => deleteActivity(item.id)}
                                color="#E53935"
                            />
                        </View>
                    )}
                />
            )}

            {!loading && category && activities.length === 0 && (
                <Text style={{ marginTop: 20, color: 'gray' }}>Nessuna attività trovata per questa categoria.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    dropdown: {
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
    },
    dropdownList: {
        width: '100%',
        borderColor: '#ccc',
    },
    activityCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        width: '100%',
        elevation: 2
    },
    note: {
        marginBottom: 8,
        fontSize: 14
    }
});

export default DeleteActivityComponent;
