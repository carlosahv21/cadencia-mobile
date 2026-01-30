import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@search_history';

export const useSearchHistory = () => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setHistory(JSON.parse(saved));
    };

    const addToHistory = async (item: any) => {
        // Evitar duplicados y mantener solo los últimos 10
        const newHistory = [item, ...history.filter(h => h.id !== item.id)].slice(0, 10);
        setHistory(newHistory);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const clearHistory = async () => {
        setHistory([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    return { history, addToHistory, clearHistory };
};