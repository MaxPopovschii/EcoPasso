import ActivityTypes from '@/constants/ActivityTypes';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/contexts/authContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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
            if (!res.ok) throw new Error(data.message ?? "Errore nel recupero attività");

            const filtered = data.filter(act => act.activityTypeId === category);
            setActivities(filtered);
        } catch (err) {
            Alert.alert("Errore", err.message ?? "Errore imprevisto");
        } finally {
            setLoading(false);
        }
    };

    const deleteActivity = async (id: number) => {
        Alert.alert("Conferma", "Sei sicuro di voler eliminare questa attività?", [
            { text: "Annulla", style: "cancel" },
            {
                text: "Elimina",
                style: "destructive",
                onPress: () => {
                    (async () => {
                        try {
                            const res = await fetch(`${SERVER}/activities/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            const result = await res.json();
                            if (!res.ok) throw new Error(result.message ?? 'Errore nella cancellazione');

                            Alert.alert("Eliminata", "Attività eliminata correttamente.");
                            fetchActivities(); // Refresh lista
                        } catch (err) {
                            Alert.alert("Errore", err.message ?? "Errore sconosciuto");
                        }
                    })();
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
                zIndex={1000}
                zIndexInverse={1000}
            />

            {loading && <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#4CAF50" />}

            {!loading && activities.length > 0 && (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ marginTop: 24, paddingBottom: 24 }}
                    renderItem={({ item }) => (
                        <View style={styles.activityCard}>
                            <View style={styles.cardContent}>
                                <MaterialIcons name="event-note" size={28} color="#2196F3" style={{ marginRight: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.note} numberOfLines={2}>{item.note}</Text>
                                    <Text style={styles.date}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => deleteActivity(item.id)}
                                    accessibilityLabel="Elimina attività"
                                    accessibilityRole="button"
                                >
                                    <MaterialIcons name="delete" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {!loading && category && activities.length === 0 && (
                <Text style={styles.emptyText}>Nessuna attività trovata per questa categoria.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        flex: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#2196F3',
        letterSpacing: 1,
    },
    dropdown: {
        width: '100%',
        marginBottom: 18,
        borderColor: '#4CAF50',
        borderRadius: 12,
        backgroundColor: '#f8f8f8',
    },
    dropdownList: {
        width: '100%',
        borderColor: '#4CAF50',
        borderRadius: 12,
    },
    activityCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 14,
        borderRadius: 14,
        width: '100%',
        elevation: 3,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    note: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
        fontWeight: '500',
    },
    date: {
        fontSize: 13,
        color: '#888',
    },
    deleteBtn: {
        backgroundColor: '#E53935',
        borderRadius: 24,
        padding: 8,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    emptyText: {
        marginTop: 40,
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default DeleteActivityComponent;
